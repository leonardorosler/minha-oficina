import { prisma } from "../../lib/prisma.js";

interface CadastraVeiculo {
  clienteId:    number
  placa:        string
  marca:        string
  modelo:       string
  ano?:         number
  cor?:         string
  observacoes?: string

}


// cadastrar veiculo

export async function cadastrarVeiculo(data: CadastraVeiculo) {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: data.clienteId
    }
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  const placaJaCadastrada = await prisma.veiculo.findUnique({
    where: {
      placa: data.placa
    }
  });

  if (placaJaCadastrada) {
    throw new Error("Placa já cadastrada");
  }

  const veiculo = await prisma.veiculo.create({
    data: {
      clienteId: data.clienteId,
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      cor: data.cor,
      observacoes: data.observacoes
    }
  });

  return veiculo;
}


//listar veiculos

export async function listarVeiculos() {
  return prisma.veiculo.findMany({
    include: {
      cliente: true
    }
  });
}


//buscar veiculo por id

export async function buscarVeiculoPorId(id: number) {
  const veiculo = await prisma.veiculo.findUnique({
    where: {
      id: id
    },
    include: {
      cliente: true
    }
  });

  return veiculo;
}


//buscar veiculo pela placa

export async function buscarVeiculoPorPlaca(placa: string) {
  const veiculo = await prisma.veiculo.findUnique({
    where: {
      placa: placa
    },
    include: {
      cliente: true
    }
  });

  return veiculo;
}


//listar atendimentos do veiculo

export async function listarAtendimentosDoVeiculo(veiculoId: number) {
  const atendimentos = await prisma.atendimento.findMany({
    where: {
      veiculoId: veiculoId
    },
    include: {
      historicoStatus: true
    },
    orderBy: {
      dataEntrada: 'desc'
    }
  });

  return atendimentos;
}
