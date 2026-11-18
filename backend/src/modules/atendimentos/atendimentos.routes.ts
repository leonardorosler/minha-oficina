import { Router } from "express";
import { RoleUsuario } from "../../../generated/prisma/client.js";
import { autorizar, donoOuAdmin } from "../middleware/autorizar.middleware.js";
import {
  abrirAtendimentoController,
  buscarAtendimentoPorIdController,
  cancelarAtendimentoController,
  editarAtendimentoController,
  listarAtendimentosController,
  listarVeiculosNaOficinaController,
} from "./atendimentos.controller.js";

export const atendimentosRouter = Router();

atendimentosRouter.post("/", autorizar(RoleUsuario.ADMIN, RoleUsuario.RECEPCIONISTA), abrirAtendimentoController);
atendimentosRouter.get("/veiculos-na-oficina", listarVeiculosNaOficinaController);
atendimentosRouter.get("/", listarAtendimentosController);
atendimentosRouter.get("/:id", buscarAtendimentoPorIdController);
atendimentosRouter.put("/:id", autorizar(RoleUsuario.ADMIN, RoleUsuario.MECANICO), donoOuAdmin, editarAtendimentoController);
atendimentosRouter.patch("/:id/cancelar", autorizar(RoleUsuario.ADMIN), cancelarAtendimentoController);
