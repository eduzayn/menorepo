import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { planoService } from '../../services/planoService';
import { formatCurrency, formatDate } from '../../utils/formatters';

type Plano = {
  id: string;
  nome: string;
  descricao?: string;
  valor_total: number;
  num_parcelas: number;
  entrada: number;
  curso_id: string;
  curso_nome?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export const PlanoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlano = async () => {
      try {
        const data = await planoService.buscarPlano(id!);
        setPlano(data);
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
        setError('Não foi possível carregar os detalhes do plano.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlano();
  }, [id]);

  const handleExcluir = async () => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      try {
        await planoService.excluirPlano(id!);
        navigate('/planos');
      } catch (error) {
        console.error('Erro ao excluir plano:', error);
        alert('Não foi possível excluir o plano. Verifique se não há matrículas vinculadas.');
      }
    }
  };

  const calculaValorParcela = () => {
    if (!plano) return 0;
    
    if (plano.entrada > 0 && plano.num_parcelas > 1) {
      return (plano.valor_total - plano.entrada) / (plano.num_parcelas - 1);
    }
    
    return plano.valor_total / plano.num_parcelas;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !plano) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error || 'Plano não encontrado.'}</p>
          <Link to="/planos" className="text-red-700 font-medium hover:underline">
            Voltar para lista de planos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{plano.nome}</h1>
        <div className="flex space-x-2">
          <Link
            to="/planos"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </Link>
          <Link
            to={`/planos/${id}/editar`}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Editar
          </Link>
          <button
            onClick={handleExcluir}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="p-6">
          <div className="mb-6 flex items-center">
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                plano.ativo
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {plano.ativo ? 'Ativo' : 'Inativo'}
            </span>
            {plano.curso_nome && (
              <span className="ml-4 text-sm text-gray-500">
                Curso: <span className="font-medium">{plano.curso_nome}</span>
              </span>
            )}
          </div>

          {plano.descricao && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Descrição</h3>
              <p className="text-gray-600 whitespace-pre-line">{plano.descricao}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informações Financeiras</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="font-medium">{formatCurrency(plano.valor_total)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">Número de Parcelas:</span>
                  <span className="font-medium">{plano.num_parcelas}x</span>
                </div>
                {plano.entrada > 0 && (
                  <div className="flex justify-between border-b border-gray-200 py-2">
                    <span className="text-gray-600">Valor de Entrada:</span>
                    <span className="font-medium">{formatCurrency(plano.entrada)}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">Valor da Parcela:</span>
                  <span className="font-medium">{formatCurrency(calculaValorParcela())}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informações do Registro</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">ID do Plano:</span>
                  <span className="font-mono text-sm">{plano.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">ID do Curso:</span>
                  <span className="font-mono text-sm">{plano.curso_id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">Criado em:</span>
                  <span>{formatDate(plano.created_at)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="text-gray-600">Última atualização:</span>
                  <span>{formatDate(plano.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 