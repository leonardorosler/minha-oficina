/**
 * Cabeçalho padrão das telas
 * Oferece botão de voltar, título e ação opcional
 */

import { Icon, type NomeIcone } from './Icon';
import { BrandMark } from './Brand';

interface HeaderProps {
  titulo: string;
  voltar?: boolean;
  aoVoltar?: () => void;
  acao?: 'avatar' | 'texto' | 'icone';
  rotuloAcao?: string;
  iconeAcao?: NomeIcone;
  aoClicarAcao?: () => void;
}

export function Header({ 
  titulo, 
  voltar = false, 
  aoVoltar, 
  acao, 
  rotuloAcao = '', 
  iconeAcao = 'more',
  aoClicarAcao 
}: HeaderProps) {
  return (
    <header className="screen-header">
      {voltar && (
        <button 
          type="button" 
          className="icon-button" 
          onClick={aoVoltar} 
          aria-label="Voltar"
        >
          <Icon nome="back" />
        </button>
      )}
      
      <div className="title-wrap">
        <span className="kicker"><BrandMark tamanho={15} className="kicker-mark" /> MINHA OFICINA</span>
        <h2>{titulo}</h2>
      </div>

      {acao && aoClicarAcao && (
        <button
          type="button"
          className={acao === 'avatar' ? 'avatar' : acao === 'texto' ? 'primary' : 'icon-button'}
          onClick={aoClicarAcao}
          aria-label={acao === 'avatar' ? 'Abrir perfil' : rotuloAcao || 'Mais opções'}
        >
          {acao === 'avatar' ? (
            <span className="avatar-conteudo">
              CC<small>Perfil</small>
            </span>
          ) : acao === 'texto' ? rotuloAcao : <Icon nome={iconeAcao} />}
        </button>
      )}
    </header>
  );
}
