import { Router } from "express";
import {
  alterarStatusAtendimentoController,
  buscarFluxoAtendimentoController,
  obterTransicoesPossiveisController,
} from "./fluxo-atendimento.controller.js";

export const fluxoAtendimentoRouter = Router();

fluxoAtendimentoRouter.get("/:id/fluxo", buscarFluxoAtendimentoController);
fluxoAtendimentoRouter.get(  "/:id/transicoes",obterTransicoesPossiveisController);
fluxoAtendimentoRouter.patch("/:id/status", alterarStatusAtendimentoController);