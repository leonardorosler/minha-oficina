/** Detalhe do cliente, veículos e histórico */

import { useState } from 'react';
import { Header } from '../Header';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Carregando, ErroApi, Vazio } from '../Estados';
import { clientes as clientesApi, veiculos as veiculosApi } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import type { Cliente, Veiculo } from '../../types/api';

interface VeiculosProps {
  clienteId: number;
  aoVoltar: () => void;
  aoNovaOS: (veiculoId: number) => void;
  aoAvisar: (mensagem: string) => void;
  aoSelecionarCliente: (id: number) => void;
  aoVerHistorico: (clienteId: number) => void;
}

type Acao = 'criar' | 'editar' | 'excluir' | 'placa' | null;

const formularioVazio = { placa: '', marca: '', modelo: '', ano: '', cor: '', observacoes: '' };

export function Veiculos({
  clienteId,
  aoVoltar,
  aoNovaOS,
  aoAvisar,
  aoSelecionarCliente,
  aoVerHistorico,
}: VeiculosProps) {
  const clienteReq = useApiData(() => clientesApi.buscar(clienteId), [clienteId]);
  const veiculosReq = useApiData(() => clientesApi.veiculos(clienteId), [clienteId]);
  const [acao, setAcao] = useState<Acao>(null);
  const [selecionado, setSelecionado] = useState<Veiculo | null>(null);
  const [form, setForm] = useState(formularioVazio);
  const [placa, setPlaca] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const cliente: Cliente | null = clienteReq.dados;
  const veiculos = veiculosReq.dados ?? [];

  const abrirCriar = () => {
    setForm(formularioVazio);
    setErroForm('');
    setAcao('criar');
  };

  const abrirEditar = (veiculo: Veiculo) => {
    setSelecionado(veiculo);
    setForm({
      placa: veiculo.placa,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano ? String(veiculo.ano) : '',
      cor: veiculo.cor ?? '',
      observacoes: veiculo.observacoes ?? '',
    });
    setErroForm('');
    setAcao('editar');
  };

  const salvar = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      const dados = {
        ...form,
        ano: form.ano ? Number(form.ano) : undefined,
      };
      if (acao === 'editar' && selecionado) {
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

  const excluir = async () => {
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
            <button type="button" className="ghost" onClick={() => aoVerHistorico(clienteId)}>
              <Icon nome="history" /> Histórico
            </button>
          </div>
        </div>
      )}

      <div className="section-row">
        <h3>Veículos</h3>
        <button type="button" className="primary" onClick={abrirCriar}>+ Novo</button>
      </div>

      <div className="section-row">
        <button type="button" className="link-button" onClick={() => { setPlaca(''); setAcao('placa'); }}>
          Buscar pela placa
        </button>
      </div>

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
              <button type="button" className="ghost" onClick={() => abrirEditar(veiculo)}>Editar</button>
              <button type="button" className="primary" onClick={() => aoNovaOS(veiculo.id)}>+ Nova OS</button>
              <button
                type="button"
                className="ghost"
                onClick={() => { setSelecionado(veiculo); setAcao('excluir'); }}
              >
                Excluir veículo
              </button>
              <button type="button" className="ghost" onClick={() => aoVerHistorico(clienteId)}>
                Ver atendimentos
              </button>
            </div>
          </div>
        ))}
      </div>

      {(acao === 'criar' || acao === 'editar') && (
        <Modal
          titulo={acao === 'criar' ? 'Cadastrar veículo' : 'Editar veículo'}
          descricao="Informe os dados do veículo."
          aoFechar={() => setAcao(null)}
          aoSalvar={salvar}
          rotuloSalvar={salvando ? 'Salvando...' : 'Salvar'}
        >
          <div className="form-stack">
            <div className="field"><label>Placa</label><input value={form.placa} onChange={e => setForm({ ...form, placa: e.target.value })} /></div>
            <div className="field"><label>Marca</label><input value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} /></div>
            <div className="field"><label>Modelo</label><input value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} /></div>
            <div className="two-cols">
              <div className="field"><label>Ano</label><input value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} /></div>
              <div className="field"><label>Cor</label><input value={form.cor} onChange={e => setForm({ ...form, cor: e.target.value })} /></div>
            </div>
            <div className="field"><label>Observações</label><textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} /></div>
            {erroForm && <p className="erro-texto">{erroForm}</p>}
          </div>
        </Modal>
      )}

      {acao === 'excluir' && (
        <Modal
          titulo="Excluir veículo"
          descricao={`Deseja excluir ${selecionado?.placa}?`}
          aoFechar={() => setAcao(null)}
          aoSalvar={excluir}
          rotuloSalvar={salvando ? 'Excluindo...' : 'Excluir'}
        />
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
