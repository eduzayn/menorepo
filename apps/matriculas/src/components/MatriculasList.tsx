import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Spinner } from '@edunexia/ui-components'
import { MatriculaDetalhada } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'
import { BuscaAvancadaMatriculas } from './matricula/BuscaAvancadaMatriculas'
import { formatDate } from '../utils/formatters'

export function MatriculasList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [matriculas, setMatriculas] = useState<MatriculaDetalhada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalMatriculas, setTotalMatriculas] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  useEffect(() => {
    const fetchMatriculas = async () => {
      setLoading(true)
      try {
        // Constrói os filtros a partir dos parâmetros da URL
        const filtros = {
          alunoId: searchParams.get('alunoId') || undefined,
          cursoId: searchParams.get('cursoId') || undefined,
          status: searchParams.get('status') || undefined,
          dataInicio: searchParams.get('dataInicio') || undefined,
          dataFim: searchParams.get('dataFim') || undefined,
          page: page,
          perPage: perPage
        }

        const response = await matriculaService.listarMatriculas(filtros)
        setMatriculas(response.items)
        setTotalMatriculas(response.total)
      } catch (err) {
        setError('Erro ao carregar as matrículas')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatriculas()
  }, [searchParams, page, perPage])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativa':
        return 'bg-green-100 text-green-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      case 'trancada':
        return 'bg-blue-100 text-blue-800'
      case 'concluida':
        return 'bg-purple-100 text-purple-800'
      case 'inadimplente':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Matrículas</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/matriculas/nova')}
          >
            Nova Matrícula
          </Button>
          <Button 
            onClick={() => navigate('/matriculas/nova-assistente')}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Nova Matrícula (Assistente)
          </Button>
        </div>
      </div>

      <BuscaAvancadaMatriculas />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : matriculas.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma matrícula encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não foram encontradas matrículas com os filtros selecionados.
            </p>
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/matriculas/nova-assistente')}
              >
                Criar Nova Matrícula
              </Button>
            </div>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matriculas.map((matricula) => (
                  <tr 
                    key={matricula.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/matriculas/${matricula.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {matricula.aluno.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{matricula.aluno.nome}</div>
                          <div className="text-sm text-gray-500">{matricula.aluno.cpf}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{matricula.curso.nome}</div>
                      <div className="text-sm text-gray-500">{matricula.curso.modalidade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(matricula.dataInicio.toString())}</div>
                      {matricula.dataFim && (
                        <div className="text-sm text-gray-500">Até: {formatDate(matricula.dataFim.toString())}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(matricula.status)}`}>
                        {matricula.status.charAt(0).toUpperCase() + matricula.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/matriculas/${matricula.id}`);
                        }}
                      >
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page * perPage >= totalMatriculas}
                >
                  Próximo
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(page - 1) * perPage + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(page * perPage, totalMatriculas)}
                    </span>{' '}
                    de <span className="font-medium">{totalMatriculas}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md text-gray-500"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      <span className="sr-only">Anterior</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    {/* Números de página - simplificado para economizar espaço */}
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white">
                      Página {page}
                    </span>
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md text-gray-500"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page * perPage >= totalMatriculas}
                    >
                      <span className="sr-only">Próximo</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 