import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Download, Eye, Search, Filter } from 'lucide-react';

// Tipo simulado para cobranças
interface Cobranca {
  id: string;
  aluno: string;
  valor: number;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  vencimento: string;
  curso: string;
  metodo_pagamento?: string;
  created_at: string;
}

// Dados simulados
const cobrancasSimuladas: Cobranca[] = [
  {
    id: 'cob-001',
    aluno: 'Ana Silva',
    valor: 549.90,
    status: 'pago',
    vencimento: '2023-03-15',
    curso: 'Gestão Empresarial',
    metodo_pagamento: 'cartao',
    created_at: '2023-02-15T10:30:00Z'
  },
  {
    id: 'cob-002',
    aluno: 'Carlos Oliveira',
    valor: 349.90,
    status: 'pendente',
    vencimento: '2023-04-10',
    curso: 'Marketing Digital',
    created_at: '2023-03-10T14:20:00Z'
  },
  {
    id: 'cob-003',
    aluno: 'Mariana Costa',
    valor: 179.90,
    status: 'vencido',
    vencimento: '2023-03-28',
    curso: 'Excel Avançado',
    created_at: '2023-02-28T09:15:00Z'
  },
  {
    id: 'cob-004',
    aluno: 'Pedro Santos',
    valor: 449.90,
    status: 'pendente',
    vencimento: '2023-04-15',
    curso: 'Python para Análise de Dados',
    created_at: '2023-03-15T16:45:00Z'
  },
  {
    id: 'cob-005',
    aluno: 'Juliana Mendes',
    valor: 299.90,
    status: 'cancelado',
    vencimento: '2023-03-20',
    curso: 'Design Gráfico',
    created_at: '2023-02-20T11:10:00Z'
  }
];

// Componentes para Status Badge
function StatusBadge({ status }: { status: Cobranca['status'] }) {
  const statusConfig = {
    pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
    pago: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pago' },
    vencido: { bg: 'bg-red-100', text: 'text-red-800', label: 'Vencido' },
    cancelado: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelado' }
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`${config.bg} ${config.text} text-xs px-2 py-1 rounded-full font-medium`}>
      {config.label}
    </span>
  );
}

export default function CobrancasPage() {
  const [termoBusca, setTermoBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('todos');
  
  // Filtrar cobranças baseado no termo de busca e status
  const cobrancarFiltradas = cobrancasSimuladas.filter(cobranca => {
    const matchesTermo = cobranca.aluno.toLowerCase().includes(termoBusca.toLowerCase()) || 
                        cobranca.curso.toLowerCase().includes(termoBusca.toLowerCase()) ||
                        cobranca.id.toLowerCase().includes(termoBusca.toLowerCase());
                        
    const matchesStatus = statusFiltro === 'todos' || cobranca.status === statusFiltro;
    
    return matchesTermo && matchesStatus;
  });
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cobranças</h1>
          <p className="text-gray-500">
            Gerencie as cobranças geradas para os alunos
          </p>
        </div>
        
        <Link 
          to="/cobrancas/nova"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Nova Cobrança
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="p-4 mb-6 border rounded-lg bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por aluno, curso ou ID..."
              className="w-full p-2 pl-8 border rounded-md"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <select
              className="w-full p-2 border rounded-md"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="vencido">Vencido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            Mais Filtros
          </button>
        </div>
      </div>
      
      {/* Tabela de cobranças */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Aluno</th>
              <th className="border p-2 text-left">Curso</th>
              <th className="border p-2 text-left">Valor</th>
              <th className="border p-2 text-left">Vencimento</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cobrancarFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-4 text-center text-gray-500">
                  Nenhuma cobrança encontrada.
                </td>
              </tr>
            ) : (
              cobrancarFiltradas.map(cobranca => (
                <tr key={cobranca.id}>
                  <td className="border p-2 font-mono text-xs">{cobranca.id}</td>
                  <td className="border p-2">{cobranca.aluno}</td>
                  <td className="border p-2">{cobranca.curso}</td>
                  <td className="border p-2">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cobranca.valor)}
                  </td>
                  <td className="border p-2">
                    {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="border p-2">
                    <StatusBadge status={cobranca.status} />
                  </td>
                  <td className="border p-2">
                    <div className="flex justify-center space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Download className="h-4 w-4 text-green-600" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <FileText className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginação */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Exibindo {cobrancarFiltradas.length} de {cobrancasSimuladas.length} cobranças
        </p>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Anterior
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            1
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
} 