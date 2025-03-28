import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { documentoService } from '../../services/documentoService';
import { formatDate } from '../../utils/formatters';

type Documento = {
  id: string;
  aluno_id: string;
  tipo: string;
  nome_arquivo: string;
  url: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  observacao?: string;
  created_at: string;
  updated_at: string;
};

type DocumentoListProps = {
  alunoId?: string;
  readOnly?: boolean;
  showTitle?: boolean;
};

export const DocumentosList = ({ alunoId, readOnly = false, showTitle = true }: DocumentoListProps) => {
  const { id } = useParams<{ id: string }>();
  const currentAlunoId = alunoId || id;
  
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAlunoId) {
      setLoading(false);
      setError('ID do aluno não fornecido.');
      return;
    }

    const fetchDocumentos = async () => {
      try {
        const data = await documentoService.listarDocumentos(currentAlunoId);
        setDocumentos(data);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Não foi possível carregar os documentos do aluno.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, [currentAlunoId]);

  const handleStatusChange = async (documentoId: string, newStatus: 'aprovado' | 'rejeitado', observacao: string = '') => {
    try {
      await documentoService.atualizarStatusDocumento(documentoId, { status: newStatus, observacao });
      
      // Atualiza o estado local
      setDocumentos(
        documentos.map((doc) =>
          doc.id === documentoId ? { ...doc, status: newStatus, observacao } : doc
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status do documento:', error);
      alert('Não foi possível atualizar o status do documento.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Aprovado
          </span>
        );
      case 'rejeitado':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      {showTitle && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Documentos do Aluno</h2>
          {!readOnly && (
            <Link
              to={`/documentos/${currentAlunoId}/novo`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Adicionar Documento
            </Link>
          )}
        </div>
      )}

      {documentos.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Nenhum documento encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Arquivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {!readOnly && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentos.map((documento) => (
                <tr key={documento.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {documento.tipo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={documento.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      {documento.nome_arquivo}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(documento.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusBadge(documento.status)}
                      {documento.observacao && (
                        <span className="ml-2 cursor-help" title={documento.observacao}>
                          ℹ️
                        </span>
                      )}
                    </div>
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {documento.status === 'pendente' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(documento.id, 'aprovado')}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => {
                              const observacao = prompt('Motivo da rejeição:');
                              if (observacao !== null) {
                                handleStatusChange(documento.id, 'rejeitado', observacao);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Rejeitar
                          </button>
                        </>
                      )}
                      
                      {documento.status !== 'pendente' && (
                        <button
                          onClick={() => handleStatusChange(documento.id, 'pendente', '')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Voltar para Pendente
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 