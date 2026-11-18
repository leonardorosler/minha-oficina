/** Carrega dados da API e expõe estado de carregamento e erro */

import { useCallback, useEffect, useState } from 'react';
import { mensagemErro } from '../services/api';

export function useApiData<T>(carregador: () => Promise<T>, dependencias: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setErro(null);
    carregador()
      .then(setDados)
      .catch(e => setErro(mensagemErro(e)))
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, carregando, erro, recarregar, setDados };
}
