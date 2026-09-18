import type { Request, Response } from "express";
import { z } from "zod";
import { listarHistoricoStatusPorAtendimento } from "./historico.services.js";

const parametrosHistoricoSchema = z.object({
  atendimentoId: z.coerce.number().int().positive(),
});

export async function listarHistoricoStatusController(
  req: Request,
  res: Response,
) {
  const resultado = parametrosHistoricoSchema.safeParse(req.params);

  if (!resultado.success) {
    return res.status(400).json({
      error: "O atendimentoId deve ser um número inteiro positivo",
    });
  }

  const { atendimentoId } = resultado.data;

  try {
    const historicoStatus =
      await listarHistoricoStatusPorAtendimento(atendimentoId);

    return res.status(200).json(historicoStatus);
  } catch {
    return res.status(500).json({
      error: "Erro ao listar histórico de status",
    });
  }
}
