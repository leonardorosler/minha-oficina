import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { clientesRouter } from "./modules/clientes/clientes.routes.js";
import { historicoRouter } from "./modules/historico/historico.routes.js";
import { usuariosRouter } from "./modules/usuarios/usuarios.routes.js";
import { veiculosRouter } from "./modules/veiculos/veiculos.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { authMiddleware } from "./modules/middleware/auth.middleware.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.use("/historico", authMiddleware, historicoRouter);
app.use("/clientes", authMiddleware, clientesRouter);
app.use("/usuarios", authMiddleware, usuariosRouter);
app.use("/veiculos", authMiddleware, veiculosRouter);

app.get("/", (req, res) => {
  res.json({ message: "API Minha Oficina funcionando" });
});

//teste de conexao com banco (rota temporária)
app.get("/teste-db", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.json({ message: "Banco conectado com sucesso" });
});
