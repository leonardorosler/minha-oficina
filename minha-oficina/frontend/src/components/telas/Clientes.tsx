/** Lista de clientes com cadastro, edição, exclusão e busca por CPF */

import { useState } from 'react';
import { Header } from '../Header';
import { Search } from '../Search';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { clientes as api } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import type { Cliente } from '../../types/api';

interface ClientesProps {
  aoSelecionarCliente: (id: number) => void;
  aoAvisar: (mensagem: string) => void;
}

type Acao = 'criar' | 'editar' | 'excluir' | 'cpf' | null;

const formularioVazio = {
  nome: '',
  telefone: '',
  email: '',
  cpf: '',
  endereco: '',
  observacoes: '',
};

export function Clientes({ aoSelecionarCliente, aoAvisar }: ClientesProps) {
  const { dados, carregando, erro, recarregar } = useApiData(() => api.listar());
  const [busca, setBusca] = useState('');
  const [acao, setAcao] = useState<Acao>(null);
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);
  const [form, setForm] = useState(formularioVazio);
  const [cpfBusca, setCpfBusca] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const lista = dados ?? [];
  const filtrados = lista.filter(cliente =>
    `${cliente.nome} ${cliente.telefone} ${cliente.cpf ?? ''}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  const abrirCriar = () => {
    setForm(formularioVazio);
    setErroForm('');
    setAcao('criar');
  };

  const abrirEditar = (cliente: Cliente) => {
    setSelecionado(cliente);
    setForm({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email ?? '',
      cpf: cliente.cpf ?? '',
      endereco: cliente.endereco ?? '',
      observacoes: cliente.observacoes ?? '',
    });
    setErroForm('');
    setAcao('editar');
  };

  const salvar = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      if (acao === 'editar' && selecionado) {
        await api.atualizar(selecionado.id, form);
        aoAvisar('Dados do cliente atualizados');
      } else {
        await api.criar(form);
        aoAvisar('Cliente cadastrado com sucesso');
      }
      setAcao(null);
      recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async () => {
    if (!selecionado) return;
    setSalvando(true);
    try {
      await api.excluir(selecionado.id);
      setAcao(null);
      aoAvisar('Cliente excluído');
      recarregar();
    } catch (e) {
      aoAvisar(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const buscarCpf = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      const encontrado = await api.buscarPorCpf(cpfBusca.trim());
      setAcao(null);
      aoSelecionarCliente(encontrado.id);
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header titulo="Clientes" acao="texto" rotuloAcao="+ Novo" aoClicarAcao={abrirCriar} />
      <Search placeholder="Nome, telefone ou CPF" valor={busca} aoAlterar={setBusca} />

      <div className="section-row">
        <h3>Clientes cadastrados</h3>
        <button type="button" className="link-button" onClick={() => { setCpfBusca(''); setAcao('cpf'); }}>
          Buscar CPF
        </button>
      </div>

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="cards">
        {!carregando && !erro && filtrados.length === 0 && <Vazio mensagem="Nenhum cliente encontrado" />}
        {filtrados.map(cliente => (
          <div key={cliente.id} className="card person-row">
            <button type="button" className="click-card person-main" onClick={() => aoSelecionarCliente(cliente.id)}>
              <span className="initials">
                {cliente.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <span>
                <h4>{cliente.nome}</h4>
                <p>{cliente.telefone}<br />{cliente.cpf ?? 'Sem CPF'}</p>
              </span>
            </button>
            <div className="linha-acoes">
              <button type="button" className="icon-button" aria-label="Editar cliente" onClick={() => abrirEditar(cliente)}>
                <Icon nome="edit" />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Excluir cliente"
                onClick={() => { setSelecionado(cliente); setAcao('excluir'); }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {(acao === 'criar' || acao === 'editar') && (
        <Modal
          titulo={acao === 'criar' ? 'Cadastrar cliente' : 'Editar cliente'}
          descricao="Preencha os dados do cliente."
          aoFechar={() => setAcao(null)}
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

      {acao === 'excluir' && (
        <Modal
          titulo="Excluir cliente"
          descricao={`Deseja excluir ${selecionado?.nome}? Esta ação não pode ser desfeita.`}
          aoFechar={() => setAcao(null)}
          aoSalvar={excluir}
          rotuloSalvar={salvando ? 'Excluindo...' : 'Excluir'}
        />
      )}

      {acao === 'cpf' && (
        <Modal
          titulo="Buscar por CPF"
          descricao="Digite o CPF completo do cliente."
          aoFechar={() => setAcao(null)}
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
