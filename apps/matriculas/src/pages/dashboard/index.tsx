import { useState, useEffect } from 'react';
import { Card, Badge, Spinner } from '@edunexia/ui-components';
import { dashboardService } from '../../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalMatriculas: number;
    matriculasAtivas: number;
    matriculasCanceladas: number;
    matriculasPendentes: number;
    matriculasConcluidas: number;
    receitaTotal: number;
    receitaMensal: Record<string, number>;
    matriculasPorCurso: Array<{ nome: string; quantidade: number }>;
    conversaoPorStatus: Array<{ status: string; quantidade: number }>;
  }>({
    totalMatriculas: 0,
    matriculasAtivas: 0,
    matriculasCanceladas: 0,
    matriculasPendentes: 0,
    matriculasConcluidas: 0,
    receitaTotal: 0,
    receitaMensal: {},
    matriculasPorCurso: [],
    conversaoPorStatus: []
  });

  // Período do dashboard
  const [periodo, setPeriodo] = useState<'7dias' | '30dias' | '90dias' | '12meses'>('30dias');

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getDashboardData(periodo);
        setStats(data);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [periodo]);

  // Preparar dados para o gráfico de barras (receita mensal)
  const chartDataReceita = Object.entries(stats.receitaMensal).map(([mes, valor]) => ({
    name: mes,
    valor
  }));

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'concluída':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Matrículas</h1>
        
        <div className="flex space-x-2">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
            <option value="12meses">Últimos 12 meses</option>
          </select>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500">Total de Matrículas</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold">{stats.totalMatriculas}</p>
            <p className="ml-2 text-sm text-gray-500">matrículas</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500">Matrículas Ativas</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-green-600">{stats.matriculasAtivas}</p>
            <p className="ml-2 text-sm text-gray-500">
              ({Math.round((stats.matriculasAtivas / stats.totalMatriculas) * 100) || 0}%)
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500">Receita Total</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-blue-600">{formatCurrency(stats.receitaTotal)}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-500">Conversão</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold">
              {Math.round((stats.matriculasAtivas / (stats.matriculasAtivas + stats.matriculasPendentes)) * 100) || 0}%
            </p>
            <p className="ml-2 text-sm text-gray-500">das matrículas pendentes</p>
          </div>
        </Card>
      </div>

      {/* Status das matrículas */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Matrículas por Status</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className={`${getStatusColor('ativa')} mr-2`}>Ativas</Badge>
                <span>{stats.matriculasAtivas} matrículas</span>
              </div>
              <span className="font-medium">
                {Math.round((stats.matriculasAtivas / stats.totalMatriculas) * 100) || 0}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className={`${getStatusColor('pendente')} mr-2`}>Pendentes</Badge>
                <span>{stats.matriculasPendentes} matrículas</span>
              </div>
              <span className="font-medium">
                {Math.round((stats.matriculasPendentes / stats.totalMatriculas) * 100) || 0}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className={`${getStatusColor('cancelada')} mr-2`}>Canceladas</Badge>
                <span>{stats.matriculasCanceladas} matrículas</span>
              </div>
              <span className="font-medium">
                {Math.round((stats.matriculasCanceladas / stats.totalMatriculas) * 100) || 0}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className={`${getStatusColor('concluída')} mr-2`}>Concluídas</Badge>
                <span>{stats.matriculasConcluidas} matrículas</span>
              </div>
              <span className="font-medium">
                {Math.round((stats.matriculasConcluidas / stats.totalMatriculas) * 100) || 0}%
              </span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.conversaoPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  nameKey="status"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.conversaoPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} matrículas`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Gráfico de receita mensal */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Receita Mensal</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartDataReceita}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']} />
              <Legend />
              <Bar dataKey="valor" fill="#3b82f6" name="Receita" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Matrículas por curso */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Matrículas por Curso</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.matriculasPorCurso}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="nome" tick={{ fontSize: 12 }} width={100} />
              <Tooltip formatter={(value) => [`${value} matrículas`, 'Quantidade']} />
              <Legend />
              <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// Exportando a página de relatório financeiro para uso nas rotas
export function RelatorioFinanceiro() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Relatório Financeiro</h1>
      <p>Esta seção está em desenvolvimento.</p>
    </div>
  );
} 