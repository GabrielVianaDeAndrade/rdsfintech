# Do protótipo à operação real

Este documento responde: **banco de dados, gateway de pagamento, Pix,
empréstimo com aprovação manual e Open Finance** — o que é preciso, em que
ordem, e o que precisa ser decidido antes de escrever código.

> ⚠️ **Não sou advogado e isto não é parecer jurídico.** A seção 1 trata de
> regulação financeira porque ela determina a arquitetura inteira — mas as
> decisões precisam passar por um advogado especializado em direito bancário
> e, provavelmente, por consulta ao Banco Central.

---

## 1. O ponto que muda tudo: quem pode emprestar dinheiro

A ideia descrita — *"as solicitações vão para o administrador, ele analisa e
decide se aceita; se aceitar, o valor é creditado em 24h"* — é, na prática,
**concessão de crédito ao público**. No Brasil isso não é uma decisão de
produto, é uma atividade regulada pelo Banco Central.

Emprestar capital próprio ao público de forma habitual e profissional, sem
autorização, esbarra em dois pontos:

- **Lei 4.595/64 + Lei 7.492/86 (art. 16)**: operar instituição financeira sem
  autorização do BACEN é crime, não apenas irregularidade administrativa.
- **Decreto 22.626/33 (Lei da Usura)**: quem **não** é instituição financeira
  autorizada fica limitado a **12% ao ano**. A taxa do protótipo (~2,5% a.m.,
  ou ~34% a.a.) só é lícita para quem tem autorização.

### Os caminhos que existem

| Caminho | O que é | Esforço |
|---|---|---|
| **Correspondente bancário** | Você origina o cliente, mas quem empresta é um banco/financeira parceira. Regulado pela Res. 4.935/21. | Menor — é o caminho comum para começar |
| **Parceria com SCD** | Uma Sociedade de Crédito Direto já autorizada empresta; você é a camada de tecnologia e originação | Médio — vários players oferecem isso como serviço |
| **Virar uma SCD** | Autorização própria junto ao BACEN. Capital mínimo (R$ 1M), plano de negócios, governança, compliance, PLD/FT | Alto — meses a anos, custo relevante |
| **Emprestar capital próprio** | Sem autorização | **Não é caminho** — vide acima |

**Consequência prática para o código:** no modelo de correspondente ou
parceria com SCD, o "administrador aprovando no painel" não é a decisão final
— é uma **pré-análise**. A concessão, o contrato (CCB), o registro e o
desembolso são da instituição autorizada, via API dela. Isso muda o que o
painel faz: ele deixa de "aprovar empréstimo" e passa a "aprovar o envio da
proposta ao parceiro".

Vale resolver isso **antes** de construir o resto, porque define qual API você
integra.

---

## 2. Banco de dados

O plano atual em [ARCHITECTURE.md](ARCHITECTURE.md) é **DynamoDB**. Para o
fluxo descrito, ele é a escolha errada:

- O painel admin precisa de consultas como *"propostas pendentes, ordenadas
  por data, filtradas por faixa de valor, com o perfil do solicitante"*.
  Isso é `JOIN` + filtro dinâmico — exatamente o que o DynamoDB torna difícil
  e caro (exige modelar índice por padrão de acesso, ou varreduras).
- Crédito exige **transação atômica** (debitar limite, criar contrato, lançar
  movimentação). Postgres dá isso nativamente.
- Dados financeiros pedem trilha de auditoria e relatórios — território de SQL.

**Recomendação: PostgreSQL.** Como o frontend está na Vercel:

| Opção | Por quê |
|---|---|
| **Neon** (via Vercel Marketplace) | Integração de 1 clique, serverless, branch de banco por PR |
| **Supabase** | Postgres + auth + storage + painel pronto. Bom se quiser acelerar |
| **RDS Postgres** | Se mantiver o backend em EC2/VPC, fica tudo na mesma rede privada |

Com **Prisma** ou **Drizzle** como ORM (migrations versionadas — obrigatório
em produção).

### Cuidados de LGPD no schema
- CPF, renda e endereço cifrados na aplicação (o
  [`crypto.ts`](../backend/src/utils/crypto.ts) já faz isso — reaproveitar).
- CPF indexado por hash HMAC, nunca em texto claro (já implementado).
- Tabela de auditoria: quem acessou/alterou qual proposta e quando.
- Política de retenção: por quanto tempo guardar dados de proposta recusada.

---

## 3. Pagamentos: gateway ≠ BaaS (a distinção que mais confunde)

**Você não integra o Pix diretamente.** O Pix é operado pelo BACEN e só
instituições autorizadas participam. Todo mundo passa por um intermediário — e
existem dois tipos, que resolvem problemas diferentes:

### Gateway / subadquirente — *"quero receber dinheiro"*
Asaas, Efí (Gerencianet), Mercado Pago, Pagar.me, Stripe.

Você recebe Pix e boleto **numa conta da empresa**. Serve para cobrar clientes.
Barato, rápido de integrar, cadastro em dias.

### BaaS — *"quero dar uma conta a cada cliente"*
Celcoin, Dock, Swap, Matera, QI Tech, Zoop, Iugu.

Cada usuário ganha **conta própria, saldo próprio e chave Pix própria**. É o
que o protótipo promete na tela: conta digital, chaves Pix do usuário,
extrato, cartão.

> **O RDS Fintech, como está desenhado, precisa de BaaS — não de gateway.**
> A tela de "minhas chaves Pix" só existe se cada cliente tiver uma conta real
> na instituição parceira. Gateway não faz isso.

O código já está preparado: a interface
[`BaasProvider`](../backend/src/services/baas/baas.types.ts) define o contrato,
e trocar o mock pelo provedor real acontece só em
[`baas.factory.ts`](../backend/src/services/baas/baas.factory.ts) — nenhum
controller muda. Vários BaaS brasileiros também já oferecem o crédito
(seção 1) no mesmo contrato, o que resolveria dois problemas de uma vez.

### O que perguntar ao escolher o BaaS
1. Abrem conta para PF com KYC via API? Quem responde pelo KYC?
2. Pix: chave, QR estático/dinâmico, envio e **webhook de confirmação**?
3. Oferecem crédito/CCB com instituição autorizada? (liga com a seção 1)
4. Cartão (físico/virtual) está no mesmo contrato?
5. Preço por conta ativa, por transação e volume mínimo mensal
6. Sandbox de verdade e tempo real de homologação

---

## 4. O painel do administrador (e por que Excel é uma má ideia)

### Sobre a planilha
A ideia de mandar as propostas para uma planilha tem um problema sério:
**a planilha teria CPF, endereço, renda e telefone de pessoas reais.**

Isso significa: um arquivo no notebook de alguém, provavelmente circulando por
e-mail/WhatsApp, sem controle de acesso, sem registro de quem viu o quê, sem
como apagar depois. Sob a LGPD, dado financeiro é **dado sensível na prática**
e vazamento aqui gera responsabilidade real — além de ser exatamente o
contrário da confidencialidade que o site promete ao cliente.

**Não use planilha como sistema.** Use como *relatório*: exportação sob
demanda, a partir do painel, com log de quem exportou, e de preferência
mascarando CPF (`312.***.***-01`).

### O painel
```
/admin                      ← lista de propostas (pendente / aprovada / recusada)
/admin/proposta/[id]        ← detalhe + histórico + decisão
/admin/exportar             ← CSV/XLSX com log de auditoria
```

Requisitos que **não** são opcionais:
- **Papel de admin** no JWT (`scope: "admin"` — o
  [`requireScope`](../backend/src/middlewares/auth.middleware.ts) já existe)
- **2FA obrigatório** para admin: essa conta move dinheiro
- **Auditoria imutável**: quem aprovou, quando, de qual IP, com qual valor
- **Segregação**: quem aprova não deveria ser quem cadastra (evita fraude interna)
- Nunca expor o `/admin` sem rate limit e sem allowlist de IP, se possível

### Máquina de estados da proposta
```
solicitada → em_analise → aprovada → em_desembolso → creditada
                       ↘ recusada
                       ↘ expirada
```
Estado explícito no banco, com transições registradas. "24 horas para creditar"
vira um SLA medido sobre `aprovada → creditada`.

---

## 5. O crédito em até 24h

Fluxo, do clique do admin ao dinheiro na conta:

1. Admin aprova → grava `aprovada` + registro de auditoria (transação atômica)
2. Enfileira o desembolso — **não** faça a transferência dentro do request HTTP
3. Worker consome a fila e chama o parceiro (`POST /transfers` do BaaS)
4. Webhook do parceiro confirma → estado vira `creditada` → notifica o cliente
5. Falhou? Retry com backoff; após N tentativas, alerta humano

**Dois detalhes que causam prejuízo real se ignorados:**

- **Idempotência**: toda chamada de transferência precisa de uma chave de
  idempotência (geralmente o `id` da proposta). Sem isso, um retry credita o
  valor duas vezes — e você não recupera esse dinheiro.
- **Webhook autenticado**: valide a assinatura HMAC (o
  [`httpBaas.provider.ts`](../backend/src/services/baas/httpBaas.provider.ts)
  já assina requisições; falta o caminho inverso). Sem validar, qualquer um
  posta um "pagamento confirmado" na sua API.

Onde rodar a fila: se o backend ficar em EC2, um worker + SQS. Se migrar tudo
para a Vercel, Vercel Queues + Cron. O SLA de 24h é folgado para qualquer uma
das duas.

---

## 6. Open Finance: você precisa?

**Não. Não para o que você descreveu.**

Open Finance é o compartilhamento de dados entre instituições **autorizadas**,
mediante consentimento do cliente. Duas consequências:

1. Para ser participante, você precisa ser instituição autorizada — o mesmo
   obstáculo da seção 1. Não é uma API que se assina.
2. Ele não movimenta seu dinheiro nem aprova empréstimo. Ele **traz dados** de
   outros bancos.

O que você provavelmente quer resolver é: *"como sei que a renda declarada é
verdadeira e se essa pessoa paga as contas?"* — e isso se resolve com **bureau
de crédito**, não com Open Finance:

| Ferramenta | Para quê |
|---|---|
| **Serasa Experian / Boa Vista / SPC / Quod** | Score, negativação, histórico. É o feijão com arroz da análise |
| **Pluggy, Belvo, Klavi, Quanto** | Agregadores que usam Open Finance **como intermediários licenciados** — dão extrato bancário do cliente com consentimento. Útil para comprovar renda sem pedir PDF |
| **Receita Federal / Serpro** | Validar se o CPF existe e está regular |

**Sugestão:** comece com bureau + renda declarada + análise manual (que é
exatamente o seu plano). Agregador de Open Finance faz sentido depois, quando
o volume justificar automatizar a comprovação de renda.

---

## 7. Ordem sugerida

| # | Etapa | Por que nesta ordem |
|---|---|---|
| 0 | **Advogado + definição do modelo regulatório** | Define qual API você integra. Tudo depende disso |
| 1 | Postgres + Prisma; migrar o mock do `localStorage` para a API real | Sem persistência real, nada mais existe |
| 2 | Auth de verdade: Argon2id, refresh token, 2FA no admin | Antes de qualquer dado real entrar |
| 3 | Contratar o BaaS; trocar o mock na `baas.factory.ts` | O contrato já está pronto no código |
| 4 | Conta digital: KYC real, Pix receber/enviar, webhooks assinados | Fundação do produto |
| 5 | Painel admin + auditoria + máquina de estados | Aqui entra o seu fluxo de aprovação |
| 6 | Fila de desembolso idempotente + SLA de 24h | Depois que aprovar existe |
| 7 | Bureau de crédito | Melhora a decisão que já é tomada |
| 8 | Open Finance via agregador | Otimização, quando o volume pedir |

**Etapas 0 a 2 são pré-requisito para receber dados de uma pessoa real.**
Enquanto elas não estiverem prontas, o site deve deixar explícito que é uma
demonstração — como está hoje.
