import { useState } from 'react';
import { Plus, Filter, Download, Search, ChevronDown, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import type { Despesa } from '../../types/financeiro';

// Dados simulados
const DESPESAS_SIMULADAS: Despesa[] = [
  {
    id: '1',
    descricao: 'Aluguel da Sede',
    valor: 3500.00,
    data_vencimento: '2023-04-15',
    data_pagamento: '2023-04-12',
    status: 'pago',
    categoria: 'fixa',
    forma_pagamento: 'transferencia'
  },
  {
    id: '2',
    descricao: 'Salários dos Professores',
    valor: 12500.00,
    data_vencimento: '2023-04-05',
    status: 'pendente',
    categoria: 'salario'
  },
  {
    id: '3',
    descricao: 'Conta de Energia',
    valor: 850.75,
    data_vencimento: '2023-03-20',
    status: 'vencido',
    categoria: 'variavel'
  },
  {
    id: '4',
    descricao: 'Material de Escritório',
    valor: 420.30,
    data_vencimento: '2023-04-02',
    data_pagamento: '2023-04-01',
    status: 'pago',
    categoria: 'variavel',
    forma_pagamento: 'pix'
  },
  {
    id: '5',
    descricao: 'Software Gestor',
    valor: 350.00,
    data_vencimento: '2023-04-10',
    status: 'pendente',
    categoria: 'fixa'
  },
  {
    id: '6',
    descricao: 'Comissões - Março/2023',
    valor: 3200.00,
    data_vencimento: '2023-04-05',
    status: 'pendente',
    categoria: 'comissao'
  },
  {
    id: '7',
    descricao: 'Internet Fibra',
    valor: 299.90,
    data_vencimento: '2023-03-25',
    status: 'vencido',
    categoria: 'fixa'
  }
];

// Componente para a badge de status
function StatusBadge({ status }: { status: Despesa['status'] }) {
  const configs = {
    pendente: {
      className: 'bg-yellow-100 text-yellow-700',
      label: 'Pendente'
    },
    pago: {
      className: 'bg-green-100 text-green-700',
      label: 'Pago'
    },
    vencido: {
      className: 'bg-red-100 text-red-700',
      label: 'Vencido'
    },
    cancelado: {
      className: 'bg-gray-100 text-gray-700',
      label: 'Cancelado'
    },
  };

  const config = configs[status];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

// Componente para a badge de categoria
function CategoriaBadge({ categoria }: { categoria: Despesa['categoria'] }) {
  const configs = {
    fixa: {
      className: 'bg-blue-100 text-blue-700',
      label: 'Fixa'
    },
    variavel: {
      className: 'bg-purple-100 text-purple-700',
      label: 'Variável'
    },
    investimento: {
      className: 'bg-indigo-100 text-indigo-700',
      label: 'Investimento'
    },
    comissao: {
      className: 'bg-pink-100 text-pink-700',
      label: 'Comissão'
    },
    salario: {
      className: 'bg-orange-100 text-orange-700',
      label: 'Salário'
    },
    outra: {
      className: 'bg-gray-100 text-gray-700',
      label: 'Outra'
    }
  };

  const config = configs[categoria];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function PagarPage() {
  const [filtros, setFiltros] = useState({
    termo: '',
    status: null as string | null,
    categoria: null as string | null,
    dataInicio: '',
    dataFim: '',
  });
  
  const [expandirFiltros, setExpandirFiltros] = useState(false);
  const [despesas, setDespesas] = useState<Despesa[]>(DESPESAS_SIMULADAS);
  
  // Função para filtrar as despesas com base nos filtros
  const filtrarDespesas = () => {
    return DESPESAS_SIMULADAS.filter(despesa => {
      // Filtro por termo na descrição
      if (filtros.termo && !despesa.descricao.toLowerCase().includes(filtros.termo.toLowerCase())) {
        return false;
      }
      
      // Filtro por status
      if (filtros.status && despesa.status !== filtros.status) {
        return false;
      }
      
      // Filtro por categoria
      if (filtros.categoria && despesa.categoria !== filtros.categoria) {
        return false;
      }
      
      // Filtro por data de vencimento (início)
      if (filtros.dataInicio && new Date(despesa.data_vencimento) < new Date(filtros.dataInicio)) {
        return false;
      }
      
      // Filtro por data de vencimento (fim)
      if (filtros.dataFim && new Date(despesa.data_vencimento) > new Date(filtros.dataFim)) {
        return false;
      }
      
      return true;
    });
  };
  
  // Aplicar filtros quando houver mudança
  const handleAplicarFiltros = () => {
    setDespesas(filtrarDespesas());
  };
  
  // Resetar filtros
  const handleResetarFiltros = () => {
    setFiltros({
      termo: '',
      status: null,
      categoria: null,
      dataInicio: '',
      dataFim: '',
    });
    setDespesas(DESPESAS_SIMULADAS);
  };
  
  // Calcular totais
  const calcularTotais = () => {
    const total = despesas.reduce((sum, d) => sum + d.valor, 0);
    const totalPendente = despesas.filter(d => d.status === 'pendente').reduce((sum, d) => sum + d.valor, 0);
    const totalPago = despesas.filter(d => d.status === 'pago').reduce((sum, d) => sum + d.valor, 0);
    const totalVencido = despesas.filter(d => d.status === 'vencido').reduce((sum, d) => sum + d.valor, 0);
    
    return { total, totalPendente, totalPago, totalVencido };
  };
  
  const totais = calcularTotais();
  
  // Formatar valor como moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };
  
  // Formatar data no padrão brasileiro
  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contas a Pagar</h1>
          <p className="text-gray-500">Gerencie despesas e pagamentos</p>
        </div>
        
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Nova Despesa</span>
        </button>
      </div>
      
      {/* Resumo de valores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-xl font-bold">{formatarMoeda(totais.total)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pendente</p>
          <p className="text-xl font-bold text-yellow-600">{formatarMoeda(totais.totalPendente)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pago</p>
          <p className="text-xl font-bold text-green-600">{formatarMoeda(totais.totalPago)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Vencido</p>
          <p className="text-xl font-bold text-red-600">{formatarMoeda(totais.totalVencido)}</p>
        </div>
      </div>
      
      {/* Barra de filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Lado esquerdo - Busca */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição..."
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.termo}
              onChange={(e) => setFiltros({...filtros, termo: e.target.value})}
            />
          </div>
          
          {/* Lado direito - Botões */}
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setExpandirFiltros(!expandirFiltros)}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={16} />
              <span>Filtros</span>
              <ChevronDown size={16} className={`transform transition-transform ${expandirFiltros ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Exportar"
            >
              <Download size={16} />
              <span className="hidden md:inline">Exportar</span>
            </button>
          </div>
        </div>
        
        {/* Filtros avançados */}
        {expandirFiltros && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={filtros.status || ''}
                  onChange={(e) => setFiltros({...filtros, status: e.target.value || null})}
                >
                  <option value="">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencido">Vencido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={filtros.categoria || ''}
                  onChange={(e) => setFiltros({...filtros, categoria: e.target.value || null})}
                >
                  <option value="">Todas</option>
                  <option value="fixa">Fixa</option>
                  <option value="variavel">Variável</option>
                  <option value="investimento">Investimento</option>
                  <option value="comissao">Comissão</option>
                  <option value="salario">Salário</option>
                  <option value="outra">Outra</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período de vencimento
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filtros.dataInicio}
                    onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                    placeholder="De"
                  />
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={filtros.dataFim}
                    onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                    placeholder="Até"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={handleResetarFiltros}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Resetar
              </button>
              <button
                onClick={handleAplicarFiltros}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Tabela de despesas */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {despesas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
                    <p>Nenhuma despesa encontrada com os filtros aplicados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              despesas.map((despesa) => (
                <tr key={despesa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{despesa.descricao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <CategoriaBadge categoria={despesa.categoria} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">{formatarMoeda(despesa.valor)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-700">{formatarData(despesa.data_vencimento)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={despesa.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Visualizar detalhes"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar despesa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Excluir despesa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 