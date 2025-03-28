import React, { useState } from 'react';
import { usePoloContext } from '../contexts';
import { usePoloData } from '../hooks';
import { formatCurrency, formatDate } from '@edunexia/core';
import { Download, Filter, FileText } from 'lucide-react';

type PeriodoFiltro = 'todos' | 'mes_atual' | 'mes_anterior' | '3_meses' | '6_meses';
type StatusFiltro = 'todos' | 'pendente' | 'processando' | 'pago' | 'cancelado' | 'estornado';

/**
 * Página de Repasses do Polo
 * Permite visualizar o histórico de repasses financeiros
 */
export function Repasses() {
  const { currentPoloId, poloData } = usePoloContext();
  const { repasses, isLoading, error } = usePoloData(currentPoloId);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>('todos');
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('todos');

  if (isLoading) {
    return <div className="p-4">Carregando repasses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar repasses: {error.message}</div>;
  }

  if (!currentPoloId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Repasses Financeiros</h1>
        <p>Selecione um polo para visualizar os repasses.</p>
      </div>
    );
  }

  // Filtragem por período
  const filtrarPorPeriodo = (repasse) => {
    if (periodoFiltro === 'todos') return true;
    
    const hoje = new Date();
    const dataRepasse = new Date(repasse.data_prevista);
    
    switch (periodoFiltro) {
      case 'mes_atual':
        return dataRepasse.getMonth() === hoje.getMonth() && 
               dataRepasse.getFullYear() === hoje.getFullYear();
      case 'mes_anterior':
        const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1);
        return dataRepasse.getMonth() === mesAnterior.getMonth() && 
               dataRepasse.getFullYear() === mesAnterior.getFullYear();
      case '3_meses':
        const tresMesesAtras = new Date(hoje);
        tresMesesAtras.setMonth(hoje.getMonth() - 3);
        return dataRepasse >= tresMesesAtras;
      case '6_meses':
        const seisMesesAtras = new Date(hoje);
        seisMesesAtras.setMonth(hoje.getMonth() - 6);
        return dataRepasse >= seisMesesAtras;
      default:
        return true;
    }
  };

  // Filtragem por status
  const filtrarPorStatus = (repasse) => {
    return statusFiltro === 'todos' || repasse.status === statusFiltro;
  };

  // Aplicar filtros
  const repassesFiltrados = repasses
    ? repasses.filter(repasse => filtrarPorPeriodo(repasse) && filtrarPorStatus(repasse))
    : [];

  // Calcular totais
  const totalRepasses = repassesFiltrados.reduce((acc, repasse) => acc + repasse.valor_total, 0);
  const totalPago = repassesFiltrados
    .filter(repasse => repasse.status === 'pago')
    .reduce((acc, repasse) => acc + repasse.valor_total, 0);
  const totalPendente = repassesFiltrados
    .filter(repasse => repasse.status === 'pendente' || repasse.status === 'processando')
    .reduce((acc, repasse) => acc + repasse.valor_total, 0);

  // Ver comprovante
  const verComprovante = (comprovanteUrl) => {
    if (!comprovanteUrl) {
      alert('Comprovante não disponível');
      return;
    }
    window.open(comprovanteUrl, '_blank');
  };

  // Baixar relatório (mock)
  const baixarRelatorio = () => {
    alert('Funcionalidade de download de relatório será implementada em breve');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repasses Financeiros</h1>
        <div className="text-sm text-gray-500">
          Polo: <span className="font-semibold">{poloData?.nome}</span>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Repasses</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalRepasses)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Repasses Pagos</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Repasses Pendentes</h3>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendente)}</p>
        </div>
      </div>

      {/* Filtros e ações */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              className="px-3 py-2 border rounded-lg"
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value as PeriodoFiltro)}
            >
              <option value="todos">Todos os períodos</option>
              <option value="mes_atual">Mês Atual</option>
              <option value="mes_anterior">Mês Anterior</option>
              <option value="3_meses">Últimos 3 Meses</option>
              <option value="6_meses">Últimos 6 Meses</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border rounded-lg"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value as StatusFiltro)}
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="processando">Em Processamento</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
              <option value="estornado">Estornado</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={baixarRelatorio}
          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>

      {/* Tabela de repasses */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Prevista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comissões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comprovante
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repassesFiltrados.length > 0 ? (
                repassesFiltrados.map((repasse) => (
                  <tr key={repasse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {repasse.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(repasse.data_prevista)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(repasse.valor_total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {repasse.quantidade_comissoes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {repasse.data_pagamento ? formatDate(repasse.data_pagamento) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${repasse.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${repasse.status === 'processando' ? 'bg-blue-100 text-blue-800' : ''}
                        ${repasse.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                        ${repasse.status === 'cancelado' ? 'bg-red-100 text-red-800' : ''}
                        ${repasse.status === 'estornado' ? 'bg-gray-100 text-gray-800' : ''}`}
                      >
                        {repasse.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {repasse.comprovante_url ? (
                        <button 
                          onClick={() => verComprovante(repasse.comprovante_url)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FileText size={16} />
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum repasse encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 