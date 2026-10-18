import { Router } from "express";
import {
  listarHistoricoServicosDoClienteController,
  listarHistoricoServicosDoVeiculoController,
  listarHistoricoStatusController,
} from "./historico.controller.js";

export const historicoRouter = Router();

historicoRouter.get(
  "/atendimentos/:atendimentoId/status",
  listarHistoricoStatusController,
);

historicoRouter.get(
  "/veiculos/:veiculoId/atendimentos",
  listarHistoricoServicosDoVeiculoController,
);

historicoRouter.get(
  "/clientes/:clienteId/atendimentos",
  listarHistoricoServicosDoClienteController,
);
