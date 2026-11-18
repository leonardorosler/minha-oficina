import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

const DIAS_REFRESH = 7;

interface Login {
  email: string;
  senha: string;
}

function secret(): string {
  const valor = process.env.JWT_SECRET;
  if (!valor) throw new Error("JWT_SECRET não configurado");
  return valor;
}

export function gerarAccessToken(usuarioId: number): string {
  return jwt.sign({}, secret(), {
    subject: String(usuarioId),
    expiresIn: "15m",
  });
}

function hashRefresh(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function criarRefreshToken(usuarioId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiraEm = new Date(Date.now() + DIAS_REFRESH * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash: hashRefresh(token), usuarioId, expiraEm },
  });

  return token;
}

function dadosUsuario(usuarioId: number) {
  return prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    select: { id: true, nome: true, email: true, role: true },
  });
}

export async function login(data: Login) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (!usuario || !usuario.ativo) {
    throw new Error("E-mail ou senha inválidos");
  }

  const senhaCorreta = await compare(data.senha, usuario.senhaHash);
  if (!senhaCorreta) throw new Error("E-mail ou senha inválidos");

  const token = gerarAccessToken(usuario.id);
  const refreshToken = await criarRefreshToken(usuario.id);

  return {
    token,
    refreshToken,
    expiresIn: 900,
    usuario: await dadosUsuario(usuario.id),
  };
}

export async function renovar(tokenRaw: string) {
  const registro = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashRefresh(tokenRaw) },
  });

  if (!registro || registro.revogado || registro.expiraEm <= new Date()) {
    throw new Error("Sessão expirada");
  }

  await prisma.refreshToken.update({
    where: { id: registro.id },
    data: { revogado: true },
  });

  const refreshToken = await criarRefreshToken(registro.usuarioId);

  return {
    token: gerarAccessToken(registro.usuarioId),
    refreshToken,
    expiresIn: 900,
    usuario: await dadosUsuario(registro.usuarioId),
  };
}

export async function logout(tokenRaw?: string) {
  if (!tokenRaw) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashRefresh(tokenRaw), revogado: false },
    data: { revogado: true },
  });
}

export async function trocarSenha(
  usuarioId: number,
  senhaAtual: string,
  senhaNova: string,
) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) throw new Error("Usuário não encontrado");

  const correta = await compare(senhaAtual, usuario.senhaHash);
  if (!correta) throw new Error("Senha atual incorreta");

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { senhaHash: await hash(senhaNova, 12) },
  });
}
