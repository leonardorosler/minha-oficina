import { compare } from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";

interface Login {
  email: string;
  senha: string;
}

export async function login(data: Login) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!usuario || !usuario.ativo) {
    throw new Error("E-mail ou senha inválidos");
  }

  const senhaCorreta = await compare(data.senha, usuario.senhaHash);

  if (!senhaCorreta) {
    throw new Error("E-mail ou senha inválidos");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  const token = jwt.sign({}, secret, {
    subject: String(usuario.id),
    expiresIn: "1d",
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  };
}
