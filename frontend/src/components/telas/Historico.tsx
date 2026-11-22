/** Histórico de serviços finalizados */

import { useState } from 'react';
import { Header } from '../Header';
import { OrderCard } from '../OrderCard';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { atendimentos, historico as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { formatarMoeda, nomeVeiculo, type Atendimento } from '../../types/api';

interface HistoricoProps {
  clienteId: number | null;
  aoAbrirDetalhe: (id: number) => void;
  aoVoltar: () => void;
}

type Periodo = '30' | '90' | '365';

function inicioDoPeriodo(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data.toISOString().slice(0, 10);
}

export function Historico({ clienteId, aoAbrirDetalhe, aoVoltar }: HistoricoProps) {
  const [periodo, setPeriodo] = useState<Periodo>('30');
  const inicio = inicioDoPeriodo(Number(periodo));
  const hoje = new Date().toISOString().slice(0, 10);

  const { dados, carregando, erro, recarregar } = useApiData<Atendimento[]>(() => {
    if (clienteId) return api.doCliente(clienteId, inicio, hoje);
    return atendimentos.listar({ status: 'FINALIZADO', dataInicio: inicio, dataFim: hoje });
  }, [clienteId, inicio]);

  const total = (dados ?? []).reduce((soma, item) => soma + Number(item.orcamentoValor ?? 0), 0);

  return (
    <>
      <Header titulo="Histórico" voltar aoVoltar={aoVoltar} />

      <div className="tabs">
        {([['30', '30 dias'], ['90', '3 meses'], ['365', '12 meses']] as [Periodo, string][]).map(([valor, rotulo]) => (
          <button type="button" key={valor} className={`tab ${periodo === valor ? 'active' : ''}`} onClick={() => setPeriodo(valor)}>
            {rotulo}
          </button>
        ))}
      </div>

      <div className="info-strip summary">
        <span>{dados?.length ?? 0} serviços no período</span>
        <span className="money">{formatarMoeda(total)}</span>
      </div>

      <div className="section-row"><h3>Serviços finalizados</h3></div>

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="cards" style={{ marginTop: 12 }}>
        {!carregando && dados?.length === 0 && <Vazio mensagem="Nenhum serviço finalizado no período" />}
        {dados?.map(atendimento => (
          <OrderCard key={atendimento.id} atendimento={atendimento} aoClicar={() => aoAbrirDetalhe(atendimento.id)} />
        ))}
      </div>

      {dados && dados.length > 0 && (
        <p className="form-hint" style={{ marginTop: 12 }}>
          {nomeVeiculo(dados[0].veiculo)} e outros {dados.length - 1} atendimentos
        </p>
      )}
    </>
  );
}
