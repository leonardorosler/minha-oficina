/** Badge com o status do atendimento */

import {
  STATUS_CORES,
  STATUS_ROTULOS,
  type StatusAtendimento,
} from '../types/api';

interface BadgeProps {
  status: StatusAtendimento;
}

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`badge ${STATUS_CORES[status]}`}>
      {STATUS_ROTULOS[status]}
    </span>
  );
}
