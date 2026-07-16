# Segurança e Confidencialidade — RDS Fintech

## Criptografia

- **Em trânsito**: TLS 1.2+ obrigatório em todas as camadas — do cliente ao CloudFront/ALB, e do BFF ao provedor BaaS. HSTS habilitado (`Strict-Transport-Security`, ver `security.middleware.ts`).
- **Em repouso**: DynamoDB com criptografia via AWS KMS (CMK) na tabela inteira, **mais** uma camada de criptografia de campo (AES-256-GCM) aplicada a dados pessoais sensíveis — CPF, endereço, telefone, renda — antes da gravação (`backend/src/utils/crypto.ts`). Isso significa que, mesmo com acesso à tabela, esses campos permanecem ilegíveis sem a chave de aplicação.
- **Lookup sem exposição**: buscas por CPF usam um hash HMAC determinístico (`hashForLookup`) como chave de índice, nunca o CPF em texto claro.
- Chaves gerenciadas via **AWS Secrets Manager** / KMS, com rotação periódica — nunca hardcoded ou versionadas em `.env`.

## Ofuscação de logs

- Logger estruturado (`pino`) com lista de `redact` para campos sensíveis (`cpf`, `password`, tokens, `monthlyIncome`, `cookie`, `authorization`) — ver `backend/src/utils/logger.ts`.
- CPFs exibidos em mensagens de log usam `maskCpf()` (ex.: `123.***.***-45`), nunca o valor completo.
- Nenhum log inclui corpo de requisição bruto em rotas transacionais.

## Autenticação e sessão

- **JWT de curta duração** (padrão 10 minutos) para o access token, reduzindo a janela de exposição em caso de vazamento (`JWT_ACCESS_EXPIRES_IN`).
- Refresh token de vida mais longa armazenado em **cookie `httpOnly`, `Secure`, `SameSite=Strict`**, com escopo restrito ao path `/api/auth/refresh` — nunca acessível via JavaScript no browser.
- Produção: senha nunca comparada em texto claro (hash Argon2id + salt único por usuário) e MFA obrigatório para operações de alto valor (contratação de empréstimo, alteração de chave Pix).

## Proteção contra XSS

- Content-Security-Policy restritiva via Helmet (`default-src 'self'`, `object-src 'none'`, sem `unsafe-inline` em scripts).
- Validação estrita de entrada com **Zod** em todas as rotas (`validateBody`) antes de qualquer lógica de negócio — payloads malformados são rejeitados com 400 sem tocar em services.
- React/Next.js escapa por padrão todo conteúdo renderizado (sem uso de `dangerouslySetInnerHTML`).

## Proteção contra CSRF

- Cookies de sessão/refresh com `SameSite=Strict`.
- Double-submit cookie pattern via `csrf-csrf` (`doubleCsrfProtection`) para rotas que dependem de cookies — o cliente deve enviar o token CSRF em um header (`x-csrf-token`) que é validado contra o cookie.
- CORS restrito a uma allowlist (`CORS_ORIGIN`), com `credentials: true` apenas para a origem oficial do frontend.

## Rate limiting

Limites em camadas, mais rígidos quanto mais sensível a rota (`backend/src/middlewares/rateLimiter.middleware.ts`):

| Camada | Janela | Limite | Rotas |
|---|---|---|---|
| Geral | 1 min | 120 req | Toda a API |
| Autenticação | 15 min | 10 req | `/api/auth/login` |
| KYC | 1 hora | 5 req | `/api/kyc/register` |
| Transacional | 1 min | 8 req | `/api/pix/*`, `/api/boleto/*`, `/api/loan/*` |

Em produção, recomenda-se complementar com **AWS WAF rate-based rules** na borda (CloudFront/ALB), para mitigar antes mesmo de a requisição chegar à aplicação.

## Outras práticas

- Payload JSON limitado a 50kb (`express.json({ limit: "50kb" })`) — mitiga ataques de payload excessivo.
- Handler de erros central nunca retorna stack traces ou mensagens internas do provedor BaaS ao cliente.
- Infraestrutura com princípio de menor privilégio: EC2 sem IP público, Security Groups mínimos, acesso ao DynamoDB via VPC Endpoint, credenciais AWS via IAM Role (nunca access keys estáticas).
- Webhooks do provedor BaaS validados por assinatura HMAC e processados de forma idempotente (evita replay/duplicidade de transações).
