/** Administração de usuários da oficina */

import { useState } from 'react';
import { Header } from '../Header';
import { Modal } from '../Modal';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { usuarios as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import { formatarData, type Usuario } from '../../types/api';

interface UsuariosProps {
  aoAvisar: (mensagem: string) => void;
}

type Acao = 'criar' | 'editar' | 'desativar' | null;
const vazio = { nome: '', email: '', senha: '' };

export function Usuarios({ aoAvisar }: UsuariosProps) {
  const { dados, carregando, erro, recarregar } = useApiData(() => api.listar());
  const [acao, setAcao] = useState<Acao>(null);
  const [selecionado, setSelecionado] = useState<Usuario | null>(null);
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const abrirCriar = () => { setForm(vazio); setErroForm(''); setAcao('criar'); };
  const abrirEditar = (usuario: Usuario) => {
    setSelecionado(usuario);
    setForm({ nome: usuario.nome, email: usuario.email, senha: '' });
    setErroForm('');
    setAcao('editar');
  };

  const salvar = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      if (acao === 'editar' && selecionado) {
        await api.editar(selecionado.id, {
          nome: form.nome,
          email: form.email,
          ...(form.senha ? { senha: form.senha } : {}),
        });
        aoAvisar('Usuário atualizado');
      } else {
        await api.criar(form);
        aoAvisar('Usuário cadastrado');
      }
      setAcao(null);
      recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const desativar = async () => {
    if (!selecionado) return;
    setSalvando(true);
    try {
      await api.desativar(selecionado.id);
      setAcao(null);
      aoAvisar('Usuário desativado');
      recarregar();
    } catch (e) {
      aoAvisar(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header titulo="Usuários" acao="texto" rotuloAcao="+ Novo" aoClicarAcao={abrirCriar} />

      <div className="section-row"><h3>Equipe da oficina</h3><small>{dados?.length ?? 0} usuários</small></div>

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="cards">
        {!carregando && dados?.length === 0 && <Vazio mensagem="Nenhum usuário encontrado" />}
        {dados?.map(usuario => (
          <div key={usuario.id} className="card person-row">
            <span className="person-main">
              <span className="initials">{usuario.nome.slice(0, 2).toUpperCase()}</span>
              <span>
                <h4>{usuario.nome}</h4>
                <p>{usuario.email}<br />{usuario.ativo ? 'Ativo' : 'Desativado'} · desde {formatarData(usuario.criadoEm)}</p>
              </span>
            </span>
            <div className="linha-acoes">
              <button type="button" className="icon-button" aria-label="Editar" onClick={() => abrirEditar(usuario)}>✎</button>
              {usuario.ativo && (
                <button type="button" className="icon-button" aria-label="Desativar" onClick={() => { setSelecionado(usuario); setAcao('desativar'); }}>⊘</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(acao === 'criar' || acao === 'editar') && (
        <Modal
          titulo={acao === 'criar' ? 'Novo usuário' : 'Editar usuário'}
          descricao="Dados de acesso ao sistema."
          aoFechar={() => setAcao(null)}
          aoSalvar={salvar}
          rotuloSalvar={salvando ? 'Salvando...' : 'Salvar'}
        >
          <div className="form-stack">
            <div className="field"><label>Nome</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="field"><label>E-mail</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label>Senha {acao === 'editar' && '(deixe em branco para manter)'}</label><input type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} /></div>
            {erroForm && <p className="erro-texto">{erroForm}</p>}
          </div>
        </Modal>
      )}

      {acao === 'desativar' && (
        <Modal
          titulo="Desativar usuário"
          descricao={`Deseja desativar ${selecionado?.nome}?`}
          aoFechar={() => setAcao(null)}
          aoSalvar={desativar}
          rotuloSalvar={salvando ? 'Desativando...' : 'Desativar'}
        />
      )}
    </>
  );
}
