import { number } from "zod";
import { prisma } from "../../lib/prisma.js";

interface CadastraCliente {    
  nome:         string   
  telefone:     string   
  email:        string  
  cpf:          string 
  endereco:     string  
  observacoes:  string

}


// cadastrar cliente 

export async function cadastrarClientes(data: CadastraCliente) {
  if (data.cpf) {
    const clienteJaCadastrado = await prisma.cliente.findUnique({
      where: {
        cpf: data.cpf,
      },
    });

    if (clienteJaCadastrado) {
      throw new Error("Cliente já cadastrado");
    }
  }

    const cliente = await prisma.cliente.create({
        data: {
            nome: data.nome,
            telefone: data.telefone,
            email: data.email,
            cpf: data.cpf,
            endereco: data.endereco,
            observacoes: data.observacoes
        }
    })

    return cliente;

}

//listar clientes

export async function listarClientes() {
  const clientes = await prisma.cliente.findMany();

  if (!clientes) {
    throw new Error("Nenhum cliente encontrado");
  }
  return clientes;
}


//atualizar cliente

export async function atualizarClientes(id: number, data: Partial<CadastraCliente>) {
  const cliente = await prisma.cliente.update({
    where: {
      id: id
    },
    data: data
  });

  return cliente;
}


//deletar cliente

export async function deletarClientes(id: number) {
  const cliente = await prisma.cliente.delete({
    where: {
      id: id
    }
  });

  return cliente;
}