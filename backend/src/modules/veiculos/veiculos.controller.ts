import type { Request, Response } from 'express';
import { atualizarVeiculo, buscarVeiculoPorId, buscarVeiculoPorPlaca, cadastrarVeiculo, deletarVeiculo, listarAtendimentosDoVeiculo, listarVeiculos } from './veiculos.services.js';



//cadastrar veiculo
export async function cadastrarVeiculoController(req: Request, res: Response) {
    try {
        const { clienteId, placa, marca, modelo, ano, cor, observacoes } = req.body;
        if (!clienteId || !placa || !marca || !modelo) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
        }

        const veiculo = await cadastrarVeiculo({ clienteId: Number(clienteId), placa, marca, modelo, ano: ano ? Number(ano) : undefined, cor, observacoes });
        res.status(201).json(veiculo);

    } catch (error) {
        if (error instanceof Error && error.message === 'Cliente não encontrado') {
            return res.status(404).json({ error: error.message });
        }
        if (error instanceof Error && error.message === 'Placa já cadastrada') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao cadastrar veículo' });
    }
}

//listar veiculos
export async function listarVeiculosController(_req: Request, res: Response) {
    try {
        const veiculos = await listarVeiculos();
        res.status(200).json(veiculos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar veículos' });
    }
}

//buscar veiculo por id
export async function buscarVeiculoPorIdController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const veiculo = await buscarVeiculoPorId(Number(id));

        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
}

//buscar veiculo pela placa
export async function buscarVeiculoPorPlacaController(req: Request, res: Response) {
    try {
        const { placa } = req.params;
        const veiculo = await buscarVeiculoPorPlaca(String(placa));

        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
}

//listar atendimentos do veiculo
export async function listarAtendimentosDoVeiculoController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const veiculo = await buscarVeiculoPorId(Number(id));

        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        const atendimentos = await listarAtendimentosDoVeiculo(Number(id));
        res.status(200).json(atendimentos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar atendimentos do veículo' });
    }
}

//atualizar veiculo
export async function atualizarVeiculoController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const veiculoExistente = await buscarVeiculoPorId(Number(id));

        if (!veiculoExistente) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        const { placa, marca, modelo, ano, cor, observacoes } = req.body;
        const veiculo = await atualizarVeiculo(Number(id), { clienteId: undefined, placa, marca, modelo, ano: ano ? Number(ano) : undefined, cor, observacoes });
        res.status(200).json(veiculo);
    } catch (error) {
        if (error instanceof Error && error.message === 'Placa já cadastrada') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
}

//deletar veiculo
export async function deletarVeiculoController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const veiculoExistente = await buscarVeiculoPorId(Number(id));

        if (!veiculoExistente) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        const veiculo = await deletarVeiculo(Number(id));
        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar veículo' });
    }
}


