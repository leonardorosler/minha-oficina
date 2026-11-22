/** Detalhe do cliente, veículos e histórico */

import { useState } from 'react';
import { Header } from '../Header';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { clientes as clientesApi, veiculos as veiculosApi } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import { STATUS_ROTULOS, formatarData, type Atendimento, type Cliente, type Veiculo } from '../../types/api';

interface VeiculosProps {
  clienteId: number;
  aoVoltar: () => void;
  aoNovaOS: (veiculoId: number) => void;
  aoAvisar: (mensagem: string) => void;
  aoSelecionarCliente: (id: number) => void;
  aoVerHistorico: (clienteId: number) => void;
  aoClienteExcluido: () => void;
}

type Acao = 'criarVeiculo' | 'editarVeiculo' | 'editarCliente' | 'excluirCliente' | 'placa' | 'atendimentos' | null;

const veiculoVazio = { placa: '', marca: '', modelo: '', ano: '', cor: '', observacoes: '' };

export function Veiculos({
  clienteId,
  aoVoltar,
  aoNovaOS,
  aoAvisar,
  aoSelecionarCliente,
  aoVerHistorico,
  aoClienteExcluido,
}: VeiculosProps) {
  const clienteReq = useApiData(() => clientesApi.buscar(clienteId), [clienteId]);
  const veiculosReq = useApiData(() => clientesApi.veiculos(clienteId), [clienteId]);
  const [acao, setAcao] = useState<Acao>(null);
  const [selecionado, setSelecionado] = useState<Veiculo | null>(null);
  const [formVeiculo, setFormVeiculo] = useState(veiculoVazio);
  const [formCliente, setFormCliente] = useState({ nome: '', telefone: '', email: '', cpf: '', endereco: '' });
  const [placa, setPlaca] = useState('');
  const [atendimentosVeiculo, setAtendimentosVeiculo] = useState<Atendimento[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const cliente: Cliente | null = clienteReq.dados;
  const veiculos = veiculosReq.dados ?? [];

  const abrirNovoVeiculo = () => {
    setFormVeiculo(veiculoVazio);
    setErroForm('');
    setAcao('criarVeiculo');
  };

  const abrirEditarVeiculo = (veiculo: Veiculo) => {
    setSelecionado(veiculo);
    setFormVeiculo({
      placa: veiculo.placa,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano ? String(veiculo.ano) : '',
      cor: veiculo.cor ?? '',
      observacoes: veiculo.observacoes ?? '',
    });
    setErroForm('');
    setAcao('editarVeiculo');
  };

  const abrirEditarCliente = () => {
    if (!cliente) return;
    setFormCliente({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email ?? '',
      cpf: cliente.cpf ?? '',
      endereco: cliente.endereco ?? '',
    });
    setErroForm('');
    setAcao('editarCliente');
  };

  const salvarVeiculo = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      const dados = { ...formVeiculo, ano: formVeiculo.ano ? Number(formVeiculo.ano) : undefined };
      if (acao === 'editarVeiculo' && selecionado) {
        await veiculosApi.atualizar(selecionado.id, dados);
        aoAvisar('Veículo atualizado');
      } else {
        await veiculosApi.criar({ ...dados, clienteId });
        aoAvisar('Veículo cadastrado');
      }
      setAcao(null);
      veiculosReq.recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const salvarCliente = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      await clientesApi.atualizar(clienteId, formCliente);
      setAcao(null);
      aoAvisar('Dados do cliente atualizados');
      clienteReq.recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const excluirCliente = async () => {
    setSalvando(true);
    try {
      await clientesApi.excluir(clienteId);
      setAcao(null);
      aoAvisar('Cliente excluído');
      aoClienteExcluido();
    } catch (e) {
      aoAvisar(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const excluirVeiculo = async () => {
    if (!selecionado) return;
    setSalvando(true);
    try {
      await veiculosApi.excluir(selecionado.id);
      setAcao(null);
      aoAvisar('Veículo excluído');
      veiculosReq.recarregar();
    } catch (e) {
      aoAvisar(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const verAtendimentos = async (veiculo: Veiculo) => {
    try {
      const lista = await veiculosApi.atendimentos(veiculo.id);
      setAtendimentosVeiculo(lista);
      setSelecionado(veiculo);
      setAcao('atendimentos');
    } catch (e) {
      aoAvisar(mensagemErro(e));
    }
  };

  const buscarPlaca = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      const encontrado = await veiculosApi.buscarPorPlaca(placa.trim().toUpperCase());
      setAcao(null);
      if (encontrado.clienteId !== clienteId) aoSelecionarCliente(encontrado.clienteId);
      else aoAvisar(`Veículo encontrado: ${encontrado.marca} ${encontrado.modelo}`);
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header titulo="Cliente e veículos" voltar aoVoltar={aoVoltar} />

      {clienteReq.carregando && <Carregando />}
      {clienteReq.erro && <ErroApi mensagem={clienteReq.erro} aoTentarNovamente={clienteReq.recarregar} />}

      {cliente && (
        <div className="card client-hero">
          <span className="initials">
            {cliente.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
          </span>
          <span>
            <h3>{cliente.nome}</h3>
            <span className="meta">{cliente.telefone}</span>
          </span>
          <div className="client-actions">
            <a className="secondary botao-link" href={`tel:${cliente.telefone}`}>
              <Icon nome="phone" /> Ligar
            </a>
            <button type="button" className="ghost" onClick={abrirEditarCliente}>
              <Icon nome="edit" /> Editar
            </button>
          </div>
          <button type="button" className="link-button hero-historico" onClick={() => aoVerHistorico(clienteId)}>
            Ver histórico
          </button>
        </div>
      )}

      <div className="section-row">
        <h3>Veículos</h3>
        <button type="button" className="primary" onClick={abrirNovoVeiculo}>+ Novo</button>
      </div>
      <button type="button" className="link-button" onClick={() => { setPlaca(''); setAcao('placa'); }}>
        Buscar pela placa
      </button>

      {veiculosReq.carregando && <Carregando />}
      {veiculosReq.erro && <ErroApi mensagem={veiculosReq.erro} aoTentarNovamente={veiculosReq.recarregar} />}

      <div className="cards">
        {!veiculosReq.carregando && veiculos.length === 0 && <Vazio mensagem="Nenhum veículo cadastrado" />}
        {veiculos.map(veiculo => (
          <div key={veiculo.id} className="card vehicle-card">
            <span className="car-icon"><Icon nome="car" /></span>
            <span>
              <h4>{veiculo.marca} {veiculo.modelo}</h4>
              <span className="meta">{veiculo.placa} · {veiculo.ano ?? '—'} · {veiculo.cor ?? '—'}</span>
            </span>
            <div className="vehicle-actions">
              <button type="button" className="ghost" onClick={() => abrirEditarVeiculo(veiculo)}>Editar veículo</button>
              <button type="button" className="primary" onClick={() => aoNovaOS(veiculo.id)}>+ Nova OS</button>
            </div>
            <button type="button" className="link-button veiculo-historico" onClick={() => verAtendimentos(veiculo)}>
              Ver atendimentos deste veículo
            </button>
          </div>
        ))}
      </div>

      {(acao === 'criarVeiculo' || acao === 'editarVeiculo') && (
        <Modal
          titulo={acao === 'criarVeiculo' ? 'Cadastrar veículo' : 'Editar veículo'}
          descricao="Informe os dados do veículo."
          aoFechar={() => setAcao(null)}
          aoSalvar={salvarVeiculo}
          rotuloSalvar={salvando ? 'Aguarde...' : 'Salvar'}
        >
          <div className="form-stack">
            <div className="field"><label>Placa</label><input value={formVeiculo.placa} onChange={e => setFormVeiculo({ ...formVeiculo, placa: e.target.value })} /></div>
            <div className="field"><label>Marca</label><input value={formVeiculo.marca} onChange={e => setFormVeiculo({ ...formVeiculo, marca: e.target.value })} /></div>
            <div className="field"><label>Modelo</label><input value={formVeiculo.modelo} onChange={e => setFormVeiculo({ ...formVeiculo, modelo: e.target.value })} /></div>
            <div className="two-cols">
              <div className="field"><label>Ano</label><input value={formVeiculo.ano} onChange={e => setFormVeiculo({ ...formVeiculo, ano: e.target.value })} /></div>
              <div className="field"><label>Cor</label><input value={formVeiculo.cor} onChange={e => setFormVeiculo({ ...formVeiculo, cor: e.target.value })} /></div>
            </div>
            <div className="field"><label>Observações</label><textarea value={formVeiculo.observacoes} onChange={e => setFormVeiculo({ ...formVeiculo, observacoes: e.target.value })} /></div>
            {erroForm && <p className="erro-texto">{erroForm}</p>}
          </div>
          {acao === 'editarVeiculo' && (
            <button type="button" className="link-buttonperigo" onClick={excluirVeiculo}>Excluir este veículo</button>
          )}
        </Modal>
      )}

      {acao === 'editarCliente' && (
        <Modal
          titulo="Editar cliente"
          descricao="Atualize os dados do cliente."
          aoFechar={() => setAcao(null)}
          aoSalvar={salvarCliente}
          rotuloSalvar={salvando ? 'Salvando...' : 'Salvar'}
        >
          <div className="form-stack">
            <div className="field"><label>Nome</label><input value={formCliente.nome} onChange={e => setFormCliente({ ...formCliente, nome: e.target.value })} /></div>
            <div className="field"><label>Telefone</label><input value={formCliente.telefone} onChange={e => setFormCliente({ ...formCliente, telefone: e.target.value })} /></div>
            <div className="field"><label>E-mail</label><input type="email" value={formCliente.email} onChange={e => setFormCliente({ ...formCliente, email: e.target.value })} /></div>
            <div className="field"><label>CPF</label><input value={formCliente.cpf} onChange={e => setFormCliente({ ...formCliente, cpf: e.target.value })} /></div>
            <div className="field"><label>Endereço</label><input value={formCliente.endereco} onChange={e => setFormCliente({ ...formCliente, endereco: e.target.value })} /></div>
            {erroForm && <p className="erro-texto">{erroForm}</p>}
          </div>
          <button type="button" className="link-buttonperigo" onClick={() => setAcao('excluirCliente')}>Excluir este cliente</button>
        </Modal>
      )}

      {acao === 'excluirCliente' && (
        <Modal
          titulo="Excluir cliente"
          descricao={`Deseja excluir ${cliente?.nome}? Esta ação não pode ser desfeita.`}
          aoFechar={() => setAcao(null)}
          aoSalvar={excluirCliente}
          rotuloSalvar={salvando ? 'Excluindo...' : 'Excluir'}
        />
      )}

      {acao === 'atendimentos' && (
        <Modal
          titulo="Atendimentos do veículo"
          descricao={`${selecionado?.marca ?? ''} ${selecionado?.modelo ?? ''} · ${selecionado?.placa ?? ''}`}
          aoFechar={() => setAcao(null)}
        >
          <div className="option-list">
            {atendimentosVeiculo.length === 0 && <Vazio mensagem="Nenhum atendimento registrado" />}
            {atendimentosVeiculo.map(item => (
              <div key={item.id} className="card atendimento-minimo">
                <div>
                  <strong>OS #{item.id}</strong>
                  <small>{item.problemaRelatado}</small>
                </div>
                <span className="badge pending">{STATUS_ROTULOS[item.status]}</span>
                <small>{formatarData(item.dataEntrada)}</small>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {acao === 'placa' && (
        <Modal
          titulo="Buscar pela placa"
          descricao="Digite a placa do veículo."
          aoFechar={() => setAcao(null)}
          aoSalvar={buscarPlaca}
          rotuloSalvar={salvando ? 'Buscando...' : 'Buscar'}
        >
          <div className="field"><label>Placa</label><input value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC1D23" /></div>
          {erroForm && <p className="erro-texto">{erroForm}</p>}
        </Modal>
      )}
    </>
  );
}
