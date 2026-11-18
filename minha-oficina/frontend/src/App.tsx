/** Aplicativo Minha Oficina - conectado à API */

import { useEffect, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { Modal } from './components/Modal';
import { useAuth } from './context/AuthContext';
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
  const { usuario, carregando, sair } = useAuth();
  const [tela, setTela] = useState<Tela>('painel');
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [veiculoId, setVeiculoId] = useState<number | null>(null);
  const [atendimentoId, setAtendimentoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<StatusAtendimento | null>(null);
  const [perfilAberto, setPerfilAberto] = useState(false);
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
        return <Clientes aoSelecionarCliente={abrirCliente} aoAvisar={avisar} />;
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
            aoVoltar={() => navegar('painel')}
            aoCriado={abrirDetalhe}
            aoAvisar={avisar}
          />
        );
      case 'ordens':
        return <Ordens filtro={filtro} aoFiltrar={setFiltro} aoAbrirDetalhe={abrirDetalhe} />;
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
        return <Historico clienteId={clienteId} aoAbrirDetalhe={abrirDetalhe} aoVoltar={() => navegar('clientes')} />;
      case 'usuarios':
        return <Usuarios aoAvisar={avisar} />;
      case 'buscas':
        return <Buscas aoAbrirCliente={abrirCliente} aoAbrirDetalhe={abrirDetalhe} />;
      case 'na-oficina':
        return <NaOficina aoAbrirDetalhe={abrirDetalhe} />;
      case 'menu':
        return (
          <Menu
            aoNavegar={destino => navegar(destino === 'na-oficina' ? 'na-oficina' : destino === 'buscas' ? 'buscas' : 'usuarios')}
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
          <button
            type="button"
            className="ghost full"
            style={{ marginTop: 12 }}
            onClick={() => { setPerfilAberto(false); sair(); }}
          >
            Sair da conta
          </button>
        </Modal>
      )}

      <Toast mensagem={mensagem} visivel={toastVisivel} />
    </div>
  );
}
