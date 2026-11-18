/**
 * Seed simples para apresentacao/demonstracao.
 *
 * Executar: npx prisma db seed   (ou npx tsx prisma/seed.ts)
 *
 * O script e idempotente: pode ser executado varias vezes sem duplicar
 * registros (usuarios por e-mail, clientes por CPF, veiculos por placa).
 *
 * ATENCAO: a senha abaixo e apenas para demonstracao local. Troque a senha
 * (ou a variavel SENHA_DEMO) antes de usar a seed em qualquer ambiente real.
 */
import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RoleUsuario, StatusAtendimento } from "../generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const SENHA_DEMO = "123456";

async function main() {
  const senhaHash = await hash(SENHA_DEMO, 12);

  // 1) Usuarios ---------------------------------------------------------------
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@oficina.com" },
    update: { nome: "Carlos Costa", senhaHash, ativo: true, role: RoleUsuario.ADMIN },
    create: {
      nome: "Carlos Costa",
      email: "admin@oficina.com",
      senhaHash,
      role: RoleUsuario.ADMIN,
    },
  });

  const mecanico = await prisma.usuario.upsert({
    where: { email: "mecanico@oficina.com" },
    update: { nome: "Carlos Mecanico", senhaHash, ativo: true, role: RoleUsuario.MECANICO },
    create: {
      nome: "Carlos Mecanico",
      email: "mecanico@oficina.com",
      senhaHash,
      role: RoleUsuario.MECANICO,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "recepcao@oficina.com" },
    update: { nome: "Ana Recepcionista", senhaHash, ativo: true, role: RoleUsuario.RECEPCIONISTA },
    create: {
      nome: "Ana Recepcionista",
      email: "recepcao@oficina.com",
      senhaHash,
      role: RoleUsuario.RECEPCIONISTA,
    },
  });

  // 2) Clientes ---------------------------------------------------------------
  const clientes = [
    {
      nome: "Joao Silva",
      telefone: "(11) 98765-4321",
      email: "joao.silva@email.com",
      cpf: "111.222.333-44",
      endereco: "Rua das Acacias, 120",
      observacoes: "Cliente VIP",
    },
    {
      nome: "Ana Oliveira",
      telefone: "(21) 99876-5432",
      email: "ana.oliveira@email.com",
      cpf: "222.333.444-55",
      endereco: "Av. Brasil, 1500",
      observacoes: null,
    },
    {
      nome: "Carlos Pereira",
      telefone: "(31) 98712-4567",
      email: "carlos.pereira@email.com",
      cpf: "333.444.555-66",
      endereco: "Rua das Palmeiras, 45",
      observacoes: "Prefere atendimento pela manha",
    },
  ];

  const clientePorCpf = new Map<string, { id: number; nome: string }>();

  for (const cliente of clientes) {
    const salvo = await prisma.cliente.upsert({
      where: { cpf: cliente.cpf },
      update: cliente,
      create: cliente,
    });

    clientePorCpf.set(cliente.cpf, { id: salvo.id, nome: salvo.nome });
  }

  // 3) Veiculos ---------------------------------------------------------------
  const veiculos = [
    {
      cpf: "111.222.333-44",
      placa: "ABC1D23",
      marca: "Toyota",
      modelo: "Corolla",
      ano: 2020,
      cor: "Prata",
      observacoes: null,
    },
    {
      cpf: "222.333.444-55",
      placa: "XYZ4K56",
      marca: "Volkswagen",
      modelo: "Golf",
      ano: 2019,
      cor: "Azul",
      observacoes: "Veiculo do cliente Ana",
    },
    {
      cpf: "333.444.555-66",
      placa: "DEF7G89",
      marca: "Chevrolet",
      modelo: "Onix",
      ano: 2022,
      cor: "Preto",
      observacoes: null,
    },
  ];

  const veiculoPorPlaca = new Map<string, number>();

  for (const veiculo of veiculos) {
    const cliente = clientePorCpf.get(veiculo.cpf)!;

    const salvo = await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {
        clienteId: cliente.id,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        cor: veiculo.cor,
        observacoes: veiculo.observacoes,
      },
      create: {
        clienteId: cliente.id,
        placa: veiculo.placa,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        cor: veiculo.cor,
        observacoes: veiculo.observacoes,
      },
    });

    veiculoPorPlaca.set(veiculo.placa, salvo.id);
  }

  // 4) Atendimentos + historico de status -------------------------------------
  const agora = Date.now();
  const dia = 24 * 60 * 60 * 1000;

  const atendimentos = [
    {
      placa: "ABC1D23",
      usuarioId: admin.id,
      problemaRelatado: "Revisao periodica e troca de oleo",
      diagnostico: null,
      servicoPrevisto: "Troca de oleo e filtros",
      servicoRealizado: null,
      orcamentoValor: 450,
      observacoes: "Aguardando encaixe na oficina",
      status: StatusAtendimento.AGUARDANDO,
      dataEntrada: new Date(agora),
      dataSaida: null,
    },
    {
      placa: "XYZ4K56",
      usuarioId: mecanico.id,
      problemaRelatado: "Freios making noise na frenagem",
      diagnostico: "Pastilhas e disco dianteiros desgastados",
      servicoPrevisto: "Revisao do freio dianteiro",
      servicoRealizado: null,
      orcamentoValor: 680,
      observacoes: "Servico em andamento",
      status: StatusAtendimento.EM_SERVICO,
      dataEntrada: new Date(agora - dia),
      dataSaida: null,
    },
    {
      placa: "DEF7G89",
      usuarioId: admin.id,
      problemaRelatado: "Troca de pneus",
      diagnostico: "Quatro pneus com desgaste irregular",
      servicoPrevisto: "4 pneus + balanceamento",
      servicoRealizado: "4 pneus + balanceamento e alinhamento",
      orcamentoValor: 1200,
      observacoes: "Aguardando retirada do cliente",
      status: StatusAtendimento.PRONTO,
      dataEntrada: new Date(agora - 2 * dia),
      dataSaida: null,
    },
    {
      placa: "ABC1D23",
      usuarioId: mecanico.id,
      problemaRelatado: "Sistema eletrico nao funciona",
      diagnostico: "Bateria descarregada",
      servicoPrevisto: "Troca de bateria",
      servicoRealizado: "Troca da bateria e teste do alternador",
      orcamentoValor: 320,
      observacoes: "Servico finalizado",
      status: StatusAtendimento.FINALIZADO,
      dataEntrada: new Date(agora - 5 * dia),
      dataSaida: new Date(agora - 3 * dia),
    },
  ];

  // Cadeia de status ate o status atual (para montar o historico coerente).
  const cadeiaPorStatus: Record<
    string,
    (typeof StatusAtendimento)[keyof typeof StatusAtendimento][]
  > = {
    [StatusAtendimento.AGUARDANDO]: [StatusAtendimento.AGUARDANDO],
    [StatusAtendimento.EM_SERVICO]: [
      StatusAtendimento.AGUARDANDO,
      StatusAtendimento.EM_SERVICO,
    ],
    [StatusAtendimento.PRONTO]: [
      StatusAtendimento.AGUARDANDO,
      StatusAtendimento.EM_SERVICO,
      StatusAtendimento.PRONTO,
    ],
    [StatusAtendimento.FINALIZADO]: [
      StatusAtendimento.AGUARDANDO,
      StatusAtendimento.EM_SERVICO,
      StatusAtendimento.PRONTO,
      StatusAtendimento.FINALIZADO,
    ],
  };

  for (const atendimento of atendimentos) {
    const veiculoId = veiculoPorPlaca.get(atendimento.placa)!;

    const dados = {
      veiculoId,
      usuarioId: atendimento.usuarioId,
      problemaRelatado: atendimento.problemaRelatado,
      diagnostico: atendimento.diagnostico,
      servicoPrevisto: atendimento.servicoPrevisto,
      servicoRealizado: atendimento.servicoRealizado,
      orcamentoValor: atendimento.orcamentoValor,
      observacoes: atendimento.observacoes,
      status: atendimento.status,
      dataEntrada: atendimento.dataEntrada,
      dataSaida: atendimento.dataSaida,
    };

    const existente = await prisma.atendimento.findFirst({
      where: { veiculoId, problemaRelatado: atendimento.problemaRelatado },
    });

    const salvo = existente
      ? await prisma.atendimento.update({ where: { id: existente.id }, data: dados })
      : await prisma.atendimento.create({ data: dados });

    // Refaz o historico do atendimento para manter tudo coerente com o status.
    await prisma.historicoStatus.deleteMany({ where: { atendimentoId: salvo.id } });

    const cadeia = cadeiaPorStatus[atendimento.status] ?? [];

    for (let i = 1; i < cadeia.length; i++) {
      await prisma.historicoStatus.create({
        data: {
          atendimentoId: salvo.id,
          statusAnterior: cadeia[i - 1],
          statusNovo: cadeia[i],
          observacao: `Status alterado para ${cadeia[i]}`,
        },
      });
    }
  }

  const [totalUsuarios, totalClientes, totalVeiculos, totalAtendimentos] =
    await Promise.all([
      prisma.usuario.count(),
      prisma.cliente.count(),
      prisma.veiculo.count(),
      prisma.atendimento.count(),
    ]);

  console.log("Seed concluida com sucesso.");
  console.log(
    `Totais no banco: usuarios=${totalUsuarios} clientes=${totalClientes} veiculos=${totalVeiculos} atendimentos=${totalAtendimentos}`,
  );
  console.log(`Acesso de demonstracao: admin@oficina.com / ${SENHA_DEMO}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar a seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
