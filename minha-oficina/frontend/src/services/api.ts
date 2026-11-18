/** Cliente HTTP para conversar com a API do backend */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';
const CHAVE_TOKEN = 'minha-oficina-token';

export class ApiError extends Error {
  constructor(mensagem: string, readonly status: number) {
    super(mensagem);
    this.name = 'ApiError';
  }
}

export function lerToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function salvarToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function removerToken(): void {
  localStorage.removeItem(CHAVE_TOKEN);
}

interface OpcoesApi extends RequestInit {
  corpo?: unknown;
}

export async function api<T>(caminho: string, opcoes: OpcoesApi = {}): Promise<T> {
  const { corpo, ...resto } = opcoes;
  const cabecalhos = new Headers(resto.headers);
  cabecalhos.set('Content-Type', 'application/json');

  const token = lerToken();
  if (token) cabecalhos.set('Authorization', `Bearer ${token}`);

  let resposta: Response;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      ...resto,
      headers: cabecalhos,
      ...(corpo !== undefined ? { body: JSON.stringify(corpo) } : {}),
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor', 0);
  }

  const texto = await resposta.text();
  let dados: unknown = null;
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = null;
    }
  }

  if (!resposta.ok) {
    const mensagem =
      dados && typeof dados === 'object' && 'error' in dados
        ? String((dados as { error: unknown }).error)
        : 'Erro ao processar a solicitação';

    if (resposta.status === 401) {
      removerToken();
      window.dispatchEvent(new Event('sessao-expirada'));
    }

    throw new ApiError(mensagem, resposta.status);
  }

  return dados as T;
}

export const apiGet = <T>(caminho: string) => api<T>(caminho);

export const apiPost = <T>(caminho: string, corpo: unknown) =>
  api<T>(caminho, { method: 'POST', corpo });

export const apiPut = <T>(caminho: string, corpo: unknown) =>
  api<T>(caminho, { method: 'PUT', corpo });

export const apiPatch = <T>(caminho: string, corpo?: unknown) =>
  api<T>(caminho, { method: 'PATCH', ...(corpo !== undefined ? { corpo } : {}) });

export const apiDelete = <T>(caminho: string) => api<T>(caminho, { method: 'DELETE' });

export function mensagemErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Erro inesperado';
}
