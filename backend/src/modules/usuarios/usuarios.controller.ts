import type { Request, Response } from "express";
import {
  cadastraUsuario,
  listaUsuarios,
  buscaUsuarioPorId,
  editaUsuario,
  desativaUsuario,
} from "./usuarios.service.js";

function respondeErro(res: Response, error: unknown, mensagemPadrao: string) {
  if (error instanceof Error) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "E-mail já cadastrado") {
      return res.status(409).json({ error: error.message });
    }
  }

  return res.status(500).json({ error: mensagemPadrao });
}

export async function cadastraUsuarioController(req: Request, res: Response) {
  const { nome, email, senha } = req.body ?? {};

  if (
    typeof nome !== "string" ||
    !nome.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof senha !== "string" ||
    !senha.trim()
  ) {
    return res.status(400).json({
      error: "Nome, e-mail e senha são obrigatórios",
    });
  }

  try {
    const usuario = await cadastraUsuario({ nome, email, senha });

    return res.status(201).json(usuario);
  } catch (error) {
    return respondeErro(res, error, "Erro ao cadastrar usuário");
  }
}

export async function listaUsuarioController(req: Request, res: Response) {
  try {
    const usuarios = await listaUsuarios();

    return res.status(200).json(usuarios);
  } catch (error) {
    return respondeErro(res, error, "Erro ao listar usuários");
  }
}

export async function buscaUsuarioPorIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const usuario = await buscaUsuarioPorId(id);

    return res.status(200).json(usuario);
  } catch (error) {
    return respondeErro(res, error, "Erro ao buscar usuário");
  }
}

export async function editaUsuarioController(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (nome === undefined && email === undefined && senha === undefined) {
    return res.status(400).json({
      error: "Informe nome, e-mail ou senha para atualizar",
    });
  }

  const campos = [nome, email, senha];

  if (
    campos.some(
      (campo) =>
        campo !== undefined && (typeof campo !== "string" || !campo.trim()),
    )
  ) {
    return res.status(400).json({
      error: "Os campos enviados devem ser textos não vazios",
    });
  }

  try {
    const usuario = await editaUsuario(id, { nome, email, senha });

    return res.status(200).json(usuario);
  } catch (error) {
    return respondeErro(res, error, "Erro ao editar usuário");
  }
}

export async function desativaUsuarioController(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const usuario = await desativaUsuario(id);

    return res.status(200).json(usuario);
  } catch (error) {
    return respondeErro(res, error, "Erro ao desativar usuário");
  }
}