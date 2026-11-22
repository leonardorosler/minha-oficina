import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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

app.disable("x-powered-by");
// Render/Vercel ficam atrás de um proxy; isso faz o rate limit usar o IP real.
app.set("trust proxy", 1);

const origensPermitidas = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://minha-oficina-frontend.vercel.app",
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map(origem => origem.trim()).filter(Boolean)
    : []),
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

app.get("/", (_req, res) => {
  res.json({ message: "API Minha Oficina funcionando" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.use((erro: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (erro instanceof SyntaxError) {
    return res.status(400).json({ error: "JSON inválido" });
  }
  console.error(erro);
  return res.status(500).json({ error: "Erro interno do servidor" });
});
