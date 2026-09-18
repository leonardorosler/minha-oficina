import { Router } from "express";
import { listarHistoricoStatusController } from "./historico.controller.js";

export const historicoRouter = Router();

historicoRouter.get(
  "/atendimentos/:atendimentoId/status",
  listarHistoricoStatusController,
);
