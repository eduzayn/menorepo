import React from 'react';
import { usePoloContext } from '../contexts';
import { formatCurrency } from '@edunexia/utils';

/**
 * Página de Dashboard do Polo
 */
export function Dashboard() {
  const { 
    poloData, 
    isLoading, 
    error,
    currentPoloId
  } = usePoloContext();

  if (isLoading) {
    return <div className="p-4">Carregando informações do polo...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar dados: {error.message}</div>;
  }

  if (!currentPoloId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Portal do Polo</h1>
        <p>Selecione um polo para visualizar o dashboard.</p>
      </div>
    );
  }

  if (!poloData) {
    return <div className="p-4">Dados do polo não encontrados.</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{poloData.nome}</h1>
        <p className="text-gray-600">{poloData.status.toUpperCase()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card de Alunos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Alunos</h2>
          <div className="text-3xl font-bold">210</div>
          <div className="text-sm text-gray-500">
            <span className="text-green-500">+12 este mês</span>
          </div>
        </div>

        {/* Card de Comissões */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Comissões</h2>
          <div className="text-3xl font-bold">{formatCurrency(23450.75)}</div>
          <div className="text-sm text-gray-500">
            <span className="text-green-500">Previsto para o mês</span>
          </div>
        </div>

        {/* Card de Cursos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Cursos</h2>
          <div className="text-3xl font-bold">8</div>
          <div className="text-sm text-gray-500">
            <span>Cursos ativos</span>
          </div>
        </div>

        {/* Card de Repasses */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Repasses</h2>
          <div className="text-3xl font-bold">{formatCurrency(19850.00)}</div>
          <div className="text-sm text-gray-500">
            <span className="text-blue-500">Último mês</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico ou Tabela de Matrículas Recentes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Matrículas Recentes</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left pb-2">Aluno</th>
                <th className="text-left pb-2">Curso</th>
                <th className="text-left pb-2">Data</th>
                <th className="text-left pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Maria Silva</td>
                <td>Administração</td>
                <td>22/03/2024</td>
                <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ativa</span></td>
              </tr>
              <tr>
                <td className="py-2">João Santos</td>
                <td>Pedagogia</td>
                <td>20/03/2024</td>
                <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ativa</span></td>
              </tr>
              <tr>
                <td className="py-2">Ana Oliveira</td>
                <td>Psicologia</td>
                <td>18/03/2024</td>
                <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gráfico ou Tabela de Comissões Pendentes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Comissões Pendentes</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left pb-2">Referência</th>
                <th className="text-left pb-2">Tipo</th>
                <th className="text-right pb-2">Valor</th>
                <th className="text-left pb-2">Previsão</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Março/2024</td>
                <td>Mensalidades</td>
                <td className="text-right">{formatCurrency(12350.00)}</td>
                <td>10/04/2024</td>
              </tr>
              <tr>
                <td className="py-2">Fevereiro/2024</td>
                <td>Matrículas</td>
                <td className="text-right">{formatCurrency(8750.25)}</td>
                <td>05/04/2024</td>
              </tr>
              <tr>
                <td className="py-2">Março/2024</td>
                <td>Certificados</td>
                <td className="text-right">{formatCurrency(2350.50)}</td>
                <td>15/04/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 