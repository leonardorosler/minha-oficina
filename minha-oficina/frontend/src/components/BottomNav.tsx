/** Navegação inferior estilo Instagram: ícones, item ativo em destaque e criar no centro */

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
  { tela: 'nova-os', icone: 'plusSquare', rotulo: 'Nova OS' },
  { tela: 'ordens', icone: 'clipboard', rotulo: 'Ordens' },
  { tela: 'menu', icone: 'grid', rotulo: 'Menu' },
];

interface BottomNavProps {
  telaAtual: Tela;
  aoNavegar: (tela: Tela) => void;
}

export function BottomNav({ telaAtual, aoNavegar }: BottomNavProps) {
  const ativa = telaAtual === 'detalhe' ? 'ordens'
    : telaAtual === 'veiculos' ? 'clientes'
    : ['historico', 'usuarios', 'buscas', 'na-oficina'].includes(telaAtual) ? 'menu'
    : telaAtual;

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {itens.map(({ tela, icone, rotulo }) => {
        const centro = tela === 'nova-os';
        const ativo = ativa === tela;
        return (
          <button
            key={tela}
            type="button"
            className={`nav-item ${ativo ? 'active' : ''} ${centro ? 'center' : ''}`}
            onClick={() => aoNavegar(tela)}
            aria-label={rotulo}
            aria-current={ativo ? 'page' : undefined}
            title={rotulo}
          >
            <Icon nome={icone} preenchido={ativo && !centro} />
            <span className="nav-label">{rotulo}</span>
            <span className="nav-ponto" />
          </button>
        );
      })}
    </nav>
  );
}
