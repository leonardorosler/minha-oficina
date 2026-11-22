/** Buscas rápidas por CPF e placa */

import { useState } from 'react';
import { Header } from '../Header';
import { Icon } from '../Icon';
import { Carregando, Vazio } from '../Estados';
import { clientes as clientesApi, veiculos as veiculosApi, historico as historicoApi } from '../../services/endpoints';
import { useApiData } from '../../hooks/useApiData';
import { mensagemErro } from '../../services/api';
import {
  formatarData,
  nomeVeiculo,
  type Atendimento,
  type Cliente,
  type Veiculo,
} from '../../types/api';

interface BuscasProps {
  aoAbrirCliente: (id: number) => void;
  aoAbrirDetalhe: (id: number) => void;
  aoVoltar: () => void;
}

export function Buscas({ aoAbrirCliente, aoAbrirDetalhe, aoVoltar }: BuscasProps) {
  const [aba, setAba] = useState<'cpf' | 'placa'>('cpf');
  const [termo, setTermo] = useState('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);

  const atendimentosCliente = useApiData<Atendimento[]>(
    () => cliente ? clientesApi.atendimentos(cliente.id) : Promise.resolve([]),
    [cliente?.id],
  );
  const atendimentosVeiculo = useApiData<Atendimento[]>(
    () => veiculo ? historicoApi.doVeiculo(veiculo.id) : Promise.resolve([]),
    [veiculo?.id],
  );

  const buscar = async () => {
    setErro('');
    setCliente(null);
    setVeiculo(null);
    setBuscando(true);
    try {
      if (aba === 'cpf') {
        const encontrado = await clientesApi.buscarPorCpf(termo.trim());
        const completo = await clientesApi.buscar(encontrado.id);
        setCliente(completo);
      } else {
        const encontrado = await veiculosApi.buscarPorPlaca(termo.trim().toUpperCase());
        const completo = await veiculosApi.buscar(encontrado.id);
        setVeiculo(completo);
      }
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setBuscando(false);
    }
  };

  return (
    <>
      <Header titulo="Buscas" voltar aoVoltar={aoVoltar} />

      <div className="tabs">
        <button type="button" className={`tab ${aba === 'cpf' ? 'active' : ''}`} onClick={() => { setAba('cpf'); setTermo(''); }}>Por CPF</button>
        <button type="button" className={`tab ${aba === 'placa' ? 'active' : ''}`} onClick={() => { setAba('placa'); setTermo(''); }}>Por placa</button>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label>{aba === 'cpf' ? 'CPF do cliente' : 'Placa do veículo'}</label>
        <input value={termo} onChange={e => setTermo(e.target.value)} placeholder={aba === 'cpf' ? '000.000.000-00' : 'ABC1D23'} />
      </div>
      <button type="button" className="primary full" style={{ marginTop: 12 }} onClick={buscar} disabled={buscando || !termo.trim()}>
        {buscando ? 'Buscando...' : 'Buscar'}
      </button>
      {erro && <p className="erro-texto">{erro}</p>}

      {cliente && (
        <>
          <div className="section-row"><h3>Cliente encontrado</h3></div>
          <div className="card person-row">
            <span className="person-main">
              <span className="initials">{cliente.nome.slice(0, 2).toUpperCase()}</span>
              <span><h4>{cliente.nome}</h4><p>{cliente.telefone}<br />{cliente.cpf}</p></span>
            </span>
            <button type="button" className="icon-button" aria-label="Abrir cliente" onClick={() => aoAbrirCliente(cliente.id)}><Icon nome="arrowRight" /></button>
          </div>

          <div className="section-row"><h3>Atendimentos do cliente</h3></div>
          {atendimentosCliente.carregando && <Carregando />}
          <div className="cards">
            {atendimentosCliente.dados?.length === 0 && <Vazio mensagem="Nenhum atendimento" />}
            {atendimentosCliente.dados?.map(item => (
              <button type="button" key={item.id} className="card click-card order-row" onClick={() => aoAbrirDetalhe(item.id)}>
                <span><h4>OS #{item.id}</h4><p>{item.problemaRelatado}<br />{formatarData(item.dataEntrada)}</p></span>
                <Icon nome="arrowRight" />
              </button>
            ))}
          </div>
        </>
      )}

      {veiculo && (
        <>
          <div className="section-row"><h3>Veículo encontrado</h3></div>
          <div className="card vehicle-card">
            <span className="car-icon"><Icon nome="car" /></span>
            <span><h4>{nomeVeiculo(veiculo)}</h4><span className="meta">{veiculo.placa} · {veiculo.ano} · {veiculo.cor}<br />{veiculo.cliente?.nome}</span></span>
            <div className="vehicle-actions">
              <button type="button" className="primary" onClick={() => aoAbrirCliente(veiculo.clienteId)}>Ver cliente</button>
            </div>
          </div>

          <div className="section-row"><h3>Histórico do veículo</h3></div>
          {atendimentosVeiculo.carregando && <Carregando />}
          <div className="cards">
            {atendimentosVeiculo.dados?.length === 0 && <Vazio mensagem="Nenhum atendimento" />}
            {atendimentosVeiculo.dados?.map(item => (
              <button type="button" key={item.id} className="card click-card order-row" onClick={() => aoAbrirDetalhe(item.id)}>
                <span><h4>OS #{item.id}</h4><p>{item.problemaRelatado}<br />{formatarData(item.dataEntrada)}</p></span>
                <Icon nome="arrowRight" />
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
