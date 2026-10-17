import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma.js";

interface CadastraUsuario {
  nome: string;
  email: string;
  senha: string;
}

interface EditaUsuario {
  nome?: string;
  email?: string;
  senha?: string;
}

// campos que podem aparecer nas respostas, sem a senha.
const camposUsuario = {
  id: true,
  nome: true,
  email: true,
  ativo: true,
  criadoEm: true,
  atualizadoEm: true,
};

export async function cadastraUsuario(data: CadastraUsuario) {
  const usuarioJaCadastrado = await prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (usuarioJaCadastrado) {
    throw new Error("E-mail já cadastrado");
  }

  const senhaHash = await hash(data.senha, 12);

  return prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senhaHash,
    },
    select: camposUsuario,
  });
}

export async function listaUsuarios() {
  return prisma.usuario.findMany({
    select: camposUsuario,
    orderBy: { id: "asc" },
  });
}

export async function buscaUsuarioPorId(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: camposUsuario,
  });

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  return usuario;
}

export async function editaUsuario(id: number, data: EditaUsuario) {
  await buscaUsuarioPorId(id);

  if (data.email !== undefined) {
    const usuarioComEmail = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (usuarioComEmail && usuarioComEmail.id !== id) {
      throw new Error("E-mail já cadastrado");
    }
  }

  const senhaHash =
    data.senha !== undefined ? await hash(data.senha, 12) : undefined;

  return prisma.usuario.update({
    where: { id },
    data: {
      nome: data.nome,
      email: data.email,
      senhaHash,
    },
    select: camposUsuario,
  });
}

export async function desativaUsuario(id: number) {
  await buscaUsuarioPorId(id);

  return prisma.usuario.update({
    where: { id },
    data: { ativo: false },
    select: camposUsuario,
  });
}