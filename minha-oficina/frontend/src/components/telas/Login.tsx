/** Tela de acesso à oficina */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mensagemErro } from '../../services/api';
import { Icon } from '../Icon';

export function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro('');
    setEntrando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setEntrando(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-brand">
        <span className="login-logo"><Icon nome="car" /></span>
        <h1>Minha Oficina</h1>
        <p>Gestão simples e organizada para oficinas mecânicas.</p>
      </div>

      <form className="form-stack" onSubmit={enviar}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p className="erro-texto">{erro}</p>}

        <button type="submit" className="primary full" disabled={entrando}>
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="login-rodape">Acesso restrito à equipe da oficina</p>
    </div>
  );
}
