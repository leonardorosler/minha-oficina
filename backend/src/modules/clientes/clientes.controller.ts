import type { Request, Response } from 'express';
import { cadastrarClientes, listarClientes, buscarClientePorId, buscarClientePorCpf, atualizarClientes, deletarClientes } from './clientes.services.js';



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
export async function listarClientesController(  _req: Request,  res: Response) 
{
  try {
    
    const clientes = await listarClientes();


    return res.status(200).json(clientes);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar clientes",
    });
  }
}

//buscar cliente por id
export async function buscarClientePorIdController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const cliente = await buscarClientePorId(Number(id));

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
}

//buscar cliente por cpf
export async function buscarClientePorCpfController(req: Request, res: Response) {
    try {
        const { cpf } = req.params;
        const cliente = await buscarClientePorCpf(String(cpf));

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente' });
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
