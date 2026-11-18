import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  trocarSenhaController,
  usuarioLogadoController,
} from "./auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { limitarLogin } from "../middleware/limitarLogin.js";

export const authRouter = Router();

authRouter.post("/login", limitarLogin, loginController);
authRouter.post("/refresh", refreshController);
authRouter.post("/logout", logoutController);
authRouter.get("/me", authMiddleware, usuarioLogadoController);
authRouter.patch("/senha", authMiddleware, trocarSenhaController);
