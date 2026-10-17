import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const [tipo, token] = authorization.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato do token inválido" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: "Erro na configuração da autenticação",
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const usuarioId = Number(payload.sub);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { ativo: true },
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        error: "Usuário não encontrado ou desativado",
      });
    }

    res.locals.usuarioId = usuarioId;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Token inválido ou expirado",
      });
    }

    return res.status(500).json({
      error: "Erro ao verificar autenticação",
    });
  }

  return next();
}
