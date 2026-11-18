/** Veículos que estão atualmente na oficina */

import { Header } from '../Header';
import { Icon } from '../Icon';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { atendimentos as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { STATUS_ROTULOS, nomeVeiculo, type Atendimento } from '../../types/api';
import { Badge } from '../Badge';

interface NaOficinaProps {
  aoAbrirDetalhe: (id: number) => void;
  aoVoltar: () => void;
}

export function NaOficina({ aoAbrirDetalhe, aoVoltar }: NaOficinaProps) {
  const { dados, carregando, erro, recarregar } = useApiData(() => api.veiculosNaOficina());

  return (
    <>
      <Header titulo="Na oficina" voltar aoVoltar={aoVoltar} />
      <div className="info-strip summary">
        <span>Veículos em atendimento</span>
        <strong>{dados?.length ?? 0}</strong>
      </div>

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="cards" style={{ marginTop: 12 }}>
        {!carregando && dados?.length === 0 && <Vazio mensagem="Nenhum veículo na oficina" />}
        {dados?.map(veiculo => (
          <div key={veiculo.id} className="card">
            <div className="person-main">
              <span className="car-icon"><Icon nome="car" /></span>
              <span>
                <h4>{nomeVeiculo(veiculo)} {veiculo.ano ?? ''}</h4>
                <span className="meta">{veiculo.placa} · {veiculo.cliente?.nome}</span>
              </span>
            </div>
            <div className="cards" style={{ marginTop: 10 }}>
              {(veiculo.atendimentos ?? []).map((atendimento: Atendimento) => (
                <button type="button" key={atendimento.id} className="card click-card order-row" onClick={() => aoAbrirDetalhe(atendimento.id)}>
                  <span>
                    <h4>OS #{atendimento.id}</h4>
                    <p>{atendimento.servicoPrevisto ?? atendimento.problemaRelatado}</p>
                  </span>
                  <Badge status={atendimento.status} />
                </button>
              ))}
            </div>
            <p className="form-hint" style={{ marginTop: 8 }}>Status: {veiculo.atendimentos?.[0] ? STATUS_ROTULOS[veiculo.atendimentos[0].status] : '—'}</p>
          </div>
        ))}
      </div>
    </>
  );
}
