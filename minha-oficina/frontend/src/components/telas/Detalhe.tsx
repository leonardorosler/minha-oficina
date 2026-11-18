/** Detalhe da OS: andamento, transições, histórico e edição */

import { useState } from 'react';
import { Header } from '../Header';
import { Badge } from '../Badge';
import { Modal } from '../Modal';
import { Carregando, ErroApi } from '../Estados';
import { atendimentos as api, fluxo as fluxoApi, historico as historicoApi } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import {
  STATUS_ROTULOS,
  formatarDataHora,
  formatarMoeda,
  nomeVeiculo,
  type StatusAtendimento,
} from '../../types/api';

interface DetalheProps {
  id: number;
  aoVoltar: () => void;
  aoAvisar: (mensagem: string) => void;
  aoVerCliente: (clienteId: number) => void;
}

const ETAPAS: StatusAtendimento[] = ['AGUARDANDO', 'EM_SERVICO', 'PRONTO', 'FINALIZADO'];

export function Detalhe({ id, aoVoltar, aoAvisar, aoVerCliente }: DetalheProps) {
  const atendimentoReq = useApiData(() => api.buscar(id), [id]);
  const fluxoReq = useApiData(() => fluxoApi.buscar(id), [id]);
  const transicoesReq = useApiData(() => fluxoApi.transicoes(id), [id]);
  const historicoReq = useApiData(() => historicoApi.statusDoAtendimento(id), [id]);
  const [modal, setModal] = useState<'status' | 'editar' | 'mais' | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');
  const [form, setForm] = useState({ diagnostico: '', servicoRealizado: '', orcamento: '', observacoes: '' });

  const atendimento = atendimentoReq.dados;
  const fluxo = fluxoReq.dados;
  const statusAtual = atendimento?.status ?? fluxo?.statusAtual;
  const indice = statusAtual ? ETAPAS.indexOf(statusAtual) : 0;

  const abrirEditar = () => {
    setForm({
      diagnostico: atendimento?.diagnostico ?? '',
      servicoRealizado: atendimento?.servicoRealizado ?? '',
      orcamento: atendimento?.orcamentoValor ? String(atendimento.orcamentoValor) : '',
      observacoes: atendimento?.observacoes ?? '',
    });
    setErroForm('');
    setModal('editar');
  };

  const alterarStatus = async (statusNovo: StatusAtendimento) => {
    setSalvando(true);
    setErroForm('');
    try {
      await fluxoApi.alterarStatus(id, statusNovo);
      setModal(null);
      aoAvisar(`Status atualizado para ${STATUS_ROTULOS[statusNovo]}`);
      atendimentoReq.recarregar();
      fluxoReq.recarregar();
      transicoesReq.recarregar();
      historicoReq.recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const salvarEdicao = async () => {
    setSalvando(true);
    setErroForm('');
    try {
      await api.editar(id, {
        diagnostico: form.diagnostico || null,
        servicoRealizado: form.servicoRealizado || null,
        orcamentoValor: form.orcamento ? Number(form.orcamento) : null,
        observacoes: form.observacoes || null,
      });
      setModal(null);
      aoAvisar('Atendimento atualizado');
      atendimentoReq.recarregar();
    } catch (e) {
      setErroForm(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const cancelar = async () => {
    setSalvando(true);
    try {
      await api.cancelar(id);
      setModal(null);
      aoAvisar('Atendimento cancelado');
      atendimentoReq.recarregar();
      fluxoReq.recarregar();
      transicoesReq.recarregar();
      historicoReq.recarregar();
    } catch (e) {
      aoAvisar(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header titulo="Detalhe da OS" voltar aoVoltar={aoVoltar} acao="icone" aoClicarAcao={() => setModal('mais')} />

      {atendimentoReq.carregando && <Carregando />}
      {atendimentoReq.erro && <ErroApi mensagem={atendimentoReq.erro} aoTentarNovamente={atendimentoReq.recarregar} />}

      {atendimento && (
        <>
          <div className="card detail-top">
            <span className="kicker">OS #{atendimento.id}</span>
            <div><Badge status={atendimento.status} /></div>
            <h3>{nomeVeiculo(atendimento.veiculo)} {atendimento.veiculo?.ano ?? ''}</h3>
            <span className="meta">{atendimento.veiculo?.placa} · {atendimento.veiculo?.cliente?.nome}</span>
            <br />
            {atendimento.veiculo?.cliente && (
              <button type="button" className="link-button" onClick={() => aoVerCliente(atendimento.veiculo!.cliente!.id)}>
                Ver cliente e veículo
              </button>
            )}
          </div>

          <div className="section-row"><h3>Andamento da OS</h3></div>
          <ol className="timeline">
            {ETAPAS.map((etapa, i) => (
              <li key={etapa} className={i <= indice ? 'complete' : ''}>
                <span>{STATUS_ROTULOS[etapa]}</span>
                {i === 0 && <time>{formatarDataHora(atendimento.dataEntrada)}</time>}
              </li>
            ))}
            {atendimento.status === 'CANCELADO' && <li className="complete">Cancelado</li>}
          </ol>

          <div className="card detalhe-info">
            <div className="detalhe-linha"><span>Problema</span><strong>{atendimento.problemaRelatado}</strong></div>
            <div className="detalhe-linha"><span>Serviço previsto</span><strong>{atendimento.servicoPrevisto ?? '—'}</strong></div>
            <div className="detalhe-linha"><span>Diagnóstico</span><strong>{atendimento.diagnostico ?? '—'}</strong></div>
            <div className="detalhe-linha"><span>Serviço realizado</span><strong>{atendimento.servicoRealizado ?? '—'}</strong></div>
            <div className="detalhe-linha"><span>Responsável</span><strong>{atendimento.usuario?.nome ?? '—'}</strong></div>
            <div className="detalhe-linha"><span>Orçamento</span><strong>{formatarMoeda(atendimento.orcamentoValor)}</strong></div>
          </div>

          <div className="section-row"><h3>Histórico de status</h3></div>
          <div className="cards">
            {(historicoReq.dados ?? []).map(item => (
              <div key={item.id} className="card historico-item">
                <strong>{STATUS_ROTULOS[item.statusNovo]}</strong>
                <span className="meta">{formatarDataHora(item.criadoEm)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="primary full"
            style={{ marginTop: 16 }}
            disabled={transicoesReq.dados ? !transicoesReq.dados.podeAlterar : !fluxo?.podeAlterar}
            onClick={() => setModal('status')}
          >
            Atualizar status
          </button>
          <button type="button" className="ghost full" style={{ marginTop: 10 }} onClick={abrirEditar}>
            Editar atendimento
          </button>
        </>
      )}

      {modal === 'status' && (
        <Modal titulo="Atualizar status" descricao="Escolha a próxima etapa do atendimento." aoFechar={() => setModal(null)}>
          <div className="option-list">
            {(transicoesReq.dados?.transicoesPossiveis ?? fluxo?.transicoesPossiveis ?? []).map(opcao => (
              <button type="button" key={opcao} className="option" onClick={() => alterarStatus(opcao)} disabled={salvando}>
                <span className="radio" />{STATUS_ROTULOS[opcao]}
              </button>
            ))}
          </div>
          {erroForm && <p className="erro-texto">{erroForm}</p>}
        </Modal>
      )}

      {modal === 'editar' && (
        <Modal titulo="Editar atendimento" descricao="Atualize as informações do serviço." aoFechar={() => setModal(null)} aoSalvar={salvarEdicao} rotuloSalvar={salvando ? 'Salvando...' : 'Salvar'}>
          <div className="form-stack">
            <div className="field"><label>Diagnóstico</label><textarea value={form.diagnostico} onChange={e => setForm({ ...form, diagnostico: e.target.value })} /></div>
            <div className="field"><label>Serviço realizado</label><textarea value={form.servicoRealizado} onChange={e => setForm({ ...form, servicoRealizado: e.target.value })} /></div>
            <div className="field"><label>Orçamento (R$)</label><input value={form.orcamento} onChange={e => setForm({ ...form, orcamento: e.target.value })} /></div>
            <div className="field"><label>Observações</label><textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} /></div>
            {erroForm && <p className="erro-texto">{erroForm}</p>}
          </div>
        </Modal>
      )}

      {modal === 'mais' && (
        <Modal titulo="Opções da OS" descricao="Escolha uma ação." aoFechar={() => setModal(null)}>
          <div className="option-list">
            <button type="button" className="option" onClick={() => { setModal(null); aoAvisar('Orçamento compartilhado'); }}>Compartilhar orçamento</button>
            <button type="button" className="option" onClick={abrirEditar}>Editar atendimento</button>
            <button type="button" className="option" onClick={cancelar} disabled={salvando}>Cancelar ordem</button>
          </div>
        </Modal>
      )}
    </>
  );
}
