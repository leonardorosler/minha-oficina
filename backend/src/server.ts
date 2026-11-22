import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 3333;

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

let encerrando = false;

async function encerrar(sinal: string) {
  if (encerrando) return;
  encerrando = true;

  console.log(`${sinal} recebido. Encerrando...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  // Não deixa o processo pendurado se alguma conexão travar.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => void encerrar("SIGTERM"));
process.on("SIGINT", () => void encerrar("SIGINT"));
