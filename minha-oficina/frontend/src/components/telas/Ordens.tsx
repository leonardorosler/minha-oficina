/** Lista de ordens de serviço com filtros e veículos na oficina */

import { useEffect, useState } from 'react';
import { Header } from '../Header';
import { Search } from '../Search';
import { OrderCard } from '../OrderCard';
import { Icon } from '../Icon';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { atendimentos as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { STATUS_ROTULOS, type Atendimento, type StatusAtendimento } from '../../types/api';

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
  const [pagina, setPagina] = useState(1);
  const [itens, setItens] = useState<Atendimento[]>([]);
  const { dados, carregando, atualizando, erro, recarregar } = useApiData(
    () => api.listar(filtro ? { status: filtro } : {}, pagina, 20),
    [filtro, pagina],
  );

  useEffect(() => {
    if (!dados) return;
    setItens(anterior => pagina === 1
      ? dados
      : [...anterior, ...dados.filter(item => !anterior.some(feito => feito.id === item.id))]);
  }, [dados, pagina]);
  const naOficina = useApiData(() => api.veiculosNaOficina(), []);

  useEffect(() => { setPagina(1); }, [filtro]);

  const visiveis = itens.filter(atendimento => {
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
        <Icon nome="arrowRight" />
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

      <div className={`cards ${atualizando ? 'atualizando' : ''}`}>
        {!carregando && visiveis.length === 0 && <Vazio mensagem="Nenhuma ordem encontrada" />}
        {visiveis.map(atendimento => (
          <OrderCard
            key={atendimento.id}
            atendimento={atendimento}
            aoClicar={() => aoAbrirDetalhe(atendimento.id)}
          />
        ))}
      </div>

      {dados && dados.length === 20 && (
        <button type="button" className="ghost full" style={{ marginTop: 12 }} onClick={() => setPagina(p => p + 1)}>
          Carregar mais ordens
        </button>
      )}
    </>
  );
}
