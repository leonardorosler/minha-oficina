/** Sessão do usuário: login, logout e recuperação do token */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { auth } from '../services/endpoints';
import {
  lerToken,
  removerToken,
  salvarToken,
} from '../services/api';
import type { Usuario, UsuarioResumo } from '../types/api';

interface AuthContexto {
  usuario: Usuario | UsuarioResumo | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | UsuarioResumo | null>(null);
  const [carregando, setCarregando] = useState(Boolean(lerToken()));

  const sair = useCallback(() => {
    removerToken();
    setUsuario(null);
  }, []);

  useEffect(() => {
    if (!lerToken()) return;
    auth.eu()
      .then(setUsuario)
      .catch(sair)
      .finally(() => setCarregando(false));
  }, [sair]);

  useEffect(() => {
    window.addEventListener('sessao-expirada', sair);
    return () => window.removeEventListener('sessao-expirada', sair);
  }, [sair]);

  const entrar = useCallback(async (email: string, senha: string) => {
    const resposta = await auth.login(email, senha);
    salvarToken(resposta.token);
    setUsuario(resposta.usuario);
    setCarregando(false);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useAuth(): AuthContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return contexto;
}
