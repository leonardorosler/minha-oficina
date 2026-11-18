/** Tipos dos dados retornados pela API do backend */

export type StatusAtendimento =
  | 'AGUARDANDO'
  | 'EM_SERVICO'
  | 'PRONTO'
  | 'FINALIZADO'
  | 'CANCELADO';

export const STATUS_ROTULOS: Record<StatusAtendimento, string> = {
  AGUARDANDO: 'Aguardando',
  EM_SERVICO: 'Em serviço',
  PRONTO: 'Pronto',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export const STATUS_CORES: Record<StatusAtendimento, string> = {
  AGUARDANDO: 'pending',
  EM_SERVICO: 'progress',
  PRONTO: 'done',
  FINALIZADO: 'done',
  CANCELADO: 'danger',
};

export const STATUS_TODOS: StatusAtendimento[] = [
  'AGUARDANDO',
  'EM_SERVICO',
  'PRONTO',
  'FINALIZADO',
  'CANCELADO',
];

export type PapelUsuario = 'ADMIN' | 'MECANICO' | 'RECEPCIONISTA';

export const PAPEIS_ROTULOS: Record<PapelUsuario, string> = {
  ADMIN: 'Dono',
  MECANICO: 'Mecânico',
  RECEPCIONISTA: 'Recepcionista',
};

export interface UsuarioResumo {
  id: number;
  nome: string;
  email?: string;
  role?: PapelUsuario;
}

export interface Usuario extends UsuarioResumo {
  email: string;
  role: PapelUsuario;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string | null;
  cpf: string | null;
  endereco: string | null;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Veiculo {
  id: number;
  clienteId: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  cor: string | null;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
  cliente?: Cliente;
  atendimentos?: Atendimento[];
}

export interface HistoricoStatus {
  id: number;
  atendimentoId: number;
  statusAnterior: StatusAtendimento | null;
  statusNovo: StatusAtendimento;
  observacao: string | null;
  usuarioId?: number | null;
  usuario?: { id: number; nome: string } | null;
  criadoEm: string;
}

export interface Atendimento {
  id: number;
  veiculoId: number;
  usuarioId: number;
  problemaRelatado: string;
  diagnostico: string | null;
  servicoPrevisto: string | null;
  servicoRealizado: string | null;
  orcamentoValor: string | number | null;
  observacoes: string | null;
  status: StatusAtendimento;
  dataEntrada: string;
  dataSaida: string | null;
  criadoEm: string;
  atualizadoEm: string;
  veiculo?: Veiculo;
  usuario?: UsuarioResumo;
  historicoStatus?: HistoricoStatus[];
}

export interface ContadorStatus {
  status: StatusAtendimento;
  _count: { id: number };
}

export interface Dashboard {
  veiculosNaOficina: number;
  atendimentosPorStatus: ContadorStatus[];
  atendimentosRecentes: Atendimento[];
  veiculosProntos: Veiculo[];
  atendimentosFinalizados: Atendimento[];
}

export interface FluxoAtendimento {
  atendimento: Atendimento;
  statusAtual: StatusAtendimento;
  transicoesPossiveis: StatusAtendimento[];
  podeAlterar: boolean;
  historico: HistoricoStatus[];
}

export interface Transicoes {
  statusAtual: StatusAtendimento;
  transicoesPossiveis: StatusAtendimento[];
  podeAlterar: boolean;
}

export interface RespostaLogin {
  token: string;
  usuario: UsuarioResumo;
}

export function nomeVeiculo(veiculo?: Veiculo): string {
  if (!veiculo) return 'Veículo';
  return `${veiculo.marca} ${veiculo.modelo}`.trim();
}

export function formatarMoeda(valor: string | number | null | undefined): string {
  const numero = Number(valor ?? 0);
  if (!Number.isFinite(numero)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numero);
}

export function formatarData(valor?: string | null): string {
  if (!valor) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(valor));
}

export function formatarDataHora(valor?: string | null): string {
  if (!valor) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(valor));
}
