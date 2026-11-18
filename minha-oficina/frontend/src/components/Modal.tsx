/**
 * Janela modal reutilizável
 * Usada para seleção de opções e formulários
 */

import type { ReactNode } from 'react';

interface ModalProps {
  titulo: string;
  descricao: string;
  children?: ReactNode;
  rotuloSalvar?: string;
  aoSalvar?: () => void;
  aoFechar: () => void;
}

export function Modal({ 
  titulo, 
  descricao, 
  children, 
  rotuloSalvar = 'Salvar', 
  aoSalvar, 
  aoFechar 
}: ModalProps) {
  return (
    <div 
      className="modal-backdrop" 
      onClick={evento => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <h3>{titulo}</h3>
        <p>{descricao}</p>
        {children}
        
        {aoSalvar && (
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={aoFechar}>
              Cancelar
            </button>
            <button type="button" className="primary" onClick={aoSalvar}>
              {rotuloSalvar}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

interface ListaOpcoesProps<T extends string> {
  opcoes: T[];
  atual: T;
  aoSelecionar: (opcao: T) => void;
  renderizarExtra?: (opcao: T) => ReactNode;
}

export function ListaOpcoes<T extends string>({ 
  opcoes, 
  atual, 
  aoSelecionar, 
  renderizarExtra 
}: ListaOpcoesProps<T>) {
  return (
    <div className="option-list">
      {opcoes.map(opcao => (
        <button
          type="button"
          key={opcao}
          className={`option ${opcao === atual ? 'active' : ''}`}
          onClick={() => aoSelecionar(opcao)}
        >
          <span className="radio" />
          <span>{opcao}</span>
          {renderizarExtra?.(opcao)}
        </button>
      ))}
    </div>
  );
}
