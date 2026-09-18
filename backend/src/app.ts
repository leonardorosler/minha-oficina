import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { clientesRouter } from "./modules/clientes/clientes.routes.js";
import { historicoRouter } from "./modules/historico/historico.routes.js";
export const app = express();

app.use(cors());
app.use(express.json());

app.use("/historico", historicoRouter);
app.use("/clientes", clientesRouter);

app.get("/", (req, res) => {
  res.json({ message: "API Minha Oficina funcionando" });
});

//teste de conexao com banco (rota temporária)
app.get("/teste-db", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.json({ message: "Banco conectado com sucesso" });
});
