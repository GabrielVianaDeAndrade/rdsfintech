# RDS Fintech

Plataforma web da RDS Fintech: Landing Page institucional + Internet Banking
(Dashboard pós-login), com backend BFF preparado para integração com um
provedor de Banking as a Service (BaaS).

## Estrutura de pastas

```
rdsfintech/
├── frontend/                      # Next.js 14 (App Router) + Tailwind + Framer Motion
│   ├── app/
│   │   ├── layout.tsx               # Providers (estado + toasts)
│   │   ├── page.tsx                 # Landing Page
│   │   ├── login/page.tsx           # Login (página dedicada, não modal)
│   │   ├── cadastro/page.tsx        # Abertura de conta / KYC em 2 etapas
│   │   ├── simulacao/page.tsx       # Simulação pública de empréstimo
│   │   └── dashboard/               # Área logada — uma página por módulo
│   │       ├── page.tsx             # Início (saldo, atalhos, atividade)
│   │       ├── pix/page.tsx         # Enviar, receber e chaves
│   │       ├── boleto/page.tsx      # Pagar, emitir e histórico
│   │       ├── cartao/page.tsx      # Cartões físico/virtual, bloqueio, limite
│   │       ├── emprestimo/page.tsx  # Simular e contratar (prazo livre)
│   │       ├── perfil/page.tsx      # Dados pessoais e segurança
│   │       ├── notificacoes/page.tsx
│   │       ├── depositar/page.tsx
│   │       └── extrato/page.tsx
│   ├── components/
│   │   ├── landing/                 # Header, Hero (iPhone completo animado),
│   │   │                            # Products, Security, CTA, Footer
│   │   ├── dashboard/               # DashboardShell (nav + sininho), TransactionList
│   │   ├── shared/                  # LoanCalculator (prazo livre de 1 a 60 meses)
│   │   └── ui/                      # BackButton, Field, Toast, Logo, AuthShell
│   └── lib/
│       ├── store.tsx                # Estado da conta (dados fictícios + localStorage)
│       ├── types.ts
│       └── utils.ts                 # Máscaras, formatação e cálculo Price/CET
│
├── backend/                        # Node.js + Express + TypeScript (BFF)
│   └── src/
│       ├── routes/                  # auth, kyc, pix, boleto, loan
│       ├── controllers/
│       ├── services/
│       │   └── baas/                # Interface BaasProvider + adapters (HTTP real / mock)
│       ├── middlewares/             # auth (JWT), rate limit, security (helmet/cors/csrf)
│       ├── models/                  # Entidades DynamoDB (single-table design)
│       ├── schemas/                 # Validação de entrada (Zod)
│       ├── utils/                   # logger, jwt, criptografia de campo (AES-256-GCM)
│       └── config/
│
├── docs/
│   ├── ARCHITECTURE.md              # Arquitetura AWS (S3, Route 53, EC2/VPC, DynamoDB)
│   └── SECURITY.md                  # Criptografia, JWT, XSS/CSRF, rate limiting, logs
│
└── .claude/launch.json              # Config de preview do frontend
```

## Rodando localmente

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Backend
```bash
cd backend
cp .env.example .env   # ajuste os segredos antes de subir em produção
npm install
npm run dev             # http://localhost:4000
```

Em desenvolvimento, o backend usa `MockBaasProvider` (respostas simuladas em
memória). Para produção, defina `NODE_ENV=production` e as credenciais do
provedor BaaS real em `.env` — a troca de implementação é feita em
[`backend/src/services/baas/baas.factory.ts`](backend/src/services/baas/baas.factory.ts)
sem alterar nenhum controller ou rota.

## Estado da demonstração (dados fictícios)

Enquanto a API do BaaS não está integrada, o painel é **totalmente navegável**
com dados fictícios: enviar Pix debita o saldo, emitir boleto gera linha
digitável, bloquear cartão altera o cartão, contratar empréstimo credita a
conta e dispara notificação.

Esse estado vive em [`frontend/lib/store.tsx`](frontend/lib/store.tsx) e é
salvo no `localStorage` do navegador, sobrevivendo a recarregamentos. Cada
ação do store tem um endpoint equivalente já mapeado no backend — quando a API
entrar, o corpo das funções vira uma chamada `fetch` e os componentes não
mudam. Para voltar aos dados originais: **Perfil → Restaurar dados originais**.

Login de demonstração: qualquer CPF válido (11 dígitos) e senha com 8+
caracteres.

## Deploy

O frontend suporta dois alvos a partir do mesmo código:

```bash
npm run build                      # Vercel (padrão) — Next.js nativo + headers de segurança
BUILD_TARGET=static npm run build  # S3 + CloudFront — export estático em out/
```

Para publicar na Vercel, o **Root Directory precisa ser `frontend`** (é um
monorepo, sem `package.json` na raiz) — passo a passo em
[docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md).

## Documentação

- [docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md) — publicação do frontend na Vercel e variáveis de ambiente.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura de hospedagem AWS (S3 + CloudFront, Route 53, EC2 em VPC privada, DynamoDB).
- [docs/SECURITY.md](docs/SECURITY.md) — criptografia (E2EE de campo + KMS), ofuscação de logs, JWT de curta duração, proteção XSS/CSRF, rate limiting.
