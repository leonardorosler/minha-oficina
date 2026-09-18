import type { Request, Response } from 'express';
import { cadastrarClientes, listarClientes, atualizarClientes, deletarClientes } from './clientes.services.js';
import { string } from 'zod';



//cadastra cliente
export async function cadastrarClientescontroller (req: Request, res: Response) {
    try {   
        const { nome, telefone, email, cpf, endereco, observacoes } = req.body;
        if (!nome || !telefone || !email || !cpf || !endereco) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
        }


        const cliente = await cadastrarClientes({ nome, telefone, email, cpf, endereco, observacoes,});
        if (!cliente) {
            return res.status(400).json({ error: 'Erro ao cadastrar cliente' });
        }

        res.status(201).json(cliente);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
}



//listar clientes
export async function listarClientescontroller (req: Request, res: Response) {

    try {
        const clientes = await listarClientes();
        if (!clientes) {

            return res.status(404).json({ error: 'Nenhum cliente encontrado' });
        }
        res.status(200).json(clientes);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar clientes' });
    }
}

//atualizar cliente
export async function atualizarClientescontroller (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, telefone, email, cpf, endereco, observacoes } = req.body; 
        const cliente = await atualizarClientes(Number(id), { nome, telefone, email, cpf, endereco, observacoes }); 
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
}


//deletar clientes

export async function deletarClientescontroller (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cliente = await deletarClientes(Number(id));
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
}