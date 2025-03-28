import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { contratoService } from '../../services/contratoService';
import { formatDate } from '../../utils/formatters';

type Contrato = {
  id: string;
  aluno_id: string;
  matricula_id: string;
  html_content: string;
  assinado: boolean;
  data_assinatura?: string;
  created_at: string;
  updated_at: string;
};

type ContratosListProps = {
  alunoId?: string;
  matriculaId?: string;
};

export const ContratosList = ({ alunoId, matriculaId }: ContratosListProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Se não receber props, tenta usar o id da URL como alunoId
  const effectiveAlunoId = alunoId || id;
  
  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const data = await contratoService.buscarContratos(matriculaId, effectiveAlunoId);
        setContratos(data);
      } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        setError('Não foi possível carregar os contratos.');
      } finally {
        setLoading(false);
      }
    };

    fetchContratos();
  }, [matriculaId, effectiveAlunoId]);

  const handleGerarNovoContrato = async () => {
    if (!alunoId && !matriculaId) {
      alert('É necessário informar o aluno ou matrícula para gerar um contrato.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Gerar HTML do contrato
      const htmlContent = await contratoService.gerarContratoHTML(matriculaId || '');
      
      // Criar novo contrato
      const novoContrato: Partial<Contrato> = {
        aluno_id: alunoId || '',
        matricula_id: matriculaId || '',
        html_content: htmlContent,
        assinado: false
      };
      
      const contratoGerado = await contratoService.criarContrato(novoContrato);
      
      // Adicionar à lista
      setContratos([contratoGerado, ...contratos]);
      
      // Redirecionar para o contrato gerado
      navigate(`/contratos/${contratoGerado.id}`);
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      alert('Não foi possível gerar o contrato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (contratos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-6 text-center">
        <p className="text-gray-600 mb-4">Nenhum contrato disponível.</p>
        {(alunoId || matriculaId) && (
          <button
            onClick={handleGerarNovoContrato}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Novo Contrato'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium text-gray-800">Contratos</h2>
        {(alunoId || matriculaId) && (
          <button
            onClick={handleGerarNovoContrato}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Novo Contrato'}
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Assinatura
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contratos.map((contrato) => (
              <tr key={contrato.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(contrato.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contrato.assinado ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Assinado
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendente
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contrato.data_assinatura ? formatDate(contrato.data_assinatura) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/contratos/${contrato.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Visualizar
                  </Link>
                  {!contrato.assinado && (
                    <Link
                      to={`/contratos/${contrato.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Assinar
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 