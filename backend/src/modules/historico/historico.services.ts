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
  });
  return historicoStatus;
}
