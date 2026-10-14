import { Router } from 'express';
import { buscarVeiculoPorIdController, buscarVeiculoPorPlacaController, cadastrarVeiculoController, listarVeiculosController } from './veiculos.controller.js';

export const veiculosRouter = Router();

//cadastrar veiculo
veiculosRouter.post('/', cadastrarVeiculoController);

//listar veiculos
veiculosRouter.get('/', listarVeiculosController);

//buscar veiculo pela placa
veiculosRouter.get('/placa/:placa', buscarVeiculoPorPlacaController);

//buscar veiculo por id
veiculosRouter.get('/:id', buscarVeiculoPorIdController);
