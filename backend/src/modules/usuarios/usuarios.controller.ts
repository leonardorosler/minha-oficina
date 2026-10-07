import type { Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client.js";
import { cadastraUsuario, listaUsuarios, buscaUsuarioPorId } from "./usuarios.service.js";

export async function cadastraUsuarioController(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body ?? {};

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const usuario = await cadastraUsuario({ nome, email, senha });

    return res.status(201).json(usuario);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao cadastrar usuário",
    });
  }
}

export async function listaUsuarioController(req: Request, res: Response) {
 
  try {
          const usuarios = await listaUsuarios();
          if (!usuarios) {
              return res.status(404).json({ error: 'Nenhum usuario encontrado' });
          }
          res.status(200).json(usuarios);
  
      } catch (error) {
          res.status(500).json({ error: 'Erro ao listar usuarios' });
      }
}

export async function buscaUsuarioPorIdController(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    const usuario = await buscaUsuarioPorId(id);

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}