/** Painel inicial com os dados do dashboard */

import { useState } from 'react';
import { Header } from '../Header';
import { Search } from '../Search';
import { OrderCard } from '../OrderCard';
import { Icon } from '../Icon';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { dashboard } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { useAuth } from '../../context/AuthContext';
import { STATUS_ROTULOS, type StatusAtendimento } from '../../types/api';
import type { Tela } from '../../types';

interface PainelProps {
  aoNavegar: (tela: Tela) => void;
  aoAbrirDetalhe: (id: number) => void;
  aoFiltrar: (status: StatusAtendimento) => void;
  aoAbrirPerfil: () => void;
}

const RESUMO: StatusAtendimento[] = [
  'AGUARDANDO',
  'EM_SERVICO',
  'PRONTO',
  'FINALIZADO',
];

export function Painel({ aoNavegar, aoAbrirDetalhe, aoFiltrar, aoAbrirPerfil }: PainelProps) {
  const { usuario } = useAuth();
  const [busca, setBusca] = useState('');
  const { dados, carregando, erro, recarregar } = useApiData(() => dashboard.buscar());

  const primeiroNome = usuario?.nome.split(' ')[0] ?? 'Carlos';
  const contagem = (status: StatusAtendimento) =>
    dados?.atendimentosPorStatus.find(item => item.status === status)?._count.id ?? 0;

  const recentes = (dados?.atendimentosRecentes ?? []).filter(atendimento => {
    if (!busca.trim()) return true;
    const texto = busca.toLowerCase();
    return (
      String(atendimento.id).includes(texto) ||
      atendimento.veiculo?.placa.toLowerCase().includes(texto) ||
      atendimento.veiculo?.cliente?.nome.toLowerCase().includes(texto)
    );
  });

  const irParaFiltro = (status: StatusAtendimento) => {
    aoFiltrar(status);
    aoNavegar('ordens');
  };

  return (
    <>
      <Header titulo={`Bom dia, ${primeiroNome}`} acao="avatar" aoClicarAcao={aoAbrirPerfil} />
      <Search placeholder="Buscar cliente, placa ou OS" valor={busca} aoAlterar={setBusca} />

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      {dados && (
        <>
          <div className="section-row"><h3>Resumo da oficina</h3></div>
          <div className="cards stats">
            {RESUMO.map(status => (
              <button
                type="button"
                key={status}
                className="card click-card stat"
                onClick={() => irParaFiltro(status)}
              >
                <span className="stat-number">{contagem(status)}</span>
                <span>
                  <strong>{STATUS_ROTULOS[status]}</strong>
                  <small>Toque para filtrar</small>
                </span>
              </button>
            ))}
          </div>

          <div className="cards" style={{ marginTop: 10 }}>
            <button type="button" className="card click-card alert-card" onClick={() => irParaFiltro('AGUARDANDO')}>
              <span>
                <strong>{contagem('AGUARDANDO')} aguardando atendimento</strong>
                <small>Ver ordens paradas</small>
              </span>
              <Icon nome="arrowRight" />
            </button>
            <button type="button" className="card click-card alert-card" onClick={() => irParaFiltro('PRONTO')}>
              <span>
                <strong>{dados.veiculosProntos.length} prontos para retirada</strong>
                <small>Avisar os clientes</small>
              </span>
              <Icon nome="arrowRight" />
            </button>
          </div>

          <div className="section-row">
            <h3>Ordens recentes</h3>
            <button type="button" className="link-button" onClick={() => aoNavegar('ordens')}>Ver todas</button>
          </div>

          <div className="cards">
            {recentes.length > 0 ? recentes.map(atendimento => (
              <OrderCard
                key={atendimento.id}
                atendimento={atendimento}
                aoClicar={() => aoAbrirDetalhe(atendimento.id)}
              />
            )) : <Vazio mensagem="Nenhuma ordem encontrada" />}
          </div>
        </>
      )}
    </>
  );
}
