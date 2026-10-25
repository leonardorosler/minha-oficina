import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { StatusAtendimento } from "../../../generated/prisma/client.js";
import {
  alterarStatusAtendimento,
  buscarFluxoAtendimento,
  obterTransicoesPossiveis,
  podeAlterarStatus,
} from "./fluxo-atendimento.services.js";

const idSchema = z.coerce.number().int().positive();

const alterarStatusSchema = z.object({
  statusNovo: z.nativeEnum(StatusAtendimento),
  observacao: z.string().trim().optional(),
});


 // Altera o status do atendimento seguindo o fluxo:
 //AGUARDANDO → EM_SERVICO → PRONTO → FINALIZADO
 //
export async function alterarStatusAtendimentoController(
  req: Request,
  res: Response
) {
  const id = idSchema.safeParse(req.params.id);
  const dados = alterarStatusSchema.safeParse(req.body);

  if (!id.success) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (!dados.success) {
    return res.status(400).json({ error: "Informe o novo status corretamente" });
  }

  try {
    const usuarioId = Number(res.locals.usuarioId);
    const atendimento = await alterarStatusAtendimento(id.data, {
      ...dados.data,
      usuarioId,
    });
    return res.status(200).json(atendimento);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Atendimento não encontrado"
    ) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("Transição inválida")) {
      return res.status(400).json({ error: error.message });
    }
    if (
      error instanceof Error &&
      error.message.includes("Não é possível alterar status")
    ) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao alterar status do atendimento" });
  }
}


 //Retorna o fluxo completo do atendimento com histórico e transições possíveis

export async function buscarFluxoAtendimentoController(
  req: Request,
  res: Response
) {
  const id = idSchema.safeParse(req.params.id);

  if (!id.success) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const fluxo = await buscarFluxoAtendimento(id.data);
    return res.status(200).json(fluxo);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Atendimento não encontrado"
    ) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao buscar fluxo do atendimento" });
  }
}


 //Retorna as transições possíveis a partir do status atual

export async function obterTransicoesPossiveisController(
  req: Request,
  res: Response
) {
  const id = idSchema.safeParse(req.params.id);

  if (!id.success) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id: id.data },
      select: { status: true },
    });

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado" });
    }

    const transicoes = obterTransicoesPossiveis(atendimento.status);
    const podeAlterar = podeAlterarStatus(atendimento.status);

    return res.status(200).json({
      statusAtual: atendimento.status,
      transicoesPossiveis: transicoes,
      podeAlterar,
    });
  } catch {
    return res.status(500).json({ error: "Erro ao buscar transições possíveis" });
  }
}