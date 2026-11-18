/** Estados de carregamento, erro e lista vazia */

interface ErroApiProps {
  mensagem: string;
  aoTentarNovamente?: () => void;
}

export function Carregando() {
  return <div className="empty">Carregando...</div>;
}

export function ErroApi({ mensagem, aoTentarNovamente }: ErroApiProps) {
  return (
    <div className="empty">
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
  return <div className="empty">{mensagem}</div>;
}
