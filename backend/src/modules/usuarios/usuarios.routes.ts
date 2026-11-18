import { Router } from "express";
import { RoleUsuario } from "../../../generated/prisma/client.js";
import { autorizar } from "../middleware/autorizar.middleware.js";
import { ativaUsuarioController, buscaUsuarioPorIdController, cadastraUsuarioController, desativaUsuarioController, editaUsuarioController, listaUsuarioController } from "./usuarios.controller.js";

export const usuariosRouter = Router();

usuariosRouter.use(autorizar(RoleUsuario.ADMIN));

usuariosRouter.post("/", cadastraUsuarioController);
usuariosRouter.get("/", listaUsuarioController);
usuariosRouter.get("/:id", buscaUsuarioPorIdController);
usuariosRouter.patch("/:id", editaUsuarioController);
usuariosRouter.patch("/:id/ativar", ativaUsuarioController);
usuariosRouter.patch("/:id/desativar", desativaUsuarioController);
