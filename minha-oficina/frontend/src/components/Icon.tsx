/**
 * Componente de ícones SVG reutilizáveis
 * Todos os ícones usados no aplicativo ficam centralizados aqui
 */

import type { JSX } from 'react';

export type NomeIcone =
  | 'home'
  | 'users'
  | 'plus'
  | 'clipboard'
  | 'history'
  | 'search'
  | 'chevron'
  | 'back'
  | 'car'
  | 'filter'
  | 'check'
  | 'phone'
  | 'more'
  | 'edit';

const caminhos: Record<NomeIcone, JSX.Element> = {
  home: <><path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9.5 20v-6h5v6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20v-2.3c0-3 2.4-5.2 6-5.2s6 2.2 6 5.2V20M16 5.5c2.2.2 3.5 1.5 3.5 3.5S18 12.3 16 12.5M17 14c2.6.5 4 2.2 4 4.5V20" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  clipboard: <><path d="M8 5H5v16h14V5h-3M9 3h6v4H9zM8 11h8M8 15h8" /></>,
  history: <><path d="M4 4v6h6M5.5 9A8 8 0 1 1 4 14M12 8v5l3 2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  chevron: <><path d="m9 5 7 7-7 7" /></>,
  back: <><path d="m15 5-7 7 7 7" /></>,
  car: <><path d="m5 15 1.5-5h11L19 15M3 15h18v4H3zM6 19v2M18 19v2M7 15h.01M17 15h.01" /></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  phone: <><path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-5-1-1.2 3a16 16 0 0 1-9.8-9.8L8 8z" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  edit: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10zM13.5 7 17 10.5" /></>,
};

interface IconProps {
  nome: NomeIcone;
  className?: string;
}

export function Icon({ nome, className = '' }: IconProps) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {caminhos[nome]}
    </svg>
  );
}
