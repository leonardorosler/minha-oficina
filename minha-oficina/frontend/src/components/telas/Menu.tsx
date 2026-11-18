/** Menu com recursos adicionais */

import { Header } from '../Header';
import { Icon, type NomeIcone } from '../Icon';

interface MenuProps {
  aoNavegar: (tela: 'usuarios' | 'buscas' | 'na-oficina') => void;
  aoSair: () => void;
}

interface Opcao {
  titulo: string;
  descricao: string;
  icone: NomeIcone;
  acao: () => void;
}

export function Menu({ aoNavegar, aoSair }: MenuProps) {
  const opcoes: Opcao[] = [
    { titulo: 'Na oficina', descricao: 'Veículos em atendimento', icone: 'car', acao: () => aoNavegar('na-oficina') },
    { titulo: 'Buscas', descricao: 'Encontrar por CPF ou placa', icone: 'search', acao: () => aoNavegar('buscas') },
    { titulo: 'Usuários', descricao: 'Equipe e acessos', icone: 'users', acao: () => aoNavegar('usuarios') },
    { titulo: 'Sair', descricao: 'Encerrar a sessão', icone: 'back', acao: aoSair },
  ];

  return (
    <>
      <Header titulo="Menu" />
      <div className="section-row"><h3>Mais opções</h3></div>
      <div className="cards">
        {opcoes.map(opcao => (
          <button type="button" key={opcao.titulo} className="card click-card menu-opcao" onClick={opcao.acao}>
            <span className="car-icon"><Icon nome={opcao.icone} /></span>
            <span>
              <strong>{opcao.titulo}</strong>
              <small>{opcao.descricao}</small>
            </span>
            <Icon nome="chevron" />
          </button>
        ))}
      </div>
    </>
  );
}
