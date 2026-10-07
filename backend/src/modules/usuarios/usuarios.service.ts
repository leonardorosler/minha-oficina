import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma.js";

interface CadastraUsuario {
  nome: string;
  email: string;
  senha: string;
}

export async function cadastraUsuario(data: CadastraUsuario) {
  const usuarioJaCadastrado = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
    select: { id: true },
  });

  if (usuarioJaCadastrado) {
    throw new Error("E-mail já cadastrado");
  }

  const senhaHash = await hash(data.senha, 12);

  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senhaHash,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  return usuario;
}

export async function listaUsuarios(){
    const usuarios = await prisma.usuario.findMany();

  if (!usuarios) {
    throw new Error("Nenhum cliente encontrado");
  }
  return usuarios;
}

export async function buscaUsuarioPorId(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  return usuario;
}