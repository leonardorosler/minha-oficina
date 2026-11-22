/** Estados de carregamento, erro e lista vazia */

import { Icon } from './Icon';

interface ErroApiProps {
  mensagem: string;
  aoTentarNovamente?: () => void;
}

export function Carregando() {
  return (
    <div className="cards skeleton-lista" aria-label="Carregando">
      {[0, 1, 2].map(i => (
        <div key={i} className="card skeleton-card">
          <span className="skeleton-circulo" />
          <span className="skeleton-linhas">
            <span className="skeleton-linha longa" />
            <span className="skeleton-linha curta" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ErroApi({ mensagem, aoTentarNovamente }: ErroApiProps) {
  return (
    <div className="estado-vazio erro">
      <span className="estado-icone erro"><Icon nome="shield" /></span>
      <strong>Não foi possível carregar</strong>
      <span>{mensagem}</span>
      {aoTentarNovamente && (
        <button type="button" className="secondary" style={{ marginTop: 12 }} onClick={aoTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function Vazio({ mensagem }: { mensagem: string }) {
  return (
    <div className="estado-vazio">
      <span className="estado-icone"><Icon nome="clipboard" /></span>
      <strong>Nada por aqui</strong>
      <span>{mensagem}</span>
    </div>
  );
}
