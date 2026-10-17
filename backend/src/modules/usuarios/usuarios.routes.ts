import { Router } from "express";
import {  cadastraUsuarioController, listaUsuarioController, buscaUsuarioPorIdController, editaUsuarioController, desativaUsuarioController} from "./usuarios.controller.js";

export const usuariosRouter = Router();

usuariosRouter.post("/", cadastraUsuarioController);
usuariosRouter.get("/", listaUsuarioController);
usuariosRouter.get("/:id", buscaUsuarioPorIdController);
usuariosRouter.patch("/:id", editaUsuarioController);
usuariosRouter.patch("/:id/desativar", desativaUsuarioController);