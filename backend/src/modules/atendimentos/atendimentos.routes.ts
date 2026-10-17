import { Router } from "express";
import {
  abrirAtendimentoController,
  buscarAtendimentoPorIdController,
  cancelarAtendimentoController,
  editarAtendimentoController,
  listarAtendimentosController,
  listarVeiculosNaOficinaController,
} from "./atendimentos.controller.js";

export const atendimentosRouter = Router();

atendimentosRouter.post("/", abrirAtendimentoController);
atendimentosRouter.get("/veiculos-na-oficina", listarVeiculosNaOficinaController);
atendimentosRouter.get("/", listarAtendimentosController);
atendimentosRouter.get("/:id", buscarAtendimentoPorIdController);
atendimentosRouter.put("/:id", editarAtendimentoController);
atendimentosRouter.patch("/:id/cancelar", cancelarAtendimentoController);
