import { Router } from "express";
import {loginController, usuarioLogadoController} from "./auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, usuarioLogadoController);