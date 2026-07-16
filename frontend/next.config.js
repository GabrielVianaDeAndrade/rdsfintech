/**
 * Dois alvos de deploy suportados pelo mesmo código:
 *
 *  - Vercel (padrão): Next.js roda nativamente, o que habilita headers de
 *    segurança via headers() e, futuramente, middleware/SSR.
 *  - S3 + CloudFront: `BUILD_TARGET=static npm run build` gera export
 *    estático em out/ (ver docs/ARCHITECTURE.md). Nesse modo o Next ignora
 *    headers() — a segurança passa a ser responsabilidade do CloudFront
 *    (Response Headers Policy).
 */
const isStaticExport = process.env.BUILD_TARGET === "static";

// URL do BFF: precisa entrar no connect-src, senão a CSP bloqueia as chamadas.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

const csp = [
  "default-src 'self'",
  // Next.js injeta scripts inline para hidratação; sem nonce, 'unsafe-inline'
  // é necessário. Endurecer com nonce via middleware é o próximo passo.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${apiUrl ? ` ${apiUrl}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Não anuncia a stack para quem sonda a aplicação.
  poweredByHeader: false,

  ...(isStaticExport
    ? { output: "export", images: { unoptimized: true } }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

module.exports = nextConfig;
