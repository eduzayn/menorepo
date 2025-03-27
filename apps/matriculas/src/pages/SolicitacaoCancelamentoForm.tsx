import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSolicitarCancelamento } from '../hooks/useCancelamento'
import { MotivoCancelamento, SolicitacaoCancelamentoForm } from '../types/matricula'

export function SolicitacaoCancelamentoFormPage() {
  const { matriculaId } = useParams<{ matriculaId: string }>()
  const navigate = useNavigate()
  
  // Hook para solicitar cancelamento
  const { mutate: solicitarCancelamento, isLoading } = useSolicitarCancelamento()
  
  // Estado do formulário
  const [formState, setFormState] = useState<SolicitacaoCancelamentoForm>({
    motivo: 'outros',
    descricao: ''
  })
  
  // Função para lidar com mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Função para enviar a solicitação
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!matriculaId) return
    
    solicitarCancelamento(
      { matriculaId, dados: formState },
      {
        onSuccess: () => {
          navigate('/minhas-matriculas')
        }
      }
    )
  }
  
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Solicitar Cancelamento de Matrícula</h1>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-yellow-800 font-medium mb-2">Importante</h2>
          <p className="text-yellow-700 text-sm">
            Antes de prosseguir com o cancelamento, lembre-se que esta ação pode ter implicações financeiras e acadêmicas.
            Recomendamos que você verifique o contrato e entre em contato com a secretaria acadêmica caso tenha dúvidas.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do cancelamento
            </label>
            <select
              name="motivo"
              value={formState.motivo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Selecione um motivo</option>
              <option value="financeiro">Financeiro</option>
              <option value="insatisfacao_curso">Insatisfação com o curso</option>
              <option value="insatisfacao_atendimento">Insatisfação com atendimento</option>
              <option value="transferencia_instituicao">Transferência para outra instituição</option>
              <option value="problemas_pessoais">Problemas pessoais</option>
              <option value="mudanca_cidade">Mudança de cidade</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descreva em detalhes o motivo do cancelamento
            </label>
            <textarea
              name="descricao"
              value={formState.descricao}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg h-32"
              placeholder="Forneça detalhes adicionais sobre o motivo do cancelamento..."
              required
              minLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo de 10 caracteres. Forneça informações detalhadas para nos ajudar a entender sua situação.
            </p>
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="confirmacao"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="confirmacao" className="ml-2 block text-sm text-gray-700">
              Confirmo que li e estou ciente das consequências do cancelamento conforme o contrato
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/minhas-matriculas')}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              disabled={isLoading}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando solicitação...' : 'Solicitar Cancelamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 