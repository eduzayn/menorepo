import React, { useState } from 'react';
import { usePoloContext } from '../contexts';
import { usePoloData } from '../hooks';
import { formatDate } from '@edunexia/core';

/**
 * Página de Listagem de Alunos do Polo
 */
export function AlunosLista() {
  const { currentPoloId, poloData } = usePoloContext();
  const { alunos, isLoading, error } = usePoloData(currentPoloId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  if (isLoading) {
    return <div className="p-4">Carregando alunos...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar alunos: {error.message}</div>;
  }

  if (!currentPoloId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Alunos Matriculados</h1>
        <p>Selecione um polo para visualizar os alunos.</p>
      </div>
    );
  }

  // Filtragem de alunos por termo de busca e status
  const filteredAlunos = alunos
    .filter(aluno => 
      aluno.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(aluno => statusFilter === 'todos' || aluno.status === statusFilter);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alunos Matriculados</h1>
        <div className="text-sm text-gray-500">
          Polo: <span className="font-semibold">{poloData?.nome}</span>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-gray-600">Status:</span>
          <select
            className="px-3 py-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="trancado">Trancado</option>
            <option value="formado">Formado</option>
          </select>
        </div>
      </div>

      {/* Tabela de alunos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Matrícula
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlunos.length > 0 ? (
                filteredAlunos.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{aluno.nome}</div>
                      <div className="text-sm text-gray-500">{aluno.cpf}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.email}</div>
                      <div className="text-sm text-gray-500">{aluno.telefone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.curso || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.matricula_id || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${aluno.status === 'ativo' ? 'bg-green-100 text-green-800' : ''}
                        ${aluno.status === 'inativo' ? 'bg-red-100 text-red-800' : ''}
                        ${aluno.status === 'trancado' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${aluno.status === 'formado' ? 'bg-blue-100 text-blue-800' : ''}`}
                      >
                        {aluno.status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {aluno.data_matricula ? formatDate(aluno.data_matricula) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {/* Ação para visualizar detalhes */}}
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum aluno encontrado com os filtros selecionados.
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