import React, { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useListarSolicitacoesCancelamento, useProcessarCancelamentosAutomaticos } from '../hooks/useCancelamento'
import { StatusSolicitacaoCancelamento } from '../types/matricula'
import { Link } from 'react-router-dom'

// Componente principal da página de solicitações de cancelamento
export function SolicitacoesCancelamentoPage() {
  // Estados para filtros
  const [filtros, setFiltros] = useState<{
    status?: StatusSolicitacaoCancelamento
    dataInicio?: string
    dataFim?: string
    page: number
    perPage: number
  }>({
    page: 1,
    perPage: 10
  })

  // Consulta de solicitações de cancelamento
  const { 
    data: solicitacoes, 
    isLoading, 
    isError, 
    error 
  } = useListarSolicitacoesCancelamento(filtros)

  // Mutação para processamento automático
  const { 
    mutate: processarCancelamentosAutomaticos, 
    isLoading: isProcessando 
  } = useProcessarCancelamentosAutomaticos()

  // Função para alterar status do filtro
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setFiltros(prev => ({
      ...prev,
      status: value === 'todos' ? undefined : value as StatusSolicitacaoCancelamento,
      page: 1
    }))
  }

  // Função para alterar datas do filtro
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFiltros(prev => ({
      ...prev,
      [name]: value || undefined,
      page: 1
    }))
  }

  // Função para alterar página
  const handlePageChange = (newPage: number) => {
    setFiltros(prev => ({
      ...prev,
      page: newPage
    }))
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }

  // Tradução de status
  const getStatusLabel = (status: StatusSolicitacaoCancelamento) => {
    switch (status) {
      case 'pendente': return 'Pendente'
      case 'aprovada': return 'Aprovada'
      case 'negada': return 'Negada'
      case 'expirada': return 'Expirada'
      default: return status
    }
  }

  // Classe de cor de acordo com o status
  const getStatusColorClass = (status: StatusSolicitacaoCancelamento) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'aprovada': return 'bg-green-100 text-green-800'
      case 'negada': return 'bg-red-100 text-red-800'
      case 'expirada': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Tradução do motivo
  const getMotivo = (motivo: string) => {
    switch (motivo) {
      case 'financeiro': return 'Financeiro'
      case 'insatisfacao_curso': return 'Insatisfação com o curso'
      case 'insatisfacao_atendimento': return 'Insatisfação com atendimento'
      case 'transferencia_instituicao': return 'Transferência para outra instituição'
      case 'problemas_pessoais': return 'Problemas pessoais'
      case 'mudanca_cidade': return 'Mudança de cidade'
      case 'outros': return 'Outros'
      default: return motivo
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Solicitações de Cancelamento</h1>
          <div className="flex gap-3">
            <button
              onClick={() => processarCancelamentosAutomaticos()}
              disabled={isProcessando}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessando ? 'Processando...' : 'Processar Cancelamentos Automáticos'}
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filtros.status || 'todos'}
              onChange={handleStatusChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="negada">Negada</option>
              <option value="expirada">Expirada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              name="dataInicio"
              value={filtros.dataInicio || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              name="dataFim"
              value={filtros.dataFim || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFiltros({ page: 1, perPage: 10 })}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Tabela de solicitações */}
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Carregando solicitações...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500">Erro ao carregar solicitações: {(error as Error)?.message || 'Erro desconhecido'}</p>
          </div>
        ) : solicitacoes?.data?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhuma solicitação de cancelamento encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Solicitação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitacoes?.data?.map((solicitacao) => (
                    <tr key={solicitacao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {solicitacao.alunos?.nome || `Aluno ${solicitacao.aluno_id.substring(0, 8)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {solicitacao.matriculas?.curso?.nome || 'Curso não informado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getMotivo(solicitacao.motivo)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(solicitacao.data_solicitacao)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(solicitacao.status)}`}>
                          {getStatusLabel(solicitacao.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/solicitacoes-cancelamento/${solicitacao.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Visualizar
                        </Link>
                        {solicitacao.status === 'pendente' && (
                          <Link 
                            to={`/solicitacoes-cancelamento/${solicitacao.id}/analisar`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Analisar
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {solicitacoes?.meta?.pageCount > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Mostrando {(filtros.page - 1) * filtros.perPage + 1} a{' '}
                  {Math.min(filtros.page * filtros.perPage, solicitacoes.meta.total)} de{' '}
                  {solicitacoes.meta.total} resultados
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(filtros.page - 1)}
                    disabled={filtros.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(filtros.page + 1)}
                    disabled={filtros.page >= solicitacoes.meta.pageCount}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 