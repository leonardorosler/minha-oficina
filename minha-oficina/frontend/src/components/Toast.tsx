/**
 * Componente de mensagem temporária (toast)
 * Mostra confirmações e avisos ao usuário
 */

interface ToastProps {
  mensagem: string;
  visivel: boolean;
}

export function Toast({ mensagem, visivel }: ToastProps) {
  return (
    <div 
      id="toast" 
      className={`toast ${visivel ? 'show' : ''}`} 
      role="status"
      aria-live="polite"
    >
      {mensagem}
    </div>
  );
}
