import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planoService } from '../../services/planoService';
import { formatCurrency } from '../../utils/formatters';

type Plano = {
  id: string;
  nome: string;
  valor_total: number;
  num_parcelas: number;
  entrada: number;
  curso_id: string;
  curso_nome?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export const PlanosList = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const data = await planoService.listarPlanos();
        setPlanos(data);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const planosFiltrados = planos.filter(
    (plano) =>
      plano.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      plano.curso_nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleExcluir = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      try {
        await planoService.excluirPlano(id);
        setPlanos(planos.filter((plano) => plano.id !== id));
      } catch (error) {
        console.error('Erro ao excluir plano:', error);
        alert('Não foi possível excluir o plano. Verifique se não há matrículas vinculadas.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Planos de Pagamento</h1>
        <Link
          to="/planos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Novo Plano
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar planos..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : planosFiltrados.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhum plano encontrado.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planosFiltrados.map((plano) => (
                <tr key={plano.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{plano.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{plano.curso_nome || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatCurrency(plano.valor_total)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{plano.num_parcelas}x</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plano.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/planos/${plano.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Detalhes
                    </Link>
                    <Link
                      to={`/planos/${plano.id}/editar`}
                      className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluir(plano.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 