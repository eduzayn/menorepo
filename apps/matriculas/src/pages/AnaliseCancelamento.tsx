import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useObterSolicitacaoCancelamento, useAnalisarSolicitacaoCancelamento } from '../hooks/useCancelamento'
import { AnaliseCancelamentoForm } from '../types/matricula'

export function AnaliseCancelamentoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // Obter detalhes da solicitação
  const { 
    data: solicitacao, 
    isLoading, 
    isError, 
    error 
  } = useObterSolicitacaoCancelamento(id || '')
  
  // Hooks para análise
  const { 
    mutate: analisarSolicitacao, 
    isLoading: isAnalisando 
  } = useAnalisarSolicitacaoCancelamento()
  
  // Estado do formulário
  const [formState, setFormState] = useState<AnaliseCancelamentoForm>({
    status: 'aprovada',
    observacoes: ''
  })
  
  // Função para lidar com mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) return
    
    // Analisar a solicitação
    analisarSolicitacao(
      { id, analise: formState },
      {
        onSuccess: () => {
          navigate('/solicitacoes-cancelamento')
        }
      }
    )
  }
  
  // Função para formatar a data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }
  
  // Tradução do motivo
  const getMotivo = (motivo?: string) => {
    if (!motivo) return 'N/A'
    
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
  
  // Se estiver carregando
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-10">
            <p className="text-gray-500">Carregando detalhes da solicitação...</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Se ocorreu um erro
  if (isError || !solicitacao) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-10">
            <p className="text-red-500">
              Erro ao carregar detalhes da solicitação: {(error as Error)?.message || 'Solicitação não encontrada'}
            </p>
            <button
              onClick={() => navigate('/solicitacoes-cancelamento')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Voltar para a lista
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Se a solicitação não estiver pendente
  if (solicitacao.status !== 'pendente') {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-10">
            <p className="text-yellow-500">
              Esta solicitação já foi analisada e não pode ser modificada
            </p>
            <button
              onClick={() => navigate('/solicitacoes-cancelamento')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Voltar para a lista
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Análise de Solicitação de Cancelamento</h1>
          <button
            onClick={() => navigate('/solicitacoes-cancelamento')}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            Voltar
          </button>
        </div>
        
        {/* Detalhes da solicitação */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Solicitação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Aluno</p>
              <p className="text-base font-medium">
                {solicitacao.alunos?.nome || `Aluno ${solicitacao.aluno_id.substring(0, 8)}`}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Curso</p>
              <p className="text-base font-medium">
                {solicitacao.matriculas?.curso?.nome || 'Curso não informado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Data da Solicitação</p>
              <p className="text-base font-medium">
                {formatDate(solicitacao.data_solicitacao)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Motivo</p>
              <p className="text-base font-medium">
                {getMotivo(solicitacao.motivo)}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">Descrição</p>
            <p className="text-base mt-1 p-2 bg-white border border-gray-200 rounded-lg">
              {solicitacao.descricao || 'Nenhuma descrição fornecida'}
            </p>
          </div>
        </div>
        
        {/* Formulário de análise */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Análise</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decisão
            </label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="aprovada">Aprovar Cancelamento</option>
              <option value="negada">Negar Cancelamento</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formState.observacoes}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg h-32"
              placeholder="Informe os motivos para a sua decisão..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/solicitacoes-cancelamento')}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 mr-2"
              disabled={isAnalisando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 font-medium rounded-lg ${
                formState.status === 'aprovada'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              disabled={isAnalisando}
            >
              {isAnalisando 
                ? 'Processando...' 
                : formState.status === 'aprovada' 
                  ? 'Aprovar Cancelamento' 
                  : 'Negar Cancelamento'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 