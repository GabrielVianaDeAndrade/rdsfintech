# Deploy do frontend na Vercel

Este repositório é um **monorepo** — não existe `package.json` na raiz, apenas
em `frontend/` e `backend/`. A Vercel precisa saber onde está a aplicação.

O [`vercel.json`](../vercel.json) na raiz resolve isso com o modelo de
[**services**](https://vercel.com/docs/services):

```json
{
  "services": {
    "frontend": { "root": "frontend", "framework": "nextjs" }
  },
  "rewrites": [
    { "source": "/(.*)", "destination": { "service": "frontend" } }
  ]
}
```

## ⚠️ O `rewrites` não é opcional

Um service é **interno por padrão** e não recebe tráfego da internet. É o
rewrite de catch-all que expõe o frontend publicamente. Sem ele, o deploy
sobe normalmente mas o site **não responde nada** — um erro silencioso e
difícil de diagnosticar.

> **Requisito:** o modelo `services` exige a permissão *Services* habilitada
> na conta/time da Vercel. Se o deploy falhar reclamando da chave `services`,
> use a alternativa sem `vercel.json`: apague o arquivo e configure
> **Settings → General → Root Directory** → `frontend`. As duas abordagens são
> equivalentes para o caso de um único frontend.

## Passo a passo

1. **New Project** → importe `GabrielVianaDeAndrade/rdsfintech`.
2. A Vercel lê o `vercel.json` da raiz e monta o service `frontend`.
3. **Environment Variables** (opcional agora, obrigatório quando o BFF subir):

   | Nome | Valor | Para quê |
   |---|---|---|
   | `NEXT_PUBLIC_API_URL` | `https://api.rdsfintech.com.br` | URL do BFF. Entra no `connect-src` da CSP — **sem ela, o browser bloqueia as chamadas à API** |

4. **Deploy**.

Build Command, Output Directory e Install Command ficam no padrão da Vercel.

## Por que o backend não está no `vercel.json`

O modelo de `services` permitiria subir o BFF junto (`/api/*` → backend), mas
ele foi **deliberadamente deixado de fora**:

- A [arquitetura](ARCHITECTURE.md) coloca o BFF em EC2 dentro de uma **VPC
  privada, sem exposição direta à internet**. Publicá-lo na Vercel o tornaria
  um endpoint público, invertendo essa decisão de segurança.
- O [`env.ts`](../backend/src/config/env.ts) tem *fallbacks* de
  desenvolvimento (`"dev-only-access-secret"`) visíveis neste repositório
  público. Um deploy sem todas as variáveis configuradas assinaria JWT com um
  segredo que qualquer pessoa lê no GitHub — permitindo forjar tokens de
  qualquer usuário.

Se um dia fizer sentido publicar o backend na Vercel, os pré-requisitos são:
definir **todos** os segredos como Environment Variables antes do primeiro
deploy, adaptar o `server.ts` (hoje ele faz `app.listen()`, modelo de servidor
contínuo) e revisar o desenho de rede em `ARCHITECTURE.md`.

## O que já está configurado no código

### Headers de segurança
Aplicados via `headers()` em [`frontend/next.config.js`](../frontend/next.config.js)
e verificados em produção:

- `Content-Security-Policy` (com `frame-ancestors 'none'`, `object-src 'none'`)
- `Strict-Transport-Security` (2 anos, includeSubDomains, preload)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy` (câmera, microfone, geolocalização e pagamento bloqueados)
- `X-Powered-By` removido (`poweredByHeader: false`)

### Dois alvos de build no mesmo código
- **Vercel (padrão)**: `npm run build` — Next.js nativo, com headers e espaço
  para SSR/middleware no futuro.
- **S3 + CloudFront**: `BUILD_TARGET=static npm run build` — gera `out/` com
  export estático (ver [ARCHITECTURE.md](ARCHITECTURE.md)).

> **Atenção:** no modo estático o Next **ignora** `headers()`. Se optar pelo
> S3, os headers acima precisam ser reconfigurados como *Response Headers
> Policy* no CloudFront, senão o site vai ao ar sem nenhum deles.

## Limitações conhecidas

- **CSP com `'unsafe-inline'` em `script-src`**: o Next.js injeta scripts
  inline de hidratação; sem *nonce*, a diretiva é necessária. Endurecer para
  CSP baseada em nonce (via middleware) é o próximo passo natural — e aí o
  modo estático deixa de ser viável.
- **O painel roda com dados fictícios** salvos no `localStorage` do
  navegador. O que for publicado na Vercel agora é uma demonstração
  navegável, não uma conta real — nenhum dado sai do dispositivo.

## Quando o backend subir

O BFF **não** vai para a Vercel: ele roda em EC2 dentro da VPC privada
(ver [ARCHITECTURE.md](ARCHITECTURE.md)). Dois ajustes serão necessários:

1. `CORS_ORIGIN` no backend precisa apontar para o domínio da Vercel
   (ex.: `https://rdsfintech.vercel.app` ou o domínio final), senão o browser
   bloqueia as requisições.
2. `NEXT_PUBLIC_API_URL` na Vercel precisa apontar para o BFF.

Como a Vercel gera uma URL diferente por deploy de preview, considere liberar
no CORS apenas o domínio de produção e usar um ambiente de staging dedicado
para os previews — em vez de liberar `*.vercel.app`, que abriria a API para
qualquer projeto hospedado na plataforma.
