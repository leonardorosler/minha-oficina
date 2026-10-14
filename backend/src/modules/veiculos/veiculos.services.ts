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
