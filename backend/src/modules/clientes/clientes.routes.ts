import { Router } from 'express';
import { atualizarClientescontroller, buscarClientePorCpfController, buscarClientePorIdController, cadastrarClientescontroller, deletarClientescontroller, listarClientesController, listarVeiculosDoClienteController } from './clientes.controller.js';

export const clientesRouter = Router();

//cadastrar cliente
clientesRouter.post('/', cadastrarClientescontroller);

//listar clientes
clientesRouter.get('/', listarClientesController);

//buscar cliente por cpf
clientesRouter.get('/cpf/:cpf', buscarClientePorCpfController);

//buscar cliente por id
clientesRouter.get('/:id', buscarClientePorIdController);

//listar veiculos do cliente
clientesRouter.get('/:id/veiculos', listarVeiculosDoClienteController);

//atualizar cliente
clientesRouter.put('/:id', atualizarClientescontroller);

//deletar cliente
clientesRouter.delete('/:id', deletarClientescontroller);
