import { Router } from 'express';
import { RoleUsuario } from '../../../generated/prisma/client.js';
import { autorizar } from '../middleware/autorizar.middleware.js';
import { atualizarClientescontroller, buscarClientePorCpfController, buscarClientePorIdController, cadastrarClientescontroller, deletarClientescontroller, listarAtendimentosDoClienteController, listarClientesController, listarVeiculosDoClienteController } from './clientes.controller.js';

export const clientesRouter = Router();

clientesRouter.post('/', autorizar(RoleUsuario.ADMIN, RoleUsuario.RECEPCIONISTA), cadastrarClientescontroller);
clientesRouter.get('/', listarClientesController);
clientesRouter.get('/cpf/:cpf', buscarClientePorCpfController);
clientesRouter.get('/:id', buscarClientePorIdController);
clientesRouter.get('/:id/veiculos', listarVeiculosDoClienteController);
clientesRouter.get('/:id/atendimentos', listarAtendimentosDoClienteController);
clientesRouter.put('/:id', autorizar(RoleUsuario.ADMIN, RoleUsuario.RECEPCIONISTA), atualizarClientescontroller);
clientesRouter.delete('/:id', autorizar(RoleUsuario.ADMIN), deletarClientescontroller);
