import { Router } from "express";
import { buscarDadosDashboardController } from "./dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", buscarDadosDashboardController);
