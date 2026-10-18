import type { Request, Response } from "express";
import { buscarDadosDashboard } from "./dashboard.services.js";

export async function buscarDadosDashboardController(
  req: Request,
  res: Response,
) {
  const dataInicio = req.query.dataInicio
    ? new Date(String(req.query.dataInicio))
    : undefined;

  const dataFim = req.query.dataFim
    ? new Date(String(req.query.dataFim))
    : undefined;

  if (
    (dataInicio && isNaN(dataInicio.getTime())) ||
    (dataFim && isNaN(dataFim.getTime()))
  ) {
    return res.status(400).json({ error: "Data inválida" });
  }

  if (dataInicio && dataFim && dataInicio > dataFim) {
    return res.status(400).json({
      error: "A data inicial deve vir antes da data final",
    });
  }

  try {
    const dados = await buscarDadosDashboard(dataInicio, dataFim);
    return res.status(200).json(dados);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
}
