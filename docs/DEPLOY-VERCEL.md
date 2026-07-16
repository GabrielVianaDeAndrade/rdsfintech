# Deploy do frontend na Vercel

## ⚠️ Passo obrigatório: Root Directory

Este repositório é um **monorepo** — não existe `package.json` na raiz, apenas
em `frontend/` e `backend/`. Se você importar o projeto e clicar em Deploy
direto, **a build falha** com "Couldn't find any `pages` or `app` directory"
ou "No Next.js version detected", porque a Vercel procura o projeto na raiz.

Na tela de importação (ou depois, em **Settings → General**):

> **Root Directory** → `frontend`

Com isso a Vercel detecta o Next.js sozinha e o resto funciona no padrão —
nenhum `vercel.json` é necessário.

## Passo a passo

1. **New Project** → importe `GabrielVianaDeAndrade/rdsfintech`.
2. **Root Directory**: mude de `./` para **`frontend`** (passo acima).
3. **Framework Preset**: deve aparecer `Next.js` automaticamente. Se aparecer
   "Other", o Root Directory não foi aplicado — volte ao passo 2.
4. **Environment Variables** (opcional agora, obrigatório quando o BFF subir):

   | Nome | Valor | Para quê |
   |---|---|---|
   | `NEXT_PUBLIC_API_URL` | `https://api.rdsfintech.com.br` | URL do BFF. Entra no `connect-src` da CSP — **sem ela, o browser bloqueia as chamadas à API** |

5. **Deploy**.

Build Command, Output Directory e Install Command ficam no padrão da Vercel.

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
