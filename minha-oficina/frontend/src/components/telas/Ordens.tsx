/** Lista de ordens de serviço com filtros e veículos na oficina */

import { useState } from 'react';
import { Header } from '../Header';
import { Search } from '../Search';
import { OrderCard } from '../OrderCard';
import { Icon } from '../Icon';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { atendimentos as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { STATUS_ROTULOS, type StatusAtendimento } from '../../types/api';

interface OrdensProps {
  filtro: StatusAtendimento | null;
  aoFiltrar: (filtro: StatusAtendimento | null) => void;
  aoAbrirDetalhe: (id: number) => void;
  aoVoltar: () => void;
}

const ABAS: (StatusAtendimento | null)[] = [
  null,
  'AGUARDANDO',
  'EM_SERVICO',
  'PRONTO',
  'FINALIZADO',
];

export function Ordens({ filtro, aoFiltrar, aoAbrirDetalhe, aoVoltar }: OrdensProps) {
  const [busca, setBusca] = useState('');
  const [somenteOficina, setSomenteOficina] = useState(false);
  const { dados, carregando, erro, recarregar } = useApiData(
    () => api.listar(filtro ? { status: filtro } : {}),
    [filtro],
  );
  const naOficina = useApiData(() => api.veiculosNaOficina(), []);

  const visiveis = (dados ?? []).filter(atendimento => {
    if (!busca.trim()) return true;
    const texto = busca.toLowerCase();
    return (
      String(atendimento.id).includes(texto) ||
      atendimento.veiculo?.placa.toLowerCase().includes(texto) ||
      atendimento.veiculo?.cliente?.nome.toLowerCase().includes(texto)
    );
  });

  return (
    <>
      <Header titulo="Ordens" voltar aoVoltar={aoVoltar} />

      <Search placeholder="Buscar por OS, cliente ou placa" valor={busca} aoAlterar={setBusca} />

      <div className="tabs">
        {ABAS.map(aba => (
          <button
            type="button"
            key={aba ?? 'todas'}
            className={`tab ${filtro === aba ? 'active' : ''}`}
            onClick={() => aoFiltrar(aba)}
          >
            {aba ? STATUS_ROTULOS[aba] : 'Todas'}
          </button>
        ))}
      </div>

      <button type="button" className="card click-card alert-card" onClick={() => setSomenteOficina(v => !v)}>
        <span>
          <strong>Veículos na oficina</strong>
          <small>{naOficina.dados?.length ?? 0} veículos em atendimento</small>
        </span>
        <Icon nome="chevron" />
      </button>

      {somenteOficina && (
        <div className="cards" style={{ marginTop: 10 }}>
          {naOficina.carregando && <Carregando />}
          {naOficina.dados?.map(veiculo => (
            <div key={veiculo.id} className="card vehicle-card">
              <span className="car-icon"><Icon nome="car" /></span>
              <span>
                <h4>{veiculo.marca} {veiculo.modelo}</h4>
                <span className="meta">{veiculo.placa} · {veiculo.cliente?.nome}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="section-row"><h3>Ordens de serviço</h3></div>

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="cards">
        {!carregando && visiveis.length === 0 && <Vazio mensagem="Nenhuma ordem encontrada" />}
        {visiveis.map(atendimento => (
          <OrderCard
            key={atendimento.id}
            atendimento={atendimento}
            aoClicar={() => aoAbrirDetalhe(atendimento.id)}
          />
        ))}
      </div>
    </>
  );
}
