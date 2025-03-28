import React, { useState } from 'react';
import { usePoloContext } from '../contexts';
import { usePoloData } from '../hooks';
import { formatCurrency, formatDate } from '@edunexia/core';

/**
 * Página de Comissões do Polo
 */
export function Comissoes() {
  const { currentPoloId, poloData } = usePoloContext();
  const { comissoes, isLoading, error } = usePoloData(currentPoloId);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [periodoFilter, setPeriodoFilter] = useState<string>('todos');

  if (isLoading) {
    return <div className="p-4">Carregando comissões...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar comissões: {error.message}</div>;
  }

  if (!currentPoloId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Comissões</h1>
        <p>Selecione um polo para visualizar as comissões.</p>
      </div>
    );
  }

  // Filtragem de comissões
  const filteredComissoes = comissoes
    .filter(comissao => statusFilter === 'todos' || comissao.status === statusFilter)
    .filter(comissao => tipoFilter === 'todos' || comissao.tipo === tipoFilter)
    .filter(comissao => {
      if (periodoFilter === 'todos') return true;
      const today = new Date();
      const comissaoDate = new Date(comissao.data_referencia);
      
      if (periodoFilter === 'mes_atual') {
        return comissaoDate.getMonth() === today.getMonth() && 
               comissaoDate.getFullYear() === today.getFullYear();
      }
      
      if (periodoFilter === 'mes_anterior') {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        return comissaoDate.getMonth() === lastMonth.getMonth() && 
               comissaoDate.getFullYear() === lastMonth.getFullYear();
      }
      
      return true;
    });

  // Cálculo de totais
  const totalComissoes = filteredComissoes.reduce((acc, comissao) => acc + comissao.valor, 0);
  const totalPendentes = filteredComissoes
    .filter(comissao => comissao.status === 'pendente')
    .reduce((acc, comissao) => acc + comissao.valor, 0);
  const totalPagas = filteredComissoes
    .filter(comissao => comissao.status === 'pago')
    .reduce((acc, comissao) => acc + comissao.valor, 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comissões</h1>
        <div className="text-sm text-gray-500">
          Polo: <span className="font-semibold">{poloData?.nome}</span>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Comissões</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalComissoes)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Comissões Pendentes</h3>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendentes)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Comissões Pagas</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPagas)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-gray-600">Status:</span>
          <select
            className="px-3 py-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="processando">Processando</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-gray-600">Tipo:</span>
          <select
            className="px-3 py-2 border rounded-lg"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="matricula">Matrícula</option>
            <option value="mensalidade">Mensalidade</option>
            <option value="certificacao">Certificação</option>
            <option value="material">Material</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-gray-600">Período:</span>
          <select
            className="px-3 py-2 border rounded-lg"
            value={periodoFilter}
            onChange={(e) => setPeriodoFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="mes_atual">Mês Atual</option>
            <option value="mes_anterior">Mês Anterior</option>
          </select>
        </div>
      </div>

      {/* Tabela de comissões */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComissoes.length > 0 ? (
                filteredComissoes.map((comissao) => (
                  <tr key={comissao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(comissao.data_referencia).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{comissao.aluno_nome || 'Nome do Aluno'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{comissao.curso_nome || 'Nome do Curso'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="capitalize text-sm text-gray-900">{comissao.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(comissao.valor)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{comissao.percentual}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${comissao.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${comissao.status === 'processando' ? 'bg-blue-100 text-blue-800' : ''}
                        ${comissao.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                        ${comissao.status === 'cancelado' ? 'bg-red-100 text-red-800' : ''}`}
                      >
                        {comissao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(comissao.data_calculo)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma comissão encontrada com os filtros selecionados.
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