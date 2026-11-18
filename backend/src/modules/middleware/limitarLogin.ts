import { rateLimit } from "express-rate-limit";

/** Limita tentativas de login a 5 a cada 15 minutos por IP */
export const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em 15 minutos." },
});
