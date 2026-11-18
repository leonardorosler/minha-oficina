/** Cartão de atendimento (ordem de serviço) */

import { Badge } from './Badge';
import { Icon } from './Icon';
import {
  formatarMoeda,
  nomeVeiculo,
  type Atendimento,
} from '../types/api';

interface OrderCardProps {
  atendimento: Atendimento;
  aoClicar: () => void;
}

export function OrderCard({ atendimento, aoClicar }: OrderCardProps) {
  const veiculo = atendimento.veiculo;
  const cliente = veiculo?.cliente?.nome ?? 'Cliente';

  return (
    <button
      type="button"
      className={`card click-card order-row os-${atendimento.status.toLowerCase()}`}
      onClick={aoClicar}
    >
      <div className="order-conteudo">
        <h4>OS #{atendimento.id}</h4>
        <p>
          <strong>{nomeVeiculo(veiculo)} {veiculo?.ano ?? ''}</strong>
          <br />
          {cliente}{atendimento.usuario?.nome && ` · ${atendimento.usuario.nome}`}
        </p>
      </div>

      <div className="order-lateral">
        <Badge status={atendimento.status} />
        {atendimento.orcamentoValor && (
          <p className="money">{formatarMoeda(atendimento.orcamentoValor)}</p>
        )}
      </div>

      <span className="seta-circular" aria-hidden="true"><Icon nome="arrowRight" /></span>
    </button>
  );
}
