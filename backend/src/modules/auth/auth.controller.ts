import type { Request, Response } from "express";
import { login } from "./auth.service.js";
import { buscaUsuarioPorId } from "../usuarios/usuarios.service.js";

export async function loginController(req: Request, res: Response) {
  const { email, senha } = req.body;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof senha !== "string" ||
    !senha.trim()
  ) {
    return res.status(400).json({
      error: "E-mail e senha são obrigatórios",
    });
  }

  try {
    const resultado = await login({ email, senha });

    return res.status(200).json(resultado);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "E-mail ou senha inválidos"
    ) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: "Erro ao realizar login" });
  }
}

export async function usuarioLogadoController(req: Request, res: Response) {
  try {
    const usuario = await buscaUsuarioPorId(res.locals.usuarioId);

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar usuário logado",
    });
  }
}
