/** Tela de acesso à oficina */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mensagemErro } from '../../services/api';
import { BrandLogo } from '../Brand';
import { Icon } from '../Icon';

export function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
      <div className="login-topo">
        <div className="login-decor decor-a" />
        <div className="login-decor decor-b" />
        <BrandLogo tamanho={58} />
        <p>Gestão simples e organizada para oficinas mecânicas.</p>
      </div>

      <form className="login-cartao" onSubmit={enviar}>
        <div className="login-cabecalho">
          <span className="login-icone"><Icon nome="shield" /></span>
          <div>
            <h2>Bem-vindo de volta</h2>
            <p>Entre com sua conta para continuar</p>
          </div>
        </div>

        <div className="form-stack">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <div className="campo-com-icone">
              <Icon nome="userCircle" />
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
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className="campo-com-icone">
              <Icon nome="shield" />
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="campo-acao"
                onClick={() => setMostrarSenha(v => !v)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {erro && <p className="erro-texto">{erro}</p>}

          <button type="submit" className="primary full botao-entrar" disabled={entrando}>
            {entrando ? 'Entrando...' : 'Entrar na oficina'}
            {!entrando && <Icon nome="chevron" />}
          </button>
        </div>
      </form>

      <p className="login-rodape"><Icon nome="shield" /> Acesso restrito à equipe da oficina</p>
    </div>
  );
}
