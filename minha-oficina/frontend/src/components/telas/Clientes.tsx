/** Lista de clientes com cadastro e busca por CPF */

import { useState } from 'react';
import { Header } from '../Header';
import { Search } from '../Search';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { clientes as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';

interface ClientesProps {
  aoSelecionarCliente: (id: number) => void;
  aoAvisar: (mensagem: string) => void;
  aoVoltar: () => void;
}

const formularioVazio = {
  nome: '',
  telefone: '',
  email: '',
  cpf: '',
  endereco: '',
  observacoes: '',
};

export function Clientes({ aoSelecionarCliente, aoAvisar, aoVoltar }: ClientesProps) {
  const { dados, carregando, erro, recarregar } = useApiData(() => api.listar());
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState<'criar' | 'cpf' | null>(null);
  const [form, setForm] = useState(formularioVazio);
  const [cpfBusca, setCpfBusca] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const filtrados = (dados ?? []).filter(cliente =>
    `${cliente.nome} ${cliente.telefone} ${cliente.cpf ?? ''}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  const abrirCriar = () => {
    setForm(formularioVazio);
    setErroForm('');
    setModal('criar');
  };

  const salvar = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      await api.criar(form);
      setModal(null);
      aoAvisar('Cliente cadastrado com sucesso');
      recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const buscarCpf = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      const encontrado = await api.buscarPorCpf(cpfBusca.trim());
      setModal(null);
      aoSelecionarCliente(encontrado.id);
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header titulo="Clientes" voltar aoVoltar={aoVoltar} acao="texto" rotuloAcao="+ Novo" aoClicarAcao={abrirCriar} />
      <Search placeholder="Nome, telefone ou CPF" valor={busca} aoAlterar={setBusca} />

      <div className="section-row">
        <h3>Clientes cadastrados</h3>
        <button type="button" className="link-button" onClick={() => { setCpfBusca(''); setModal('cpf'); }}>
          Buscar CPF
        </button>
      </div>

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="cards">
        {!carregando && filtrados.length === 0 && <Vazio mensagem="Nenhum cliente encontrado" />}
        {filtrados.map(cliente => (
          <button
            type="button"
            key={cliente.id}
            className="card click-card person-row"
            onClick={() => aoSelecionarCliente(cliente.id)}
          >
            <span className="person-main">
              <span className="initials">
                {cliente.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <span>
                <h4>{cliente.nome}</h4>
                <p>{cliente.telefone}<br />{cliente.cpf ?? 'Sem CPF'}</p>
              </span>
            </span>
            <Icon nome="chevron" />
          </button>
        ))}
      </div>

      {modal === 'criar' && (
        <Modal
          titulo="Cadastrar cliente"
          descricao="Preencha os dados do cliente."
          aoFechar={() => setModal(null)}
          aoSalvar={salvar}
          rotuloSalvar={salvando ? 'Salvando...' : 'Salvar'}
        >
          <div className="form-stack">
            <div className="field"><label>Nome completo</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="field"><label>Telefone</label><input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} /></div>
            <div className="field"><label>E-mail</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label>CPF</label><input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} /></div>
            <div className="field"><label>Endereço</label><input value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} /></div>
            <div className="field"><label>Observações</label><textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} /></div>
            {erroForm && <p className="erro-texto">{erroForm}</p>}
          </div>
        </Modal>
      )}

      {modal === 'cpf' && (
        <Modal
          titulo="Buscar por CPF"
          descricao="Digite o CPF completo do cliente."
          aoFechar={() => setModal(null)}
          aoSalvar={buscarCpf}
          rotuloSalvar={salvando ? 'Buscando...' : 'Buscar'}
        >
          <div className="field">
            <label>CPF</label>
            <input value={cpfBusca} onChange={e => setCpfBusca(e.target.value)} placeholder="000.000.000-00" />
          </div>
          {erroForm && <p className="erro-texto">{erroForm}</p>}
        </Modal>
      )}
    </>
  );
}
