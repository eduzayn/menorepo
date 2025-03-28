import React, { useState } from 'react';
import { Search, Filter, Download, Link, Check, X, MoreHorizontal, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useCobrancas, FiltroCobranca } from '../../hooks/useCobrancas';
import type { StatusCobranca, MetodoPagamento } from '../../types/financeiro';

// Componente para exibir o status da cobrança
const StatusBadge: React.FC<{ status: StatusCobranca }> = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'vencido':
        return 'Vencido';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
      {getStatusLabel()}
    </span>
  );
};

// Componente de filtro por status
const StatusFilter: React.FC<{
  status?: string;
  onChange: (status?: string) => void;
}> = ({ status, onChange }) => {
  const statuses = [
    { value: undefined, label: 'Todos' },
    { value: 'pendente', label: 'Pendentes' },
    { value: 'pago', label: 'Pagos' },
    { value: 'vencido', label: 'Vencidos' },
    { value: 'cancelado', label: 'Cancelados' },
  ];

  return (
    <div className="flex space-x-2">
      {statuses.map((s) => (
        <button
          key={s.label}
          className={`px-3 py-1 text-sm rounded-full ${
            (s.value === status) 
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onChange(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

export const ReceberPage: React.FC = () => {
  const { user } = useAuth();
  const [termoBusca, setTermoBusca] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState<{ inicio?: string; fim?: string }>({});
  
  // Inicializa os filtros com base no usuário
  const filtrosIniciais: FiltroCobranca = {
    instituicao_id: user?.instituicao_id || 'default',
    status: undefined,
  };
  
  const { 
    cobrancas, 
    isLoading, 
    filtros, 
    atualizarFiltros, 
    registrarPagamento,
    isRegisteringPayment,
    cancelarCobranca,
    isCanceling,
    gerarLinkPagamento
  } = useCobrancas(filtrosIniciais);

  // Atualiza o filtro de status
  const handleStatusChange = (status?: string) => {
    atualizarFiltros({ ...filtros, status: status as StatusCobranca | undefined });
  };

  // Atualiza o filtro de termo de busca
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(e.target.value);
  };

  // Aplica o filtro de busca
  const handleBuscaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarFiltros({ ...filtros, termo_busca: termoBusca });
  };

  // Atualiza o filtro de período
  const handlePeriodoChange = (inicio?: string, fim?: string) => {
    setPeriodoSelecionado({ inicio, fim });
    atualizarFiltros({
      ...filtros,
      data_inicio: inicio,
      data_fim: fim,
    });
  };

  // Registra um pagamento
  const handleRegistrarPagamento = async (id: string) => {
    const valor = cobrancas.find(c => c.id === id)?.valor || 0;
    const hoje = format(new Date(), 'yyyy-MM-dd');
    
    const resultado = await registrarPagamento({
      id,
      valor,
      metodo: 'pix',
      data: hoje
    });
    
    if (resultado.success) {
      // Feedback de sucesso (poderia ser um toast)
      console.log('Pagamento registrado com sucesso!');
    } else {
      // Feedback de erro
      console.error(resultado.mensagem);
    }
  };

  // Cancela uma cobrança
  const handleCancelarCobranca = async (id: string) => {
    const motivo = "Cancelado pelo usuário";
    
    const resultado = await cancelarCobranca({
      id,
      motivo
    });
    
    if (resultado.success) {
      // Feedback de sucesso
      console.log('Cobrança cancelada com sucesso!');
    } else {
      // Feedback de erro
      console.error(resultado.mensagem);
    }
  };

  // Gera um link de pagamento
  const handleGerarLink = async (id: string) => {
    const resultado = await gerarLinkPagamento({
      id,
      gateway: 'littex'
    });
    
    if (resultado.success && resultado.link_pagamento) {
      // Copia para o clipboard
      navigator.clipboard.writeText(resultado.link_pagamento);
      // Feedback de sucesso
      console.log('Link copiado para a área de transferência!');
    } else {
      // Feedback de erro
      console.error(resultado.mensagem);
    }
  };

  // Calcula totais
  const totais = {
    total: cobrancas.reduce((acc, c) => acc + c.valor, 0),
    pendente: cobrancas.filter(c => c.status === 'pendente').reduce((acc, c) => acc + c.valor, 0),
    pago: cobrancas.filter(c => c.status === 'pago').reduce((acc, c) => acc + c.valor, 0),
    vencido: cobrancas.filter(c => c.status === 'vencido').reduce((acc, c) => acc + c.valor, 0),
  };

  // Formata valores monetários
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Formata datas
  const formatarData = (data: string) => {
    if (!data) return '-';
    return format(new Date(data), 'dd/MM/yyyy');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-3">Contas a Receber</h1>
        <p className="text-gray-600">Gerencie todas as cobranças, mensalidades e taxas a receber.</p>
      </div>

      {/* Resumo de valores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-xl font-semibold">{formatarValor(totais.total)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Pendente</p>
          <p className="text-xl font-semibold text-yellow-600">{formatarValor(totais.pendente)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Recebido</p>
          <p className="text-xl font-semibold text-green-600">{formatarValor(totais.pago)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Vencido</p>
          <p className="text-xl font-semibold text-red-600">{formatarValor(totais.vencido)}</p>
        </div>
      </div>

      {/* Barra de filtros e busca */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <form onSubmit={handleBuscaSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por aluno ou tipo..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full md:w-80"
                value={termoBusca}
                onChange={handleBuscaChange}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </form>

          <div className="flex items-center space-x-2">
            <button
              className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50"
              onClick={() => {
                // Abre um diálogo de filtro avançado (não implementado)
                console.log('Abrir filtro avançado');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
            <button
              className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50"
              onClick={() => {
                // Exporta dados para Excel/CSV (não implementado)
                console.log('Exportar dados');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <StatusFilter status={filtros.status} onChange={handleStatusChange} />

          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                !periodoSelecionado.inicio && !periodoSelecionado.fim
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => handlePeriodoChange(undefined, undefined)}
            >
              Todos
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                periodoSelecionado.inicio === format(new Date(), 'yyyy-MM-01')
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => {
                const inicio = format(new Date(), 'yyyy-MM-01');
                const fim = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');
                handlePeriodoChange(inicio, fim);
              }}
            >
              Este mês
            </button>
            <button
              className={`flex items-center px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200`}
              onClick={() => {
                // Abre um seletor de período personalizado (não implementado)
                console.log('Abrir seletor de período');
              }}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Período
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de cobranças */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        ) : cobrancas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma cobrança encontrada.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cobrancas.map((cobranca) => (
                <tr key={cobranca.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cobranca.aluno_nome}</div>
                    <div className="text-sm text-gray-500">ID: {cobranca.aluno_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatarValor(cobranca.valor)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatarData(cobranca.data_vencimento)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cobranca.data_pagamento ? formatarData(cobranca.data_pagamento) : '-'}
                    </div>
                    {cobranca.forma_pagamento && (
                      <div className="text-xs text-gray-500 capitalize">
                        {cobranca.forma_pagamento === 'pix' ? 'PIX' : cobranca.forma_pagamento}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={cobranca.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{cobranca.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {cobranca.status === 'pendente' && (
                        <>
                          <button 
                            className="p-1 rounded-full hover:bg-green-100 text-green-600"
                            onClick={() => handleRegistrarPagamento(cobranca.id)}
                            disabled={isRegisteringPayment}
                            title="Registrar pagamento"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                            onClick={() => handleGerarLink(cobranca.id)}
                            title="Gerar link de pagamento"
                          >
                            <Link className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {(cobranca.status === 'pendente' || cobranca.status === 'vencido') && (
                        <button 
                          className="p-1 rounded-full hover:bg-red-100 text-red-600"
                          onClick={() => handleCancelarCobranca(cobranca.id)}
                          disabled={isCanceling}
                          title="Cancelar cobrança"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                        title="Mais opções"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}; 