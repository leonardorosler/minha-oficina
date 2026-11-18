import type { NextFunction, Request, Response } from "express";
import { RoleUsuario } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

/** Permite o acesso apenas aos papéis informados */
export function autorizar(...permitidos: RoleUsuario[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.usuarioRole as RoleUsuario | undefined;
    if (!role || !permitidos.includes(role)) {
      return res.status(403).json({ error: "Você não tem permissão para esta ação" });
    }
    return next();
  };
}

/** Admin pode tudo; demais papéis só agem sobre atendimentos que abriram */
export async function donoOuAdmin(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id },
      select: { usuarioId: true },
    });

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado" });
    }

    const ehAdmin = res.locals.usuarioRole === RoleUsuario.ADMIN;
    const ehDono = atendimento.usuarioId === Number(res.locals.usuarioId);

    if (!ehAdmin && !ehDono) {
      return res.status(403).json({
        error: "Você não tem permissão sobre este atendimento",
      });
    }

    return next();
  } catch {
    return res.status(500).json({ error: "Erro ao verificar permissão" });
  }
}
