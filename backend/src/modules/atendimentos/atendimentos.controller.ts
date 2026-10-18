import type { Request, Response } from "express";
import { z } from "zod";
import { StatusAtendimento } from "../../../generated/prisma/client.js";
import {
  abrirAtendimento,
  buscarAtendimentoPorId,
  cancelarAtendimento,
  editarAtendimento,
  listarAtendimentos,
  listarVeiculosNaOficina,
} from "./atendimentos.services.js";

const idSchema = z.coerce.number().int().positive();

const criarAtendimentoSchema = z.object({
  veiculoId: z.coerce.number().int().positive(),
  problemaRelatado: z.string().trim().min(1),
  diagnostico: z.string().trim().optional(),
  servicoPrevisto: z.string().trim().optional(),
  orcamentoValor: z.coerce.number().nonnegative().optional(),
  observacoes: z.string().trim().optional(),
});

const editarAtendimentoSchema = z
  .object({
    veiculoId: z.coerce.number().int().positive().optional(),
    problemaRelatado: z.string().trim().min(1).optional(),
    diagnostico: z.string().trim().nullable().optional(),
    servicoPrevisto: z.string().trim().nullable().optional(),
    servicoRealizado: z.string().trim().nullable().optional(),
    orcamentoValor: z.coerce.number().nonnegative().nullable().optional(),
    observacoes: z.string().trim().nullable().optional(),
    status: z.nativeEnum(StatusAtendimento).optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0);

const filtrosAtendimentoSchema = z
  .object({
    status: z.nativeEnum(StatusAtendimento).optional(),
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
    clienteId: z.coerce.number().int().positive().optional(),
    veiculoId: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (dados) =>
      !dados.dataInicio || !dados.dataFim || dados.dataInicio <= dados.dataFim,
  );

// Abrir atendimento
export async function abrirAtendimentoController(req: Request, res: Response) {
  const dados = criarAtendimentoSchema.safeParse(req.body);

  if (!dados.success) {
    return res
      .status(400)
      .json({ error: "Veículo e problema relatado são obrigatórios" });
  }

  try {
    const usuarioId = Number(res.locals.usuarioId);
    const atendimento = await abrirAtendimento({ ...dados.data, usuarioId });
    return res.status(201).json(atendimento);
  } catch (error) {
    if (error instanceof Error && error.message === "Veículo não encontrado") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao abrir atendimento" });
  }
}

// Listar atendimentos e aplicar filtros enviados na query string
export async function listarAtendimentosController(
  req: Request,
  res: Response,
) {
  const filtros = filtrosAtendimentoSchema.safeParse(req.query);

  if (!filtros.success) {
    return res.status(400).json({ error: "Filtros inválidos" });
  }

  try {
    const atendimentos = await listarAtendimentos(filtros.data);
    return res.status(200).json(atendimentos);
  } catch {
    return res.status(500).json({ error: "Erro ao listar atendimentos" });
  }
}

// Buscar atendimento pelo ID
export async function buscarAtendimentoPorIdController(
  req: Request,
  res: Response,
) {
  const id = idSchema.safeParse(req.params.id);

  if (!id.success) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const atendimento = await buscarAtendimentoPorId(id.data);

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado" });
    }

    return res.status(200).json(atendimento);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar atendimento" });
  }
}

// Editar atendimento
export async function editarAtendimentoController(req: Request, res: Response) {
  const id = idSchema.safeParse(req.params.id);
  const dados = editarAtendimentoSchema.safeParse(req.body);

  if (!id.success) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (!dados.success) {
    return res.status(400).json({ error: "Informe os campos corretamente" });
  }

  try {
    const atendimento = await editarAtendimento(id.data, dados.data);
    return res.status(200).json(atendimento);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Atendimento não encontrado"
    ) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message === "Veículo não encontrado") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao editar atendimento" });
  }
}

// Cancelar atendimento
export async function cancelarAtendimentoController(
  req: Request,
  res: Response,
) {
  const id = idSchema.safeParse(req.params.id);

  if (!id.success) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const atendimento = await cancelarAtendimento(id.data);
    return res.status(200).json(atendimento);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Atendimento não encontrado"
    ) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao cancelar atendimento" });
  }
}

// Listar veículos que têm atendimento em aberto
export async function listarVeiculosNaOficinaController(
  _req: Request,
  res: Response,
) {
  try {
    const veiculos = await listarVeiculosNaOficina();
    return res.status(200).json(veiculos);
  } catch {
    return res
      .status(500)
      .json({ error: "Erro ao listar veículos na oficina" });
  }
}
