/** Todas as rotas disponíveis no backend */

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './api';
import type {
  Atendimento,
  Cliente,
  Dashboard,
  FluxoAtendimento,
  RespostaLogin,
  HistoricoStatus,
  StatusAtendimento,
  Transicoes,
  Usuario,
  UsuarioResumo,
  Veiculo,
} from '../types/api';

export const auth = {
  login: (email: string, senha: string) =>
    apiPost<RespostaLogin>('/auth/login', { email, senha }),
  refresh: () => apiPost<RespostaLogin>('/auth/refresh', {}),
  logout: () => apiPost<{ message: string }>('/auth/logout', {}),
  trocarSenha: (senhaAtual: string, senhaNova: string) =>
    apiPatch<{ message: string }>('/auth/senha', { senhaAtual, senhaNova }),
  eu: () => apiGet<Usuario>('/auth/me'),
};

export const dashboard = {
  buscar: (dataInicio?: string, dataFim?: string) => {
    const params = new URLSearchParams();
    if (dataInicio) params.set('dataInicio', dataInicio);
    if (dataFim) params.set('dataFim', dataFim);
    const consulta = params.toString();
    return apiGet<Dashboard>(`/dashboard${consulta ? `?${consulta}` : ''}`);
  },
};

export const clientes = {
  listar: (pagina = 1, limite = 50) =>
    apiGet<Cliente[]>(`/clientes?pagina=${pagina}&limite=${limite}`),
  buscar: (id: number) => apiGet<Cliente>(`/clientes/${id}`),
  buscarPorCpf: (cpf: string) =>
    apiGet<Cliente>(`/clientes/cpf/${encodeURIComponent(cpf)}`),
  veiculos: (id: number) => apiGet<Veiculo[]>(`/clientes/${id}/veiculos`),
  atendimentos: (id: number) => apiGet<Atendimento[]>(`/clientes/${id}/atendimentos`),
  criar: (dados: {
    nome: string;
    telefone: string;
    email: string;
    cpf: string;
    endereco: string;
    observacoes?: string;
  }) => apiPost<Cliente>('/clientes', dados),
  atualizar: (id: number, dados: Partial<{
    nome: string;
    telefone: string;
    email: string;
    cpf: string;
    endereco: string;
    observacoes: string;
  }>) => apiPut<Cliente>(`/clientes/${id}`, dados),
  excluir: (id: number) => apiDelete<Cliente>(`/clientes/${id}`),
};

export const veiculos = {
  listar: () => apiGet<Veiculo[]>('/veiculos'),
  buscar: (id: number) => apiGet<Veiculo>(`/veiculos/${id}`),
  buscarPorPlaca: (placa: string) =>
    apiGet<Veiculo>(`/veiculos/placa/${encodeURIComponent(placa)}`),
  atendimentos: (id: number) => apiGet<Atendimento[]>(`/veiculos/${id}/atendimentos`),
  criar: (dados: {
    clienteId: number;
    placa: string;
    marca: string;
    modelo: string;
    ano?: number;
    cor?: string;
    observacoes?: string;
  }) => apiPost<Veiculo>('/veiculos', dados),
  atualizar: (id: number, dados: Partial<{
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    cor: string;
    observacoes: string;
  }>) => apiPut<Veiculo>(`/veiculos/${id}`, dados),
  excluir: (id: number) => apiDelete<Veiculo>(`/veiculos/${id}`),
};

export interface FiltrosAtendimento {
  status?: StatusAtendimento;
  dataInicio?: string;
  dataFim?: string;
  clienteId?: number;
  veiculoId?: number;
}

export const atendimentos = {
  listar: (filtros: FiltrosAtendimento = {}, pagina = 1, limite = 50) => {
    const params = new URLSearchParams();
    params.set('pagina', String(pagina));
    params.set('limite', String(limite));
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== '') params.set(chave, String(valor));
    });
    const consulta = params.toString();
    return apiGet<Atendimento[]>(`/atendimentos${consulta ? `?${consulta}` : ''}`);
  },
  buscar: (id: number) => apiGet<Atendimento>(`/atendimentos/${id}`),
  veiculosNaOficina: () => apiGet<Veiculo[]>('/atendimentos/veiculos-na-oficina'),
  criar: (dados: {
    veiculoId: number;
    problemaRelatado: string;
    diagnostico?: string;
    servicoPrevisto?: string;
    orcamentoValor?: number;
    observacoes?: string;
  }) => apiPost<Atendimento>('/atendimentos', dados),
  editar: (id: number, dados: Partial<{
    veiculoId: number;
    problemaRelatado: string;
    diagnostico: string | null;
    servicoPrevisto: string | null;
    servicoRealizado: string | null;
    orcamentoValor: number | null;
    observacoes: string | null;
    status: StatusAtendimento;
  }>) => apiPut<Atendimento>(`/atendimentos/${id}`, dados),
  cancelar: (id: number) =>
    apiPatch<Atendimento>(`/atendimentos/${id}/cancelar`),
};

export const fluxo = {
  buscar: (id: number) =>
    apiGet<FluxoAtendimento>(`/fluxo-atendimento/${id}/fluxo`),
  transicoes: (id: number) =>
    apiGet<Transicoes>(`/fluxo-atendimento/${id}/transicoes`),
  alterarStatus: (id: number, statusNovo: StatusAtendimento, observacao?: string) =>
    apiPatch<Atendimento>(`/fluxo-atendimento/${id}/status`, {
      statusNovo,
      ...(observacao ? { observacao } : {}),
    }),
};

export const historico = {
  statusDoAtendimento: (atendimentoId: number) =>
    apiGet<HistoricoStatus[]>(`/historico/atendimentos/${atendimentoId}/status`),
  doVeiculo: (veiculoId: number, dataInicio?: string, dataFim?: string) => {
    const params = new URLSearchParams();
    if (dataInicio) params.set('dataInicio', dataInicio);
    if (dataFim) params.set('dataFim', dataFim);
    const consulta = params.toString();
    return apiGet<Atendimento[]>(
      `/historico/veiculos/${veiculoId}/atendimentos${consulta ? `?${consulta}` : ''}`,
    );
  },
  doCliente: (clienteId: number, dataInicio?: string, dataFim?: string) => {
    const params = new URLSearchParams();
    if (dataInicio) params.set('dataInicio', dataInicio);
    if (dataFim) params.set('dataFim', dataFim);
    const consulta = params.toString();
    return apiGet<Atendimento[]>(
      `/historico/clientes/${clienteId}/atendimentos${consulta ? `?${consulta}` : ''}`,
    );
  },
};

export const usuarios = {
  listar: () => apiGet<Usuario[]>('/usuarios'),
  buscar: (id: number) => apiGet<Usuario>(`/usuarios/${id}`),
  criar: (dados: { nome: string; email: string; senha: string }) =>
    apiPost<Usuario>('/usuarios', dados),
  editar: (id: number, dados: { nome?: string; email?: string; senha?: string }) =>
    apiPatch<Usuario>(`/usuarios/${id}`, dados),
  ativar: (id: number) => apiPatch<Usuario>(`/usuarios/${id}/ativar`),
  desativar: (id: number) => apiPatch<Usuario>(`/usuarios/${id}/desativar`),
};

export type { UsuarioResumo };
