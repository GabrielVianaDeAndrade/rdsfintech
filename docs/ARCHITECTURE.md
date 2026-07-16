# Arquitetura — RDS Fintech

## Visão geral

```
                         ┌──────────────────────────┐
                         │        Route 53           │
                         │  app.rdsfintech.com.br    │
                         │  api.rdsfintech.com.br    │
                         └─────────────┬─────────────┘
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 ▼                                           ▼
     ┌───────────────────────┐                  ┌──────────────────────────┐
     │   CloudFront (CDN)     │                  │   ALB (Application LB)   │
     │  + WAF (regras OWASP)  │                  │   TLS termination        │
     └───────────┬────────────┘                  └─────────────┬────────────┘
                 │                                              │
                 ▼                                              ▼
     ┌───────────────────────┐                  ┌──────────────────────────┐
     │   S3 (frontend         │                  │        VPC privada       │
     │   estático Next.js)    │                  │  ┌────────────────────┐  │
     └────────────────────────┘                  │  │  Subnets privadas   │  │
                                                  │  │  EC2 / ASG (BFF)    │  │
                                                  │  │  Node.js + Express  │  │
                                                  │  └─────────┬──────────┘  │
                                                  │            │             │
                                                  │            ▼             │
                                                  │  ┌────────────────────┐  │
                                                  │  │  VPC Endpoint       │  │
                                                  │  │  (DynamoDB, sem     │  │
                                                  │  │  saída p/ internet) │  │
                                                  │  └─────────┬──────────┘  │
                                                  └────────────┼─────────────┘
                                                                │
                                                                ▼
                                                  ┌──────────────────────────┐
                                                  │   NAT Gateway (subnet    │
                                                  │   pública) — única saída │
                                                  │   controlada p/ o BaaS   │
                                                  └─────────────┬────────────┘
                                                                │
                                                                ▼
                                                  ┌──────────────────────────┐
                                                  │  Provedor BaaS externo    │
                                                  │  (PIX / Boleto / Crédito) │
                                                  └──────────────────────────┘

                         ┌──────────────────────────┐
                         │        DynamoDB           │
                         │  (single-table design)    │
                         │  criptografia at-rest KMS │
                         └──────────────────────────┘
```

## Componentes

### Frontend (S3 + CloudFront + Route 53)
- Build estático do Next.js (`next build` com `output: "export"`) publicado em um bucket S3 privado.
- Bucket acessível apenas via **Origin Access Control (OAC)** do CloudFront — nunca público diretamente.
- CloudFront com **AWS WAF** habilitado (regras gerenciadas: SQLi, XSS, rate-based rules).
- Route 53 gerencia `app.rdsfintech.com.br` (frontend) e `api.rdsfintech.com.br` (backend), com certificados TLS via ACM.

### Backend (EC2 em VPC privada)
- O BFF (Node.js/Express) roda em instâncias EC2 dentro de **subnets privadas**, sem IP público e sem rota direta para a internet.
- Exposição externa apenas via **Application Load Balancer** em subnet pública, com TLS terminado no ALB (TLS 1.2+).
- Auto Scaling Group com mínimo de 2 instâncias em AZs distintas para alta disponibilidade.
- Security Groups com regras mínimas: ALB → EC2 na porta da aplicação; EC2 → DynamoDB via VPC Endpoint; EC2 → NAT Gateway apenas para chamadas ao provedor BaaS.
- Autenticação com a AWS via **IAM Role da instância** (nunca access keys estáticas).

### Rede (VPC)
- VPC dedicada com subnets públicas (ALB, NAT Gateway) e subnets privadas (EC2, futuras réplicas de cache).
- **VPC Endpoint (Gateway)** para DynamoDB — tráfego para o banco nunca sai para a internet pública.
- NAT Gateway como único ponto de saída controlado, usado exclusivamente para chamadas HTTPS ao provedor BaaS.
- Network ACLs complementando os Security Groups (defesa em profundidade).

### Dados (DynamoDB)
- Modelagem **single-table** (ver `backend/src/models/*.model.ts`) otimizada para os padrões de acesso do app: perfil do usuário, histórico de transações e propostas de empréstimo por `userId`.
- Criptografia at-rest via **AWS KMS** (chave gerenciada pelo cliente — CMK) habilitada na tabela.
- Campos sensíveis (CPF, endereço, telefone, renda) também são cifrados **na camada de aplicação** (AES-256-GCM) antes de persistir — dupla camada de proteção (ver `backend/src/utils/crypto.ts`).
- Point-in-time recovery (PITR) habilitado para recuperação de desastres.

### Integração BaaS
- O backend nunca expõe credenciais do provedor BaaS ao frontend; toda chamada é orquestrada pelo BFF.
- Requisições ao BaaS são assinadas (HMAC) e autenticadas via client credentials (ver `backend/src/services/baas/httpBaas.provider.ts`).
- Webhooks do BaaS (confirmação de PIX/boleto) devem ser validados por assinatura (`BAAS_WEBHOOK_SECRET`) e processados de forma idempotente.

## Deploy (visão geral)
1. **Frontend**: pipeline de CI builda o Next.js (`npm run build`) e sincroniza `out/` para o bucket S3, seguido de invalidação do cache CloudFront.
2. **Backend**: pipeline builda a imagem/artefato Node.js, publica em um bucket de artefatos e atualiza o Launch Template do Auto Scaling Group (rolling deploy, zero downtime).
3. Segredos (JWT secrets, chave de criptografia, credenciais do BaaS) ficam no **AWS Secrets Manager**, injetados nas instâncias EC2 via IAM Role — nunca em arquivos `.env` versionados.
