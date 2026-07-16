# RDS Fintech

Plataforma web da RDS Fintech: Landing Page institucional + Internet Banking
(Dashboard pós-login), com backend BFF preparado para integração com um
provedor de Banking as a Service (BaaS).

## Estrutura de pastas

```
rdsfintech/
├── frontend/                      # Next.js 14 (App Router) + Tailwind + Framer Motion
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing Page
│   │   └── dashboard/page.tsx      # Dashboard pós-login (estilo Nubank)
│   ├── components/
│   │   ├── landing/                # Header, Hero (iPhone animado), simulador de
│   │   │   │                       # empréstimo, formulário KYC, modal de cadastro
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroPhone.tsx
│   │   │   ├── LoanSimulator.tsx
│   │   │   ├── KycForm.tsx
│   │   │   ├── SignupModal.tsx
│   │   │   ├── ValueProps.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/               # Cards independentes: saldo, Pix, boleto, empréstimo
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── ActivityList.tsx
│   │   │   ├── PixModule.tsx
│   │   │   ├── BoletoModule.tsx
│   │   │   └── LoanModule.tsx
│   │   └── ui/                      # Componentes reutilizáveis (Sheet/bottom-sheet)
│   └── lib/                         # utils, types, simulação de empréstimo
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

## Documentação

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura de hospedagem AWS (S3 + CloudFront, Route 53, EC2 em VPC privada, DynamoDB).
- [docs/SECURITY.md](docs/SECURITY.md) — criptografia (E2EE de campo + KMS), ofuscação de logs, JWT de curta duração, proteção XSS/CSRF, rate limiting.
