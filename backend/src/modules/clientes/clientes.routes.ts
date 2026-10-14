import { Router } from 'express';
import { atualizarClientescontroller, cadastrarClientescontroller, deletarClientescontroller, listarClientesController } from './clientes.controller.js';

export const clientesRouter = Router();

//cadastrar cliente
clientesRouter.post('/', cadastrarClientescontroller);

//listar clientes
clientesRouter.get('/', listarClientesController);

//atualizar cliente
clientesRouter.put('/:id', atualizarClientescontroller);

//deletar cliente
clientesRouter.delete('/:id', deletarClientescontroller);
