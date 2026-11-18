/** Navegação inferior fixa do aplicativo */

import { Icon, type NomeIcone } from './Icon';
import type { Tela } from '../types';

interface NavItem {
  tela: Tela;
  icone: NomeIcone;
  rotulo: string;
}

const itens: NavItem[] = [
  { tela: 'painel', icone: 'home', rotulo: 'Painel' },
  { tela: 'clientes', icone: 'users', rotulo: 'Clientes' },
  { tela: 'nova-os', icone: 'plus', rotulo: 'Nova OS' },
  { tela: 'ordens', icone: 'clipboard', rotulo: 'Ordens' },
  { tela: 'historico', icone: 'history', rotulo: 'Histórico' },
  { tela: 'menu', icone: 'more', rotulo: 'Menu' },
];

interface BottomNavProps {
  telaAtual: Tela;
  aoNavegar: (tela: Tela) => void;
}

export function BottomNav({ telaAtual, aoNavegar }: BottomNavProps) {
  const ativa = telaAtual === 'detalhe' ? 'ordens'
    : telaAtual === 'veiculos' ? 'clientes'
    : telaAtual;

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {itens.map(({ tela, icone, rotulo }) => (
        <button
          key={tela}
          type="button"
          className={`nav-item ${ativa === tela ? 'active' : ''} ${tela === 'nova-os' ? 'center' : ''}`}
          onClick={() => aoNavegar(tela)}
        >
          <span className="nav-icon"><Icon nome={icone} /></span>
          <span>{rotulo}</span>
        </button>
      ))}
    </nav>
  );
}
