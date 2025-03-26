import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Users,
  FileText,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { DadosDashboard } from '../../types/financeiro';

// Dados simulados para o dashboard
const DADOS_SIMULADOS: DadosDashboard = {
  receitas: {
    total: 75000.00,
    pendente: 25000.00,
    recebido: 42500.00,
    vencido: 7500.00
  },
  despesas: {
    total: 45000.00,
    pendente: 15000.00,
    pago: 30000.00,
    vencido: 0.00
  },
  fluxoCaixa: {
    entradas: 42500.00,
    saidas: 30000.00,
    saldo: 12500.00
  },
  historico: [
    { mes: 'Jan', receitas: 65000, despesas: 42000 },
    { mes: 'Fev', receitas: 68000, despesas: 43500 },
    { mes: 'Mar', receitas: 72000, despesas: 45000 },
    { mes: 'Abr', receitas: 70000, despesas: 44000 },
    { mes: 'Mai', receitas: 73000, despesas: 45500 },
    { mes: 'Jun', receitas: 75000, despesas: 45000 }
  ],
  inadimplencia: {
    taxa: 10,
    valor: 7500.00,
    comparacao_mes_anterior: -2
  }
};

// Componente para o gráfico de barras do histórico financeiro
const GraficoBarras: React.FC<{ data: DadosDashboard['historico'] }> = ({ data }) => {
  // Encontrar o valor máximo para ajustar a escala
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.receitas, item.despesas))
  );
  
  return (
    <div className="mt-4">
      <div className="flex items-end space-x-2 h-36">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex flex-col items-center">
              <div 
                className="w-full max-w-[30px] bg-blue-500 rounded-t"
                style={{ height: `${(item.receitas / maxValue) * 100}%` }}
              ></div>
              <div 
                className="w-full max-w-[30px] bg-red-400 rounded-t mt-1"
                style={{ height: `${(item.despesas / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs mt-2 text-gray-600">{item.mes}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
          <span className="text-xs text-gray-600">Receitas</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
          <span className="text-xs text-gray-600">Despesas</span>
        </div>
      </div>
    </div>
  );
};

// Componente para o cartão de métricas
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel,
  color 
}) => {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    return trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  };

  const getTrendClass = () => {
    if (trend === undefined) return '';
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
          
          {trend !== undefined && (
            <p className={`text-xs flex items-center mt-1 ${getTrendClass()}`}>
              {getTrendIcon()}
              <span className="ml-1">{Math.abs(trend)}% {trendLabel}</span>
            </p>
          )}
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Lista de próximos pagamentos
const ProximosPagamentos: React.FC = () => {
  const proximosPagamentos = [
    { id: '1', aluno: 'João Silva', valor: 750, data: '2023-06-15', tipo: 'Mensalidade' },
    { id: '2', aluno: 'Ana Costa', valor: 750, data: '2023-06-16', tipo: 'Mensalidade' },
    { id: '3', aluno: 'Carlos Oliveira', valor: 350, data: '2023-06-18', tipo: 'Taxa' }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Próximos Recebimentos</h3>
        <Link to="/receber" className="text-blue-600 text-sm flex items-center">
          Ver todos <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="space-y-3">
        {proximosPagamentos.map(pagamento => (
          <div key={pagamento.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div>
              <p className="font-medium text-sm">{pagamento.aluno}</p>
              <p className="text-xs text-gray-500">{pagamento.tipo} • {new Date(pagamento.data).toLocaleDateString('pt-BR')}</p>
            </div>
            <p className="font-medium text-sm">
              {pagamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Lista de próximas despesas
const ProximasDespesas: React.FC = () => {
  const proximasDespesas = [
    { id: '1', descricao: 'Aluguel', valor: 5000, data: '2023-06-15', categoria: 'Aluguel' },
    { id: '2', descricao: 'Internet', valor: 300, data: '2023-06-17', categoria: 'Serviços' },
    { id: '3', descricao: 'Software ERP', valor: 1200, data: '2023-06-20', categoria: 'Serviços' }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Próximos Pagamentos</h3>
        <Link to="/pagar" className="text-blue-600 text-sm flex items-center">
          Ver todos <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="space-y-3">
        {proximasDespesas.map(despesa => (
          <div key={despesa.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div>
              <p className="font-medium text-sm">{despesa.descricao}</p>
              <p className="text-xs text-gray-500">{despesa.categoria} • {new Date(despesa.data).toLocaleDateString('pt-BR')}</p>
            </div>
            <p className="font-medium text-sm">
              {despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal do Dashboard
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState<DadosDashboard | null>(null);
  const [periodoAtivo, setPeriodoAtivo] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [isLoading, setIsLoading] = useState(true);

  // Formatação de valores monetários
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Carrega dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      
      // Simulação de carregamento da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Para demonstração, usa os dados simulados
      setDados(DADOS_SIMULADOS);
      setIsLoading(false);
    };
    
    carregarDados();
  }, [periodoAtivo]);

  // Mensagem de carregamento 
  if (isLoading || !dados) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <p className="text-gray-500">Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Financeiro</h1>
        <p className="text-gray-600">Visão geral das métricas financeiras da sua instituição</p>
      </div>

      {/* Seleção de período */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setPeriodoAtivo('mes')}
          className={`px-4 py-2 rounded-lg text-sm ${
            periodoAtivo === 'mes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Este mês
        </button>
        <button
          onClick={() => setPeriodoAtivo('trimestre')}
          className={`px-4 py-2 rounded-lg text-sm ${
            periodoAtivo === 'trimestre'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Trimestre
        </button>
        <button
          onClick={() => setPeriodoAtivo('ano')}
          className={`px-4 py-2 rounded-lg text-sm ${
            periodoAtivo === 'ano'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Ano atual
        </button>
      </div>

      {/* Cards com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Receitas Totais"
          value={formatarValor(dados.receitas.total)}
          icon={<DollarSign size={20} className="text-blue-700" />}
          trend={5}
          trendLabel="vs. mês anterior"
          color="bg-blue-100"
        />
        <MetricCard
          title="Despesas Totais"
          value={formatarValor(dados.despesas.total)}
          icon={<Wallet size={20} className="text-red-700" />}
          trend={-2}
          trendLabel="vs. mês anterior"
          color="bg-red-100"
        />
        <MetricCard
          title="Saldo de Caixa"
          value={formatarValor(dados.fluxoCaixa.saldo)}
          icon={<TrendingUp size={20} className="text-green-700" />}
          trend={8}
          trendLabel="vs. mês anterior"
          color="bg-green-100"
        />
        <MetricCard
          title="Taxa de Inadimplência"
          value={`${dados.inadimplencia.taxa}%`}
          icon={<AlertTriangle size={20} className="text-amber-700" />}
          trend={dados.inadimplencia.comparacao_mes_anterior}
          trendLabel="vs. mês anterior"
          color="bg-amber-100"
        />
      </div>

      {/* Gráfico e quadros adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Histórico Financeiro */}
        <div className="bg-white rounded-lg p-4 shadow lg:col-span-2">
          <h3 className="font-semibold mb-2">Histórico Financeiro</h3>
          <p className="text-sm text-gray-500 mb-2">Comparativo de receitas e despesas dos últimos meses</p>
          <GraficoBarras data={dados.historico} />
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-4">Resumo Financeiro</h3>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Receitas</h4>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recebido</span>
                <span className="font-medium text-green-600">{formatarValor(dados.receitas.recebido)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendente</span>
                <span className="font-medium text-yellow-600">{formatarValor(dados.receitas.pendente)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vencido</span>
                <span className="font-medium text-red-600">{formatarValor(dados.receitas.vencido)}</span>
              </div>
            </div>
            
            <div className="h-px bg-gray-200 my-4"></div>
            
            <h4 className="text-sm font-medium mb-2">Despesas</h4>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pago</span>
                <span className="font-medium">{formatarValor(dados.despesas.pago)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">A pagar</span>
                <span className="font-medium">{formatarValor(dados.despesas.pendente)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vencido</span>
                <span className="font-medium">{formatarValor(dados.despesas.vencido)}</span>
              </div>
            </div>
            
            <div className="h-px bg-gray-200 my-4"></div>
            
            <div className="flex justify-between font-medium">
              <span>Fluxo de Caixa (Saldo)</span>
              <span className={`${dados.fluxoCaixa.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatarValor(dados.fluxoCaixa.saldo)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos pagamentos/recebimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProximosPagamentos />
        <ProximasDespesas />
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/cobrancas/nova" className="bg-white rounded-lg p-4 shadow flex items-center hover:bg-gray-50">
          <div className="p-2 rounded-full bg-blue-100 mr-3">
            <Users size={20} className="text-blue-700" />
          </div>
          <div>
            <h3 className="font-medium">Nova Cobrança</h3>
            <p className="text-xs text-gray-500">Criar cobrança para aluno</p>
          </div>
        </Link>
        
        <Link to="/pagar" className="bg-white rounded-lg p-4 shadow flex items-center hover:bg-gray-50">
          <div className="p-2 rounded-full bg-red-100 mr-3">
            <Wallet size={20} className="text-red-700" />
          </div>
          <div>
            <h3 className="font-medium">Registrar Despesa</h3>
            <p className="text-xs text-gray-500">Adicionar nova despesa</p>
          </div>
        </Link>
        
        <Link to="/relatorios" className="bg-white rounded-lg p-4 shadow flex items-center hover:bg-gray-50">
          <div className="p-2 rounded-full bg-green-100 mr-3">
            <FileText size={20} className="text-green-700" />
          </div>
          <div>
            <h3 className="font-medium">Relatórios</h3>
            <p className="text-xs text-gray-500">Ver relatórios detalhados</p>
          </div>
        </Link>
        
        <Link to="/taxas" className="bg-white rounded-lg p-4 shadow flex items-center hover:bg-gray-50">
          <div className="p-2 rounded-full bg-purple-100 mr-3">
            <Calendar size={20} className="text-purple-700" />
          </div>
          <div>
            <h3 className="font-medium">Taxas</h3>
            <p className="text-xs text-gray-500">Gerenciar taxas administrativas</p>
          </div>
        </Link>
      </div>
    </div>
  );
}; 