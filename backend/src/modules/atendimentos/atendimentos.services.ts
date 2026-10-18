import { StatusAtendimento } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

const atendimentoComRelacoes = {
  veiculo: { include: { cliente: true } },
  usuario: { select: { id: true, nome: true, email: true } },
  historicoStatus: { orderBy: { criadoEm: "asc" as const } },
};

export interface AbrirAtendimento {
  veiculoId: number;
  usuarioId: number;
  problemaRelatado: string;
  diagnostico?: string;
  servicoPrevisto?: string;
  orcamentoValor?: number;
  observacoes?: string;
}

export interface EditarAtendimento {
  veiculoId?: number;
  problemaRelatado?: string;
  diagnostico?: string | null;
  servicoPrevisto?: string | null;
  servicoRealizado?: string | null;
  orcamentoValor?: number | null;
  observacoes?: string | null;
  status?: StatusAtendimento;
}

export interface FiltrosAtendimento {
  status?: StatusAtendimento;
  dataInicio?: Date;
  dataFim?: Date;
  clienteId?: number;
  veiculoId?: number;
}

export async function abrirAtendimento(data: AbrirAtendimento) {
  const veiculo = await prisma.veiculo.findUnique({
    where: { id: data.veiculoId },
  });
  if (!veiculo) throw new Error("Veículo não encontrado");

  return prisma.$transaction(async (tx) => {
    const atendimento = await tx.atendimento.create({
      data: {
        veiculoId: data.veiculoId,
        usuarioId: data.usuarioId,
        problemaRelatado: data.problemaRelatado,
        diagnostico: data.diagnostico,
        servicoPrevisto: data.servicoPrevisto,
        orcamentoValor: data.orcamentoValor,
        observacoes: data.observacoes,
        status: StatusAtendimento.AGUARDANDO,
      },
    });

    await tx.historicoStatus.create({
      data: {
        atendimentoId: atendimento.id,
        statusAnterior: null,
        statusNovo: StatusAtendimento.AGUARDANDO,
        observacao: "Atendimento aberto",
      },
    });

    return tx.atendimento.findUniqueOrThrow({
      where: { id: atendimento.id },
      include: atendimentoComRelacoes,
    });
  });
}

export async function listarAtendimentos(filtros: FiltrosAtendimento) {
  return prisma.atendimento.findMany({
    where: {
      ...(filtros.status ? { status: filtros.status } : {}),
      ...(filtros.veiculoId ? { veiculoId: filtros.veiculoId } : {}),
      ...(filtros.clienteId
        ? { veiculo: { clienteId: filtros.clienteId } }
        : {}),
      ...(filtros.dataInicio || filtros.dataFim
        ? {
            dataEntrada: {
              ...(filtros.dataInicio ? { gte: filtros.dataInicio } : {}),
              ...(filtros.dataFim ? { lte: filtros.dataFim } : {}),
            },
          }
        : {}),
    },
    include: atendimentoComRelacoes,
    orderBy: { dataEntrada: "desc" },
  });
}

export async function buscarAtendimentoPorId(id: number) {
  return prisma.atendimento.findUnique({
    where: { id },
    include: atendimentoComRelacoes,
  });
}

export async function editarAtendimento(id: number, data: EditarAtendimento) {
  if (data.veiculoId !== undefined) {
    const veiculo = await prisma.veiculo.findUnique({
      where: { id: data.veiculoId },
    });
    if (!veiculo) throw new Error("Veículo não encontrado");
  }

  return prisma.$transaction(async (tx) => {
    const atual = await tx.atendimento.findUnique({ where: { id } });
    if (!atual) throw new Error("Atendimento não encontrado");

    const mudouStatus =
      data.status !== undefined && data.status !== atual.status;
    const atendimento = await tx.atendimento.update({
      where: { id },
      data: {
        veiculoId: data.veiculoId,
        problemaRelatado: data.problemaRelatado,
        diagnostico: data.diagnostico,
        servicoPrevisto: data.servicoPrevisto,
        servicoRealizado: data.servicoRealizado,
        orcamentoValor: data.orcamentoValor,
        observacoes: data.observacoes,
        status: data.status,
        ...(data.status === StatusAtendimento.FINALIZADO
          ? { dataSaida: new Date() }
          : {}),
      },
    });

    if (mudouStatus) {
      await tx.historicoStatus.create({
        data: {
          atendimentoId: id,
          statusAnterior: atual.status,
          statusNovo: data.status!,
          observacao: "Status atualizado",
        },
      });
    }

    return tx.atendimento.findUniqueOrThrow({
      where: { id: atendimento.id },
      include: atendimentoComRelacoes,
    });
  });
}

export async function listarVeiculosNaOficina() {
  return prisma.veiculo.findMany({
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
        },
      },
    },
    include: {
      cliente: true,
      atendimentos: {
        where: {
          status: {
            in: [
              StatusAtendimento.AGUARDANDO,
              StatusAtendimento.EM_SERVICO,
              StatusAtendimento.PRONTO,
            ],
          },
        },
        include: { usuario: { select: { id: true, nome: true } } },
        orderBy: { dataEntrada: "desc" },
      },
    },
    orderBy: { placa: "asc" },
  });
}

export async function cancelarAtendimento(id: number) {
  return prisma.$transaction(async (tx) => {
    const atual = await tx.atendimento.findUnique({ where: { id } });
    if (!atual) throw new Error("Atendimento não encontrado");

    const atendimento = await tx.atendimento.update({
      where: { id },
      data: { status: StatusAtendimento.CANCELADO },
    });

    await tx.historicoStatus.create({
      data: {
        atendimentoId: id,
        statusAnterior: atual.status,
        statusNovo: StatusAtendimento.CANCELADO,
        observacao: "Atendimento cancelado",
      },
    });

    return tx.atendimento.findUniqueOrThrow({
      where: { id: atendimento.id },
      include: atendimentoComRelacoes,
    });
  });
}
