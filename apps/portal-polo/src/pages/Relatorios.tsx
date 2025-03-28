import React, { useState } from 'react';
import { usePoloContext } from '../contexts';

type RelatorioTipo = 'alunos' | 'financeiro' | 'desempenho';
type PeriodoFiltro = 'mes_atual' | 'mes_anterior' | '3_meses' | '6_meses' | '12_meses';

export function Relatorios() {
  const { poloData, isPolo, isLoading } = usePoloContext();
  const [tipoRelatorio, setTipoRelatorio] = useState<RelatorioTipo>('alunos');
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('mes_atual');

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (!isPolo || !poloData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">Selecione um polo para visualizar os relatórios.</p>
        </div>
      </div>
    );
  }

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoRelatorio(e.target.value as RelatorioTipo);
  };

  const handlePeriodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriodo(e.target.value as PeriodoFiltro);
  };

  const handleExport = (formato: 'pdf' | 'excel' | 'csv') => {
    // Implementação futura - exportação de relatórios
    alert(`Exportando relatório de ${tipoRelatorio} do período ${periodo} em formato ${formato}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Relatório
              </label>
              <select 
                className="select"
                value={tipoRelatorio}
                onChange={handleTipoChange}
              >
                <option value="alunos">Alunos Matriculados</option>
                <option value="financeiro">Financeiro</option>
                <option value="desempenho">Desempenho do Polo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select 
                className="select"
                value={periodo}
                onChange={handlePeriodoChange}
              >
                <option value="mes_atual">Mês Atual</option>
                <option value="mes_anterior">Mês Anterior</option>
                <option value="3_meses">Últimos 3 Meses</option>
                <option value="6_meses">Últimos 6 Meses</option>
                <option value="12_meses">Últimos 12 Meses</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleExport('pdf')} 
            className="btn btn-primary"
          >
            Exportar PDF
          </button>
          <button 
            onClick={() => handleExport('excel')} 
            className="btn btn-outline"
          >
            Exportar Excel
          </button>
          <button 
            onClick={() => handleExport('csv')} 
            className="btn btn-outline"
          >
            Exportar CSV
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {tipoRelatorio === 'alunos' && 'Relatório de Alunos Matriculados'}
            {tipoRelatorio === 'financeiro' && 'Relatório Financeiro'}
            {tipoRelatorio === 'desempenho' && 'Relatório de Desempenho do Polo'}
            
            <span className="text-sm font-normal text-gray-500 ml-2">
              {periodo === 'mes_atual' && '(Mês Atual)'}
              {periodo === 'mes_anterior' && '(Mês Anterior)'}
              {periodo === '3_meses' && '(Últimos 3 Meses)'}
              {periodo === '6_meses' && '(Últimos 6 Meses)'}
              {periodo === '12_meses' && '(Últimos 12 Meses)'}
            </span>
          </h2>
          
          <div className="relative overflow-x-auto">
            {tipoRelatorio === 'alunos' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome do Aluno</th>
                    <th>Curso</th>
                    <th>Data de Matrícula</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium text-gray-700">Ana Silva</td>
                    <td>Pedagogia</td>
                    <td>15/03/2023</td>
                    <td><span className="badge badge-green">Ativo</span></td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Carlos Mendes</td>
                    <td>Administração</td>
                    <td>22/04/2023</td>
                    <td><span className="badge badge-green">Ativo</span></td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Júlia Oliveira</td>
                    <td>Psicologia</td>
                    <td>10/02/2023</td>
                    <td><span className="badge badge-yellow">Pendente</span></td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Roberto Alves</td>
                    <td>Engenharia Civil</td>
                    <td>05/01/2023</td>
                    <td><span className="badge badge-red">Trancado</span></td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {tipoRelatorio === 'financeiro' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Total de Comissões</th>
                    <th>Total de Repasses</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Janeiro/2023</td>
                    <td>R$ 3.500,00</td>
                    <td>R$ 3.500,00</td>
                    <td>R$ 0,00</td>
                  </tr>
                  <tr>
                    <td>Fevereiro/2023</td>
                    <td>R$ 4.200,00</td>
                    <td>R$ 4.200,00</td>
                    <td>R$ 0,00</td>
                  </tr>
                  <tr>
                    <td>Março/2023</td>
                    <td>R$ 5.100,00</td>
                    <td>R$ 5.100,00</td>
                    <td>R$ 0,00</td>
                  </tr>
                  <tr>
                    <td>Abril/2023</td>
                    <td>R$ 4.800,00</td>
                    <td>R$ 4.800,00</td>
                    <td>R$ 0,00</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {tipoRelatorio === 'desempenho' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Métrica</th>
                    <th>Valor Atual</th>
                    <th>Meta</th>
                    <th>Desempenho</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Novas Matrículas</td>
                    <td>42</td>
                    <td>40</td>
                    <td><span className="badge badge-green">105%</span></td>
                  </tr>
                  <tr>
                    <td>Conversão de Leads</td>
                    <td>15%</td>
                    <td>20%</td>
                    <td><span className="badge badge-yellow">75%</span></td>
                  </tr>
                  <tr>
                    <td>Satisfação dos Alunos</td>
                    <td>4.7/5.0</td>
                    <td>4.5/5.0</td>
                    <td><span className="badge badge-green">104%</span></td>
                  </tr>
                  <tr>
                    <td>Retenção de Alunos</td>
                    <td>92%</td>
                    <td>85%</td>
                    <td><span className="badge badge-green">108%</span></td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 