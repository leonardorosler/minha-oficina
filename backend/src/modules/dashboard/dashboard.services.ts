import { StatusAtendimento } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export async function buscarDadosDashboard(dataInicio?: Date, dataFim?: Date) {
  const periodo =
    dataInicio || dataFim
      ? {
          dataEntrada: {
            ...(dataInicio ? { gte: dataInicio } : {}),
            ...(dataFim ? { lte: dataFim } : {}),
          },
        }
      : {};

  const veiculosNaOficina = await prisma.veiculo.count({
    where: {
      atendimentos: {
        some: {
          status: {
            in: [
              StatusAtendimento.AGUARDANDO,
              StatusAtendimento.EM_SERVICO,
              StatusAtendimento.PRONTO,
            ],
          },
          ...periodo,
        },
      },
    },
  });

  const atendimentosPorStatus = await prisma.atendimento.groupBy({
    by: ["status"],
    where: periodo,
    _count: { id: true },
  });

  const atendimentosRecentes = await prisma.atendimento.findMany({
    where: periodo,
    include: {
      veiculo: { include: { cliente: true } },
      usuario: { select: { id: true, nome: true } },
    },
    orderBy: { dataEntrada: "desc" },
    take: 5,
  });

  const veiculosProntos = await prisma.veiculo.findMany({
    where: {
      atendimentos: {
        some: {
          status: StatusAtendimento.PRONTO,
          ...periodo,
        },
      },
    },
    include: { cliente: true },
  });

  const atendimentosFinalizados = await prisma.atendimento.findMany({
    where: {
      ...periodo,
      status: StatusAtendimento.FINALIZADO,
    },
    include: {
      veiculo: { include: { cliente: true } },
      usuario: { select: { id: true, nome: true } },
    },
    orderBy: { dataSaida: "desc" },
    take: 5,
  });

  return {
    veiculosNaOficina,
    atendimentosPorStatus,
    atendimentosRecentes,
    veiculosProntos,
    atendimentosFinalizados,
  };
}
