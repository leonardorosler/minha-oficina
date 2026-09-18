import {Router} from 'express';
import {atualizarClientescontroller, cadastrarClientescontroller, deletarClientescontroller, listarClientescontroller} from './/clientes.controller.js';   

export const clientesRouter = Router();

clientesRouter.post('/', cadastrarClientescontroller);
clientesRouter.get('/', listarClientescontroller); 
clientesRouter.put('/:id', atualizarClientescontroller);
clientesRouter.delete('/:id', deletarClientescontroller);