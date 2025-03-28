import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  DocumentIcon, 
  ReceiptRefundIcon, 
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

type StatusPagamento = 'pago' | 'pendente' | 'atrasado' | 'cancelado';

type Transacao = {
  id: string;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  data: string;
  vencimento?: string;
  status: StatusPagamento;
  referencia?: string;
};

const Financeiro: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [statusFiltro, setStatusFiltro] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [filteredTransacoes, setFilteredTransacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    totalPendente: 0,
    saldo: 0
  });

  useEffect(() => {
    const fetchFinanceiro = () => {
      setLoading(true);
      
      // Simulando dados para demonstração
      setTimeout(() => {
        const mockTransacoes: Transacao[] = Array.from({ length: 20 }, (_, index) => {
          const tipo = Math.random() > 0.3 ? 'entrada' : 'saida';
          const status = ['pago', 'pendente', 'atrasado', 'cancelado'][Math.floor(Math.random() * 4)] as StatusPagamento;
          const hoje = new Date();
          const dataTransacao = new Date(hoje);
          dataTransacao.setDate(hoje.getDate() - Math.floor(Math.random() * 60));
          
          let vencimento;
          if (status === 'pendente' || status === 'atrasado') {
            vencimento = new Date(dataTransacao);
            vencimento.setDate(dataTransacao.getDate() + 15);
          }
          
          const descricoes = [
            'Certificação de alunos',
            'Validação de curso',
            'Renovação de contrato',
            'Taxa administrativa',
            'Emissão de certificados em lote',
            'Solicitação de histórico'
          ];
          
          return {
            id: `TRX${String(index + 1).padStart(5, '0')}`,
            tipo,
            descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
            valor: parseFloat((Math.random() * 2000 + 100).toFixed(2)),
            data: dataTransacao.toISOString(),
            vencimento: vencimento?.toISOString(),
            status,
            referencia: `REF${Math.floor(Math.random() * 9999)}`
          };
        });
        
        // Ordenar por data mais recente
        mockTransacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        
        setTransacoes(mockTransacoes);
        setFilteredTransacoes(mockTransacoes);
        
        // Calcular resumo
        const entradas = mockTransacoes
          .filter(t => t.tipo === 'entrada' && t.status === 'pago')
          .reduce((sum, t) => sum + t.valor, 0);
          
        const saidas = mockTransacoes
          .filter(t => t.tipo === 'saida' && t.status === 'pago')
          .reduce((sum, t) => sum + t.valor, 0);
          
        const pendente = mockTransacoes
          .filter(t => t.tipo === 'entrada' && (t.status === 'pendente' || t.status === 'atrasado'))
          .reduce((sum, t) => sum + t.valor, 0);
        
        setResumo({
          totalEntradas: entradas,
          totalSaidas: saidas,
          totalPendente: pendente,
          saldo: entradas - saidas
        });
        
        setLoading(false);
      }, 1000);
      
      // Em produção:
      // const response = await api.financeiro.listar();
      // setTransacoes(response.transacoes);
      // setResumo(response.resumo);
      // setLoading(false);
    };
    
    fetchFinanceiro();
  }, []);
  
  useEffect(() => {
    // Aplicar filtros
    let result = [...transacoes];
    
    // Filtro por período
    if (periodo !== 'todos') {
      const hoje = new Date();
      const limitDate = new Date();
      
      switch (periodo) {
        case 'mes':
          limitDate.setMonth(hoje.getMonth() - 1);
          break;
        case 'trimestre':
          limitDate.setMonth(hoje.getMonth() - 3);
          break;
        case 'semestre':
          limitDate.setMonth(hoje.getMonth() - 6);
          break;
        case 'ano':
          limitDate.setFullYear(hoje.getFullYear() - 1);
          break;
      }
      
      result = result.filter(t => new Date(t.data) >= limitDate);
    }
    
    // Filtro por status
    if (statusFiltro) {
      result = result.filter(t => t.status === statusFiltro);
    }
    
    // Filtro por texto
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.descricao.toLowerCase().includes(termLower) || 
        t.referencia?.toLowerCase().includes(termLower) ||
        t.id.toLowerCase().includes(termLower)
      );
    }
    
    setFilteredTransacoes(result);
  }, [transacoes, periodo, statusFiltro, searchTerm]);
  
  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Formatar valor
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Obter cor por status
  const getStatusColor = (status: StatusPagamento) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'atrasado':
        return 'bg-red-100 text-red-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerenciamento financeiro da sua instituição
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="btn-outline flex items-center"
            title="Exportar relatório"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Exportar
          </button>
        </div>
      </div>
      
      {/* Cards de resumo */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Recebido
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(resumo.totalEntradas)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ReceiptRefundIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Pago
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(resumo.totalSaidas)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Valores Pendentes
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(resumo.totalPendente)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Saldo
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(resumo.saldo)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">
                Período
              </label>
              <select
                id="periodo"
                name="periodo"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <option value="mes">Último mês</option>
                <option value="trimestre">Último trimestre</option>
                <option value="semestre">Último semestre</option>
                <option value="ano">Último ano</option>
                <option value="todos">Todo o período</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          
          <div className="relative max-w-xs w-full">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Buscar transações"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de transações */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referência
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransacoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                ) : (
                  filteredTransacoes.map((transacao) => (
                    <tr key={transacao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {formatDate(transacao.data)}
                        </div>
                        {transacao.vencimento && (
                          <div className="text-xs">
                            Venc.: {formatDate(transacao.vencimento)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {transacao.descricao}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transacao.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transacao.referencia || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transacao.status)}`}>
                          {transacao.status.charAt(0).toUpperCase() + transacao.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {transacao.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transacao.valor)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Próximas etapas - em desenvolvimento */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Módulo em desenvolvimento
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Estamos trabalhando para adicionar funcionalidades como:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Geração de boletos para pagamento</li>
                <li>Fatura detalhada por serviço</li>
                <li>Gráficos de desempenho financeiro</li>
                <li>Integração com sistemas de pagamento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financeiro; 