import { Router } from 'express';
import { cadastrarVeiculoController } from './veiculos.controller.js';

export const veiculosRouter = Router();

//cadastrar veiculo
veiculosRouter.post('/', cadastrarVeiculoController);
