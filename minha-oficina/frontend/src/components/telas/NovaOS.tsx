/** Abertura de nova ordem de serviço */

import { useMemo, useState } from 'react';
import { Header } from '../Header';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Carregando, ErroApi } from '../Estados';
import { atendimentos as api, veiculos as veiculosApi } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import type { Cliente, Veiculo } from '../../types/api';

interface NovaOSProps {
  clienteInicial: number | null;
  veiculoInicial: number | null;
  aoVoltar: () => void;
  aoCriado: (id: number) => void;
  aoAvisar: (mensagem: string) => void;
}

export function NovaOS({ clienteInicial, veiculoInicial, aoVoltar, aoCriado, aoAvisar }: NovaOSProps) {
  const { dados: todos, carregando, erro, recarregar } = useApiData(() => veiculosApi.listar());
  const [clienteId, setClienteId] = useState<number | null>(clienteInicial);
  const [veiculoId, setVeiculoId] = useState<number | null>(veiculoInicial);
  const [modal, setModal] = useState<'cliente' | 'veiculo' | null>(null);
  const [problema, setProblema] = useState('');
  const [servico, setServico] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const clientes = useMemo(() => {
    const mapa = new Map<number, Cliente>();
    (todos ?? []).forEach(v => { if (v.cliente) mapa.set(v.cliente.id, v.cliente); });
    return [...mapa.values()];
  }, [todos]);

  const veiculosDoCliente = (todos ?? []).filter(v => v.clienteId === clienteId);
  const veiculo = veiculosDoCliente.find(v => v.id === veiculoId);
  const cliente = clientes.find(c => c.id === clienteId);

  const criar = async () => {
    if (!veiculoId || !problema.trim()) {
      aoAvisar('Selecione o veículo e descreva o problema');
      return;
    }
    setSalvando(true);
    setErroForm('');
    try {
      const nova = await api.criar({
        veiculoId,
        problemaRelatado: problema.trim(),
        servicoPrevisto: servico.trim() || undefined,
        orcamentoValor: orcamento ? Number(orcamento.replace(',', '.')) : undefined,
        observacoes: observacoes.trim() || undefined,
      });
      aoAvisar(`OS #${nova.id} aberta com sucesso`);
      aoCriado(nova.id);
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header titulo="Nova OS" voltar aoVoltar={aoVoltar} />

      {carregando && <Carregando />}
      {erro && <ErroApi mensagem={erro} aoTentarNovamente={recarregar} />}

      <div className="form-stack">
        <div className="field">
          <label>Cliente</label>
          <button type="button" className="card click-card choice-card" onClick={() => setModal('cliente')}>
            <span className="choice-icon">{cliente ? cliente.nome.slice(0, 2).toUpperCase() : <Icon nome="users" />}</span>
            <span>
              <strong>{cliente?.nome ?? 'Selecionar cliente'}</strong>
              <small>{cliente?.telefone ?? 'Escolha quem será atendido'}</small>
            </span>
            <Icon nome="chevron" />
          </button>
        </div>

        <div className="field">
          <label>Veículo</label>
          <button
            type="button"
            className={`card click-card choice-card ${cliente ? '' : 'disabled'}`}
            onClick={() => cliente ? setModal('veiculo') : aoAvisar('Selecione um cliente primeiro')}
          >
            <span className="choice-icon"><Icon nome="car" /></span>
            <span>
              <strong>{veiculo ? `${veiculo.marca} ${veiculo.modelo}` : 'Selecionar veículo'}</strong>
              <small>{veiculo ? `${veiculo.placa} · ${veiculo.ano ?? ''}` : 'Disponível após escolher o cliente'}</small>
            </span>
            <Icon nome="chevron" />
          </button>
        </div>

        <div className="field">
          <label htmlFor="problema">Problema relatado</label>
          <textarea id="problema" value={problema} onChange={e => setProblema(e.target.value)} placeholder="O que o cliente relatou?" />
        </div>
        <div className="field">
          <label htmlFor="servico">Serviço previsto</label>
          <input id="servico" value={servico} onChange={e => setServico(e.target.value)} placeholder="Ex.: Troca de óleo" />
        </div>
        <div className="two-cols">
          <div className="field">
            <label htmlFor="orcamento">Orçamento (R$)</label>
            <input id="orcamento" inputMode="decimal" value={orcamento} onChange={e => setOrcamento(e.target.value)} placeholder="0,00" />
          </div>
          <div className="field">
            <label htmlFor="obs">Observações</label>
            <input id="obs" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
          </div>
        </div>

        <div className="info-strip">
          <small>Antes de abrir a OS</small>
          A ordem será criada com status Aguardando.
        </div>

        {erroForm && <p className="erro-texto">{erroForm}</p>}

        <button type="button" className="primary full" onClick={criar} disabled={salvando}>
          {salvando ? 'Abrindo...' : 'Abrir ordem de serviço'}
        </button>
      </div>

      {modal === 'cliente' && (
        <Modal titulo="Selecionar cliente" descricao="Escolha o cliente que será atendido." aoFechar={() => setModal(null)}>
          <div className="option-list">
            {clientes.map(c => (
              <button type="button" key={c.id} className="option client-option" onClick={() => {
                setClienteId(c.id);
                setVeiculoId(null);
                setModal(null);
              }}>
                <span className="initials">{c.nome.slice(0, 2).toUpperCase()}</span>
                <span><strong>{c.nome}</strong><small>{c.telefone}</small></span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'veiculo' && (
        <Modal titulo="Selecionar veículo" descricao={`Veículos de ${cliente?.nome ?? 'cliente'}.`} aoFechar={() => setModal(null)}>
          <div className="option-list">
            {veiculosDoCliente.map((v: Veiculo) => (
              <button type="button" key={v.id} className="option vehicle-option" onClick={() => {
                setVeiculoId(v.id);
                setModal(null);
              }}>
                <span className="car-icon"><Icon nome="car" /></span>
                <span><strong>{v.marca} {v.modelo}</strong><small>{v.placa} · {v.ano ?? ''} · {v.cor ?? ''}</small></span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
