import { prisma } from "../../lib/prisma.js";

export async function listarHistoricoStatusPorAtendimento(
  atendimentoId: number,
) {
  const historicoStatus = await prisma.historicoStatus.findMany({
    where: {
      atendimentoId: atendimentoId,
    },
    orderBy: {
      criadoEm: "asc",
    },
    include: { usuario: { select: { id: true, nome: true } } },
  });
  return historicoStatus;
}

export async function listarHistoricoServicosDoVeiculo(
  veiculoId: number,
  dataInicio?: Date,
  dataFim?: Date,
) {
  return prisma.atendimento.findMany({
    where: {
      veiculoId,
      ...(dataInicio || dataFim
        ? {
            dataEntrada: {
              ...(dataInicio ? { gte: dataInicio } : {}),
              ...(dataFim ? { lte: dataFim } : {}),
            },
          }
        : {}),
    },
    include: {
      veiculo: { include: { cliente: true } },
      usuario: { select: { id: true, nome: true } },
      historicoStatus: { include: { usuario: { select: { id: true, nome: true } } } },
    },
    orderBy: { dataEntrada: "desc" },
  });
}

export async function listarHistoricoServicosDoCliente(
  clienteId: number,
  dataInicio?: Date,
  dataFim?: Date,
) {
  return prisma.atendimento.findMany({
    where: {
      veiculo: { clienteId },
      ...(dataInicio || dataFim
        ? {
            dataEntrada: {
              ...(dataInicio ? { gte: dataInicio } : {}),
              ...(dataFim ? { lte: dataFim } : {}),
            },
          }
        : {}),
    },
    include: {
      veiculo: { include: { cliente: true } },
      usuario: { select: { id: true, nome: true } },
      historicoStatus: { include: { usuario: { select: { id: true, nome: true } } } },
    },
    orderBy: { dataEntrada: "desc" },
  });
}
