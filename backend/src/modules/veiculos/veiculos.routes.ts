import { Router } from 'express';
import { RoleUsuario } from '../../../generated/prisma/client.js';
import { autorizar } from '../middleware/autorizar.middleware.js';
import { atualizarVeiculoController, buscarVeiculoPorIdController, buscarVeiculoPorPlacaController, cadastrarVeiculoController, deletarVeiculoController, listarAtendimentosDoVeiculoController, listarVeiculosController } from './veiculos.controller.js';

export const veiculosRouter = Router();

veiculosRouter.post('/', autorizar(RoleUsuario.ADMIN, RoleUsuario.RECEPCIONISTA), cadastrarVeiculoController);
veiculosRouter.get('/', listarVeiculosController);
veiculosRouter.get('/placa/:placa', buscarVeiculoPorPlacaController);
veiculosRouter.get('/:id', buscarVeiculoPorIdController);
veiculosRouter.get('/:id/atendimentos', listarAtendimentosDoVeiculoController);
veiculosRouter.put('/:id', autorizar(RoleUsuario.ADMIN, RoleUsuario.RECEPCIONISTA), atualizarVeiculoController);
veiculosRouter.delete('/:id', autorizar(RoleUsuario.ADMIN), deletarVeiculoController);
