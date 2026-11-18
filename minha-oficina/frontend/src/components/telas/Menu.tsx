/** Menu com recursos adicionais */

import { Header } from '../Header';
import { Icon, type NomeIcone } from '../Icon';

interface MenuProps {
  aoNavegar: (tela: 'historico' | 'usuarios' | 'buscas' | 'na-oficina') => void;
  aoSair: () => void;
}

interface Opcao {
  titulo: string;
  descricao: string;
  icone: NomeIcone;
  cor: string;
  acao: () => void;
}

export function Menu({ aoNavegar, aoSair }: MenuProps) {
  const opcoes: Opcao[] = [
    { titulo: 'Histórico', descricao: 'Serviços finalizados', icone: 'history', cor: 'teal', acao: () => aoNavegar('historico') },
    { titulo: 'Na oficina', descricao: 'Veículos em atendimento', icone: 'car', cor: 'blue', acao: () => aoNavegar('na-oficina') },
    { titulo: 'Buscas', descricao: 'Encontrar por CPF ou placa', icone: 'search', cor: 'teal', acao: () => aoNavegar('buscas') },
    { titulo: 'Usuários', descricao: 'Equipe e acessos', icone: 'users', cor: 'amber', acao: () => aoNavegar('usuarios') },
    { titulo: 'Sair', descricao: 'Encerrar a sessão', icone: 'logout', cor: 'red', acao: aoSair },
  ];

  return (
    <>
      <Header titulo="Menu" />
      <div className="menu-banner">
        <span className="menu-banner-icone"><Icon nome="spark" /></span>
        <div>
          <strong>Tudo em um só lugar</strong>
          <span>Acesse os recursos da sua oficina</span>
        </div>
      </div>

      <div className="section-row"><h3>Mais opções</h3></div>
      <div className="cards">
        {opcoes.map(opcao => (
          <button type="button" key={opcao.titulo} className="card click-card menu-opcao" onClick={opcao.acao}>
            <span className={`tile-icone ${opcao.cor}`}><Icon nome={opcao.icone} /></span>
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
