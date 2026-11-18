import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import { clientesRouter } from "./modules/clientes/clientes.routes.js";
import { historicoRouter } from "./modules/historico/historico.routes.js";
import { usuariosRouter } from "./modules/usuarios/usuarios.routes.js";
import { veiculosRouter } from "./modules/veiculos/veiculos.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { atendimentosRouter } from "./modules/atendimentos/atendimentos.routes.js";
import { fluxoAtendimentoRouter } from "./modules/fluxo-atendimento/fluxo-atendimento.routes.js";
import { authMiddleware } from "./modules/middleware/auth.middleware.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";

export const app = express();

const origensPermitidas = [
  "http://localhost:5173",
  "https://minha-oficina-frontend.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({ origin: origensPermitidas, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/dashboard", authMiddleware, dashboardRouter);

app.use("/atendimentos", authMiddleware, atendimentosRouter);
app.use("/fluxo-atendimento", authMiddleware, fluxoAtendimentoRouter);
app.use("/historico", authMiddleware, historicoRouter);
app.use("/clientes", authMiddleware, clientesRouter);
app.use("/usuarios", authMiddleware, usuariosRouter);
app.use("/veiculos", authMiddleware, veiculosRouter);

app.use((erro: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (erro instanceof SyntaxError) {
    return res.status(400).json({ error: "JSON inválido" });
  }
  console.error(erro);
  return res.status(500).json({ error: "Erro interno do servidor" });
});

app.get("/", (req, res) => {
  res.json({ message: "API Minha Oficina funcionando" });
});

//teste de conexao com banco (rota temporária)
app.get("/teste-db", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.json({ message: "Banco conectado com sucesso" });
});
