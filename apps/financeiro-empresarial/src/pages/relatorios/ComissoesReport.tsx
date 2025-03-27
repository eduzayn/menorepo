import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, Filter, Users } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import { Comissao } from '../../types/financeiro';
import { RepasseService } from '../../services/RepasseService';

interface ComissaoChart {
  nome: string; 
  valor: number;
}

export const ComissoesReport: React.FC = () => {
  const { user, supabase } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [dataInicio, setDataInicio] = useState<string>(
    format(subMonths(new Date(), 3), 'yyyy-MM-dd')
  );
  const [dataFim, setDataFim] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [tipoBeneficiario, setTipoBeneficiario] = useState<'todos' | 'polo' | 'consultor'>('todos');
  const [status, setStatus] = useState<'todos' | 'pendente' | 'processando' | 'pago' | 'cancelado' | 'estornado'>('todos');
  const [chartData, setChartData] = useState<ComissaoChart[]>([]);

  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      if (!user?.instituicao_id) return;
      setIsLoading(true);

      try {
        const repasseService = new RepasseService({ supabase });
        
        const filtros = {
          data_inicio: dataInicio,
          data_fim: dataFim,
          beneficiario_tipo: tipoBeneficiario !== 'todos' ? tipoBeneficiario : undefined,
          status: status !== 'todos' ? status : undefined,
          instituicao_id: user.instituicao_id
        };
        
        const { dados } = await repasseService.buscarComissoes(filtros);
        
        if (dados && Array.isArray(dados)) {
          setComissoes(dados);
          prepararDadosGrafico(dados);
        }
      } catch (error) {
        console.error('Erro ao carregar comissões:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [user, dataInicio, dataFim, tipoBeneficiario, status]);

  // Preparar dados para o gráfico
  const prepararDadosGrafico = (comissoes: Comissao[]) => {
    // Agrupar por beneficiário
    const agrupado = comissoes.reduce((acc, comissao) => {
      const id = comissao.beneficiario_id;
      if (!acc[id]) {
        acc[id] = {
          id: comissao.beneficiario_id,
          nome: comissao.beneficiario_tipo === 'polo' 
            ? `Polo ${comissao.beneficiario_id.substring(0, 5)}` 
            : `Consultor ${comissao.beneficiario_id.substring(0, 5)}`,
          valor: 0
        };
      }
      acc[id].valor += comissao.valor;
      return acc;
    }, {} as Record<string, ComissaoChart>);

    // Converter para array e ordenar
    const dados = Object.values(agrupado)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10); // Top 10

    setChartData(dados);
  };

  // Calcular totais
  const totalComissoes = comissoes.reduce((total, c) => total + c.valor, 0);
  const totalPagas = comissoes
    .filter(c => c.status === 'pago')
    .reduce((total, c) => total + c.valor, 0);
  const totalPendentes = comissoes
    .filter(c => c.status === 'pendente' || c.status === 'processando')
    .reduce((total, c) => total + c.valor, 0);
  const totalPolos = comissoes
    .filter(c => c.beneficiario_tipo === 'polo')
    .reduce((total, c) => total + c.valor, 0);
  const totalConsultores = comissoes
    .filter(c => c.beneficiario_tipo === 'consultor')
    .reduce((total, c) => total + c.valor, 0);

  // Exportar relatório
  const exportarRelatorio = () => {
    alert('Funcionalidade de exportação em implementação');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Relatório de Comissões</h2>
        <button 
          onClick={exportarRelatorio}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Data Início</label>
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <input 
              type="date" 
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Data Fim</label>
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <input 
              type="date" 
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Tipo</label>
          <div className="flex items-center">
            <Users size={16} className="text-gray-400 mr-2" />
            <select 
              value={tipoBeneficiario}
              onChange={(e) => setTipoBeneficiario(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="todos">Todos</option>
              <option value="polo">Polos</option>
              <option value="consultor">Consultores</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Status</label>
          <div className="flex items-center">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="processando">Em Processamento</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
              <option value="estornado">Estornado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total de Comissões</h3>
          <p className="text-lg font-bold">R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Comissões Pagas</h3>
          <p className="text-lg font-bold text-green-600">R$ {totalPagas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Comissões Pendentes</h3>
          <p className="text-lg font-bold text-yellow-600">R$ {totalPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total Polos</h3>
          <p className="text-lg font-bold text-blue-600">R$ {totalPolos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total Consultores</h3>
          <p className="text-lg font-bold text-purple-600">R$ {totalConsultores.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Top 10 Beneficiários por Valor</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Carregando gráfico...</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nome" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']} />
                <Legend />
                <Bar dataKey="valor" name="Valor de Comissões" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabela de comissões */}
      <div>
        <h3 className="text-lg font-medium mb-4">Detalhamento de Comissões</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Referência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">Carregando comissões...</td>
                </tr>
              ) : comissoes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma comissão encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                comissoes.slice(0, 10).map((comissao) => (
                  <tr key={comissao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {comissao.beneficiario_tipo === 'polo' ? 'Polo' : 'Consultor'} {comissao.beneficiario_id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 capitalize">{comissao.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        R$ {comissao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(comissao.data_referencia), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${comissao.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${comissao.status === 'processando' ? 'bg-blue-100 text-blue-800' : ''}
                        ${comissao.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                        ${comissao.status === 'cancelado' ? 'bg-red-100 text-red-800' : ''}
                        ${comissao.status === 'estornado' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {comissao.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {comissoes.length > 10 && (
            <div className="mt-4 text-right text-sm text-gray-500">
              Mostrando 10 de {comissoes.length} comissões
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 