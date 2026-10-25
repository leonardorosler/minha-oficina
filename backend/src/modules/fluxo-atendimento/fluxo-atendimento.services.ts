import { StatusAtendimento } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

/**
 * Define as transições válidas do fluxo de atendimento
 * AGUARDANDO → EM_SERVICO → PRONTO → FINALIZADO
 */
const TRANSICOES_VALIDAS: Record<StatusAtendimento, StatusAtendimento[]> = {
  [StatusAtendimento.AGUARDANDO]: [StatusAtendimento.EM_SERVICO],
  [StatusAtendimento.EM_SERVICO]: [StatusAtendimento.PRONTO],
  [StatusAtendimento.PRONTO]: [StatusAtendimento.FINALIZADO],
  [StatusAtendimento.FINALIZADO]: [], // Não permite transições a partir de FINALIZADO
  [StatusAtendimento.CANCELADO]: [], // Não permite transições a partir de CANCELADO
};

/**
 * Verifica se uma transição de status é válida segundo o fluxo definido
 */
export function validarTransicao(
  statusAtual: StatusAtendimento,
  statusNovo: StatusAtendimento
): boolean {
  const transicoesPermitidas = TRANSICOES_VALIDAS[statusAtual] ?? [];
  return transicoesPermitidas.includes(statusNovo);
}

/**
 * Retorna as transições possíveis a partir de um status
 */
export function obterTransicoesPossiveis(
  statusAtual: StatusAtendimento
): StatusAtendimento[] {
  return TRANSICOES_VALIDAS[statusAtual] ?? [];
}

/**
  Verifica se o atendimento pode ter seu status alterado
 */
export function podeAlterarStatus(statusAtual: StatusAtendimento): boolean {
  return (
    statusAtual !== StatusAtendimento.FINALIZADO &&
    statusAtual !== StatusAtendimento.CANCELADO
  );
}

export interface AlterarStatusAtendimento {
  statusNovo: StatusAtendimento;
  observacao?: string;
  usuarioId: number;
}

export async function alterarStatusAtendimento(
  atendimentoId: number,
  dados: AlterarStatusAtendimento
) {
  return prisma.$transaction(async (tx) => {
    // Busca o atendimento atual
    const atendimento = await tx.atendimento.findUnique({
      where: { id: atendimentoId },
    });

    if (!atendimento) {
      throw new Error("Atendimento não encontrado");
    }

    // Verifica se o atendimento pode ser alterado
    if (!podeAlterarStatus(atendimento.status)) {
      throw new Error(
        `Não é possível alterar status de atendimento ${atendimento.status.toLowerCase()}`
      );
    }

    // Valida a transição
    if (!validarTransicao(atendimento.status, dados.statusNovo)) {
      const transicoesPossiveis = obterTransicoesPossiveis(
        atendimento.status
      ).join(", ");
      throw new Error(
        `Transição inválida: ${atendimento.status} → ${dados.statusNovo}. ` +
          `Transições permitidas: ${transicoesPossiveis || "nenhuma"}`
      );
    }

    // Prepara dados de atualização
    const dadosAtualizacao: Record<string, unknown> = {
      status: dados.statusNovo,
    };

    // Define data de saída ao finalizar
    if (dados.statusNovo === StatusAtendimento.FINALIZADO) {
      dadosAtualizacao.dataSaida = new Date();
    }

    // Atualiza o atendimento
    const atendimentoAtualizado = await tx.atendimento.update({
      where: { id: atendimentoId },
      data: dadosAtualizacao,
    });

    // Registra no histórico de status
    await tx.historicoStatus.create({
      data: {
        atendimentoId,
        statusAnterior: atendimento.status,
        statusNovo: dados.statusNovo,
        observacao: dados.observacao ?? `Status alterado para ${dados.statusNovo}`,
      },
    });

    // Retorna o atendimento atualizado com relações
    return tx.atendimento.findUniqueOrThrow({
      where: { id: atendimentoId },
      include: {
        veiculo: { include: { cliente: true } },
        usuario: { select: { id: true, nome: true, email: true } },
        historicoStatus: { orderBy: { criadoEm: "asc" as const } },
      },
    });
  });
}

export async function buscarFluxoAtendimento(atendimentoId: number) {
  const atendimento = await prisma.atendimento.findUnique({
    where: { id: atendimentoId },
    include: {
      historicoStatus: {
        orderBy: { criadoEm: "asc" },
        include: {
          // O usuario não está diretamente no historicoStatus, mas podemos buscar se necessário
        },
      },
    },
  });

  if (!atendimento) {
    throw new Error("Atendimento não encontrado");
  }

  return {
    atendimento,
    statusAtual: atendimento.status,
    transicoesPossiveis: obterTransicoesPossiveis(atendimento.status),
    podeAlterar: podeAlterarStatus(atendimento.status),
    historico: atendimento.historicoStatus,
  };
}