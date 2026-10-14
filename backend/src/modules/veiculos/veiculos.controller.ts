import type { Request, Response } from 'express';
import { cadastrarVeiculo } from './veiculos.services.js';



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
