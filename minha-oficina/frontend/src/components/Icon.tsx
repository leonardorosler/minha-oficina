/** Biblioteca de ícones SVG consistentes (estilo outline, 24x24) */

import type { JSX } from 'react';

export type NomeIcone =
  | 'home' | 'users' | 'plus' | 'clipboard' | 'history' | 'search'
  | 'chevron' | 'back' | 'car' | 'filter' | 'check' | 'phone'
  | 'more' | 'edit' | 'wrench' | 'gear' | 'gauge' | 'clock'
  | 'checkCircle' | 'trash' | 'userCircle' | 'logout' | 'chart'
  | 'bell' | 'shield' | 'calendar' | 'receipt' | 'spark' | 'arrowUp'
  | 'grid' | 'plusSquare' | 'arrowRight';

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
  wrench: <><path d="M14.5 5.5a5 5 0 0 0 6.6 6.6L21 12l-1 1M14.5 5.5 12 8l1 1 1-1 3.5-3.5M9 11 4 16a4 4 0 0 0 5.7 5.7L15 16.3" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  gauge: <><path d="M4 17a9 9 0 1 1 16 0M12 13l4-4M5 17h14" /><circle cx="12" cy="13" r="1.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" /></>,
  userCircle: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6 19c.8-2.4 3-3.5 6-3.5s5.2 1.1 6 3.5" /></>,
  logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" /></>,
  chart: <><path d="M4 20V4M4 20h16M8 16v-5M13 16V7M18 16v-8" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3V9zM10 20h4" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
  receipt: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3zM8 8h8M8 12h8M8 16h5" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></>,
  arrowUp: <><path d="M12 19V5M6 11l6-6 6 6" /></>,
  grid: <><circle cx="6" cy="6" r="1.6" /><circle cx="12" cy="6" r="1.6" /><circle cx="18" cy="6" r="1.6" /><circle cx="6" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="18" cy="12" r="1.6" /><circle cx="6" cy="18" r="1.6" /><circle cx="12" cy="18" r="1.6" /><circle cx="18" cy="18" r="1.6" /></>,
  plusSquare: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><path d="M12 8v8M8 12h8" /></>,
  arrowRight: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
};

const preenchidos: Partial<Record<NomeIcone, JSX.Element>> = {
  home: <path d="M12 3 2.5 11.3l1.3 1.5L5 11.8V21h5.2v-6.2h3.6V21H19v-9.2l1.2 1 1.3-1.5L12 3z" />,
  users: <><circle cx="9" cy="8" r="4" /><path d="M2.5 21v-2c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5v2H2.5zM17 5.2a3.5 3.5 0 0 1 0 6.6 5.7 5.7 0 0 1 3.5 4.3l.5 4.9h-3.2l-.8-4.9c-.2-1.1-.9-1.9-2-2.3 2.8-.9 4.3-3.1 4.3-5.6 0-1.4-.5-2.6-1.5-3.5" /></>,
  clipboard: <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2zm2 2v2h6V5H9zM8 11h8v2H8zm0 4h8v2H8z" />,
  grid: <><circle cx="6" cy="6" r="2.2" /><circle cx="12" cy="6" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="6" cy="12" r="2.2" /><circle cx="12" cy="12" r="2.2" /><circle cx="18" cy="12" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="12" cy="18" r="2.2" /><circle cx="18" cy="18" r="2.2" /></>,
};

interface IconProps {
  nome: NomeIcone;
  className?: string;
  tamanho?: number;
  preenchido?: boolean;
}

export function Icon({ nome, className = '', tamanho, preenchido = false }: IconProps) {
  const conteudo = preenchido ? (preenchidos[nome] ?? caminhos[nome]) : caminhos[nome];
  return (
    <svg
      className={`icon ${className} ${preenchido ? 'preenchido' : ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...(tamanho ? { width: tamanho, height: tamanho } : {})}
    >
      {conteudo}
    </svg>
  );
}
