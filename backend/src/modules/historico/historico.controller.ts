import type { Request, Response } from "express";
import { z } from "zod";
import {
  listarHistoricoServicosDoCliente,
  listarHistoricoServicosDoVeiculo,
  listarHistoricoStatusPorAtendimento,
} from "./historico.services.js";

const parametrosHistoricoSchema = z.object({
  atendimentoId: z.coerce.number().int().positive(),
});

const parametrosVeiculoSchema = z.object({
  veiculoId: z.coerce.number().int().positive(),
});

const parametrosClienteSchema = z.object({
  clienteId: z.coerce.number().int().positive(),
});

const periodoSchema = z
  .object({
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
  })
  .refine(
    (dados) =>
      !dados.dataInicio || !dados.dataFim || dados.dataInicio <= dados.dataFim,
  );

function ajustarDataFim(dataFim: Date | undefined, valor: unknown) {
  if (dataFim && typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    dataFim.setUTCHours(23, 59, 59, 999);
  }

  return dataFim;
}

// Histórico de status de um atendimento
export async function listarHistoricoStatusController(
  req: Request,
  res: Response,
) {
  const parametros = parametrosHistoricoSchema.safeParse(req.params);

  if (!parametros.success) {
    return res.status(400).json({ error: "ID do atendimento inválido" });
  }

  try {
    const historico = await listarHistoricoStatusPorAtendimento(
      parametros.data.atendimentoId,
    );
    return res.status(200).json(historico);
  } catch {
    return res
      .status(500)
      .json({ error: "Erro ao listar histórico de status" });
  }
}

// Histórico de atendimentos de um veículo
export async function listarHistoricoServicosDoVeiculoController(
  req: Request,
  res: Response,
) {
  const parametros = parametrosVeiculoSchema.safeParse(req.params);
  const periodo = periodoSchema.safeParse(req.query);

  if (!parametros.success || !periodo.success) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  try {
    const historico = await listarHistoricoServicosDoVeiculo(
      parametros.data.veiculoId,
      periodo.data.dataInicio,
      ajustarDataFim(periodo.data.dataFim, req.query.dataFim),
    );
    return res.status(200).json(historico);
  } catch {
    return res
      .status(500)
      .json({ error: "Erro ao listar histórico do veículo" });
  }
}

// Histórico de atendimentos de um cliente
export async function listarHistoricoServicosDoClienteController(
  req: Request,
  res: Response,
) {
  const parametros = parametrosClienteSchema.safeParse(req.params);
  const periodo = periodoSchema.safeParse(req.query);

  if (!parametros.success || !periodo.success) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  try {
    const historico = await listarHistoricoServicosDoCliente(
      parametros.data.clienteId,
      periodo.data.dataInicio,
      ajustarDataFim(periodo.data.dataFim, req.query.dataFim),
    );
    return res.status(200).json(historico);
  } catch {
    return res
      .status(500)
      .json({ error: "Erro ao listar histórico do cliente" });
  }
}
