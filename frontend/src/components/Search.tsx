/**
 * Campo de busca reutilizável
 * Usado em várias telas para filtrar clientes e ordens
 */

import { Icon } from './Icon';

interface SearchProps {
  placeholder: string;
  valor?: string;
  aoAlterar?: (valor: string) => void;
}

export function Search({ placeholder, valor = '', aoAlterar }: SearchProps) {
  return (
    <label className="search">
      <Icon nome="search" />
      <input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={valor}
        onChange={evento => aoAlterar?.(evento.target.value)}
      />
    </label>
  );
}
