import { Router } from "express";
import { RoleUsuario } from "../../../generated/prisma/client.js";
import { autorizar, donoOuAdmin } from "../middleware/autorizar.middleware.js";
import {
  alterarStatusAtendimentoController,
  buscarFluxoAtendimentoController,
  obterTransicoesPossiveisController,
} from "./fluxo-atendimento.controller.js";

export const fluxoAtendimentoRouter = Router();

fluxoAtendimentoRouter.get("/:id/fluxo", buscarFluxoAtendimentoController);
fluxoAtendimentoRouter.get("/:id/transicoes", obterTransicoesPossiveisController);
fluxoAtendimentoRouter.patch(
  "/:id/status",
  autorizar(RoleUsuario.ADMIN, RoleUsuario.MECANICO),
  donoOuAdmin,
  alterarStatusAtendimentoController,
);
