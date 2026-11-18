/** Carrega dados da API mantendo os anteriores visíveis durante a atualização */

import { useCallback, useEffect, useRef, useState } from 'react';
import { mensagemErro } from '../services/api';

export function useApiData<T>(carregador: () => Promise<T>, dependencias: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const jaCarregou = useRef(false);

  const recarregar = useCallback(() => {
    if (jaCarregou.current) setAtualizando(true);
    else setCarregando(true);
    setErro(null);

    carregador()
      .then(resultado => {
        setDados(resultado);
        jaCarregou.current = true;
      })
      .catch(e => setErro(mensagemErro(e)))
      .finally(() => {
        setCarregando(false);
        setAtualizando(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, carregando, atualizando, erro, recarregar, setDados };
}
