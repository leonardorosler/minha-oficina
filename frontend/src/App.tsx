/** Aplicativo Minha Oficina - conectado à API */

import { useEffect, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { Modal } from './components/Modal';
import { useAuth } from './context/AuthContext';
import { auth } from './services/endpoints';
import { mensagemErro } from './services/api';
import { Login } from './components/telas/Login';
import { Painel } from './components/telas/Painel';
import { Clientes } from './components/telas/Clientes';
import { Veiculos } from './components/telas/Veiculos';
import { NovaOS } from './components/telas/NovaOS';
import { Ordens } from './components/telas/Ordens';
import { Detalhe } from './components/telas/Detalhe';
import { Historico } from './components/telas/Historico';
import { Usuarios } from './components/telas/Usuarios';
import { Buscas } from './components/telas/Buscas';
import { NaOficina } from './components/telas/NaOficina';
import { Menu } from './components/telas/Menu';
import type { StatusAtendimento, Tela } from './types';

export default function App() {
  const { usuario, carregando, sair: contextoSair } = useAuth();
  const [tela, setTela] = useState<Tela>('painel');
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [veiculoId, setVeiculoId] = useState<number | null>(null);
  const [atendimentoId, setAtendimentoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<StatusAtendimento | null>(null);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [toastVisivel, setToastVisivel] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const avisar = (texto: string) => {
    setMensagem(texto);
    setToastVisivel(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastVisivel(false), 2400);
  };

  const navegar = (destino: Tela) => {
    setTela(destino);
    window.location.hash = destino;
    document.getElementById('app')?.scrollTo(0, 0);
  };

  useEffect(() => {
    const aoMudarHash = () => {
      const destino = window.location.hash.slice(1) as Tela;
      if (destino) setTela(destino);
    };
    window.addEventListener('hashchange', aoMudarHash);
    return () => window.removeEventListener('hashchange', aoMudarHash);
  }, []);

  const abrirCliente = (id: number) => {
    setClienteId(id);
    navegar('veiculos');
  };

  const sair = async () => {
    try { await auth.logout(); } catch { /* ignora falha ao encerrar */ }
    contextoSair();
  };

  const alterarSenha = async () => {
    setErroSenha('');
    try {
      await auth.trocarSenha(senhaAtual, senhaNova);
      setSenhaAtual('');
      setSenhaNova('');
      setPerfilAberto(false);
      avisar('Senha alterada com sucesso');
    } catch (e) {
      setErroSenha(mensagemErro(e));
    }
  };

  const abrirNovaOS = (cliente: number | null = null, veiculo: number | null = null) => {
    setClienteId(cliente);
    setVeiculoId(veiculo);
    navegar('nova-os');
  };

  const abrirDetalhe = (id: number) => {
    setAtendimentoId(id);
    navegar('detalhe');
  };

  const abrirHistorico = (cliente: number | null = null) => {
    setClienteId(cliente);
    navegar('historico');
  };

  const filtrar = (status: StatusAtendimento) => {
    setFiltro(status);
    navegar('ordens');
  };

  if (carregando) {
    return <div className="app-shell"><div className="empty">Carregando...</div></div>;
  }

  if (!usuario) {
    return (
      <div className="app-shell">
        <Login />
      </div>
    );
  }

  const renderTela = () => {
    switch (tela) {
      case 'painel':
        return <Painel aoNavegar={navegar} aoAbrirDetalhe={abrirDetalhe} aoFiltrar={filtrar} aoAbrirPerfil={() => setPerfilAberto(true)} />;
      case 'clientes':
        return <Clientes aoSelecionarCliente={abrirCliente} aoAvisar={avisar} aoVoltar={() => navegar('menu')} />;
      case 'veiculos':
        return (
          <Veiculos
            clienteId={clienteId ?? 0}
            aoVoltar={() => navegar('clientes')}
            aoNovaOS={id => abrirNovaOS(clienteId, id)}
            aoAvisar={avisar}
            aoSelecionarCliente={abrirCliente}
            aoVerHistorico={abrirHistorico}
            aoClienteExcluido={() => navegar('clientes')}
          />
        );
      case 'nova-os':
        return (
          <NovaOS
            clienteInicial={clienteId}
            veiculoInicial={veiculoId}
            aoVoltar={() => navegar('menu')}
            aoCriado={abrirDetalhe}
            aoAvisar={avisar}
          />
        );
      case 'ordens':
        return <Ordens filtro={filtro} aoFiltrar={setFiltro} aoAbrirDetalhe={abrirDetalhe} aoVoltar={() => navegar('menu')} />;
      case 'detalhe':
        return (
          <Detalhe
            id={atendimentoId ?? 0}
            aoVoltar={() => navegar('ordens')}
            aoAvisar={avisar}
            aoVerCliente={abrirCliente}
          />
        );
      case 'historico':
        return (
          <Historico
            clienteId={clienteId}
            aoAbrirDetalhe={abrirDetalhe}
            aoVoltar={() => clienteId ? navegar('veiculos') : navegar('menu')}
          />
        );
      case 'usuarios':
        return <Usuarios aoAvisar={avisar} aoVoltar={() => navegar('menu')} />;
      case 'buscas':
        return <Buscas aoAbrirCliente={abrirCliente} aoAbrirDetalhe={abrirDetalhe} aoVoltar={() => navegar('menu')} />;
      case 'na-oficina':
        return <NaOficina aoAbrirDetalhe={abrirDetalhe} aoVoltar={() => navegar('menu')} />;
      case 'menu':
        return (
          <Menu
            aoNavegar={navegar}
            aoSair={sair}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <main id="app" className="app-view" aria-live="polite" key={`${tela}-${clienteId}-${atendimentoId}`}>
        {renderTela()}
      </main>

      <BottomNav telaAtual={tela} aoNavegar={destino => destino === 'nova-os' ? abrirNovaOS() : navegar(destino)} />

      {perfilAberto && (
        <Modal titulo="Perfil" descricao="Usuário conectado ao sistema." aoFechar={() => setPerfilAberto(false)}>
          <div className="card person-row">
            <span className="person-main">
              <span className="initials">{usuario.nome.slice(0, 2).toUpperCase()}</span>
              <span><h4>{usuario.nome}</h4><p>{usuario.email}</p></span>
            </span>
          </div>
          <div className="form-stack" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Senha atual</label>
              <input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
            </div>
            <div className="field">
              <label>Nova senha</label>
              <input type="password" value={senhaNova} onChange={e => setSenhaNova(e.target.value)} />
            </div>
            {erroSenha && <p className="erro-texto">{erroSenha}</p>}
            <button type="button" className="secondary full" onClick={alterarSenha}>
              Alterar senha
            </button>
          </div>
          <button type="button" className="ghost full" style={{ marginTop: 10 }} onClick={sair}>
            Sair da conta
          </button>
        </Modal>
      )}

      <Toast mensagem={mensagem} visivel={toastVisivel} />
    </div>
  );
}
