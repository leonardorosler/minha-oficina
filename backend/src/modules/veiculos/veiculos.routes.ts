import { Router } from 'express';
import { atualizarVeiculoController, buscarVeiculoPorIdController, buscarVeiculoPorPlacaController, cadastrarVeiculoController, deletarVeiculoController, listarAtendimentosDoVeiculoController, listarVeiculosController } from './veiculos.controller.js';

export const veiculosRouter = Router();

//cadastrar veiculo
veiculosRouter.post('/', cadastrarVeiculoController);

//listar veiculos
veiculosRouter.get('/', listarVeiculosController);

//buscar veiculo pela placa
veiculosRouter.get('/placa/:placa', buscarVeiculoPorPlacaController);

//buscar veiculo por id
veiculosRouter.get('/:id', buscarVeiculoPorIdController);

//listar atendimentos do veiculo
veiculosRouter.get('/:id/atendimentos', listarAtendimentosDoVeiculoController);

//atualizar veiculo
veiculosRouter.put('/:id', atualizarVeiculoController);

//deletar veiculo
veiculosRouter.delete('/:id', deletarVeiculoController);

