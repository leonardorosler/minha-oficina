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

let renovando: Promise<boolean> | null = null;

function renovarSessao(): Promise<boolean> {
  if (!renovando) {
    renovando = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async resposta => {
        if (!resposta.ok) return false;
        const dados = await resposta.json();
        salvarToken(dados.token);
        return true;
      })
      .catch(() => false)
      .finally(() => { renovando = null; });
  }
  return renovando;
}

interface OpcoesApi extends RequestInit {
  corpo?: unknown;
}

export async function api<T>(caminho: string, opcoes: OpcoesApi = {}, tentouRenovar = false): Promise<T> {
  const { corpo, ...resto } = opcoes;
  const cabecalhos = new Headers(resto.headers);
  cabecalhos.set('Content-Type', 'application/json');

  const token = lerToken();
  if (token) cabecalhos.set('Authorization', `Bearer ${token}`);

  let resposta: Response;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      ...resto,
      credentials: 'include',
      headers: cabecalhos,
      ...(corpo !== undefined ? { body: JSON.stringify(corpo) } : {}),
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor', 0);
  }

  if (resposta.status === 401 && !tentouRenovar && !caminho.startsWith('/auth/')) {
    if (await renovarSessao()) return api<T>(caminho, opcoes, true);
    removerToken();
    window.dispatchEvent(new Event('sessao-expirada'));
    throw new ApiError('Sessão expirada', 401);
  }

  const texto = await resposta.text();
  let dados: unknown = null;
  if (texto) {
    try { dados = JSON.parse(texto); } catch { dados = null; }
  }

  if (!resposta.ok) {
    const mensagem =
      dados && typeof dados === 'object' && 'error' in dados
        ? String((dados as { error: unknown }).error)
        : 'Erro ao processar a solicitação';
    throw new ApiError(mensagem, resposta.status);
  }

  return dados as T;
}

export const apiGet = <T>(caminho: string) => api<T>(caminho);
export const apiPost = <T>(caminho: string, corpo: unknown) => api<T>(caminho, { method: 'POST', corpo });
export const apiPut = <T>(caminho: string, corpo: unknown) => api<T>(caminho, { method: 'PUT', corpo });
export const apiPatch = <T>(caminho: string, corpo?: unknown) => api<T>(caminho, { method: 'PATCH', ...(corpo !== undefined ? { corpo } : {}) });
export const apiDelete = <T>(caminho: string) => api<T>(caminho, { method: 'DELETE' });

export function mensagemErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Erro inesperado';
}
