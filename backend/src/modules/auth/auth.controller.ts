import type { Request, Response } from "express";
import {
  login,
  logout,
  renovar,
  trocarSenha,
} from "./auth.service.js";
import { buscaUsuarioPorId } from "../usuarios/usuarios.service.js";

const NOME_COOKIE = "refreshToken";
const SETE_DIAS = 7 * 24 * 60 * 60 * 1000;

function emProducao(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.RENDER) ||
    Boolean(process.env.VERCEL)
  );
}

function opcoesCookie() {
  const producao = emProducao();

  return {
    httpOnly: true,
    secure: producao,
    sameSite: (producao ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
}

function definirCookie(res: Response, token: string) {
  res.cookie(NOME_COOKIE, token, {
    ...opcoesCookie(),
    maxAge: SETE_DIAS,
  });
}

function responderErro(res: Response, erro: unknown, mensagem: string) {
  const texto = erro instanceof Error ? erro.message : mensagem;
  const status =
    texto === "E-mail ou senha inválidos" || texto === "Senha atual incorreta"
      ? 401
      : texto === "Sessão expirada"
        ? 401
        : texto === "Usuário não encontrado"
          ? 404
          : 500;
  return res.status(status).json({ error: texto });
}

export async function loginController(req: Request, res: Response) {
  const { email, senha } = req.body ?? {};

  if (
    typeof email !== "string" || !email.trim() ||
    typeof senha !== "string" || !senha.trim()
  ) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const resultado = await login({ email, senha });
    definirCookie(res, resultado.refreshToken);
    return res.status(200).json({
      token: resultado.token,
      expiresIn: resultado.expiresIn,
      usuario: resultado.usuario,
    });
  } catch (erro) {
    return responderErro(res, erro, "Erro ao realizar login");
  }
}

export async function refreshController(req: Request, res: Response) {
  const token = req.cookies?.[NOME_COOKIE];
  if (!token) return res.status(401).json({ error: "Refresh token não informado" });

  try {
    const resultado = await renovar(token);
    definirCookie(res, resultado.refreshToken);
    return res.status(200).json({
      token: resultado.token,
      expiresIn: resultado.expiresIn,
      usuario: resultado.usuario,
    });
  } catch (erro) {
    return responderErro(res, erro, "Erro ao renovar sessão");
  }
}

export async function logoutController(req: Request, res: Response) {
  await logout(req.cookies?.[NOME_COOKIE]);
  res.clearCookie(NOME_COOKIE, opcoesCookie());
  return res.status(200).json({ message: "Sessão encerrada" });
}

export async function trocarSenhaController(req: Request, res: Response) {
  const { senhaAtual, senhaNova } = req.body ?? {};
  if (
    typeof senhaAtual !== "string" || !senhaAtual.trim() ||
    typeof senhaNova !== "string" || senhaNova.trim().length < 6
  ) {
    return res.status(400).json({
      error: "Informe a senha atual e a nova senha (mínimo 6 caracteres)",
    });
  }

  try {
    await trocarSenha(Number(res.locals.usuarioId), senhaAtual, senhaNova);
    return res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (erro) {
    return responderErro(res, erro, "Erro ao alterar senha");
  }
}

export async function usuarioLogadoController(req: Request, res: Response) {
  try {
    const usuario = await buscaUsuarioPorId(res.locals.usuarioId);
    return res.status(200).json(usuario);
  } catch {
    return res.status(500).json({ error: "Erro ao consultar usuário logado" });
  }
}
