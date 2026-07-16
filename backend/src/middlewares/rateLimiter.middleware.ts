import rateLimit from "express-rate-limit";

/**
 * Rate limiting em camadas: um limite geral e brando para a API, e limites
 * rígidos e específicos para rotas transacionais/sensíveis (login, PIX,
 * boleto, contratação de empréstimo), que são os alvos prioritários de
 * automação maliciosa e fraude.
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em instantes." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas de autenticação. Tente novamente mais tarde." },
});

export const transactionalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite de operações por minuto excedido." },
});

export const kycLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite de tentativas de cadastro excedido. Tente novamente em 1 hora." },
});
