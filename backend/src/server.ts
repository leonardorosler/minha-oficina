import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/teste", (req, res) => {
  res.json({
    message: "API Minha Oficina funcionando",
  });
});
 
//teste de conexao com banco (rota temporária)
app.get("/teste-db", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.json({
    message: "Banco conectado com sucesso",
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});