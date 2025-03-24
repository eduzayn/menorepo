import { useState, useEffect } from 'react'
import { Button } from '@edunexia/ui-components'
import { Matricula, MatriculaDetailsProps } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'

export function MatriculaDetails({ matriculaId, onClose }: MatriculaDetailsProps) {
  const [matricula, setMatricula] = useState<Matricula | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implementar integração com Supabase
    const fetchMatriculaDetails = async () => {
      try {
        // Simulação de dados
        const mockData: Matricula = {
          id: matriculaId,
          nome: 'João Silva',
          cpf: '123.456.789-00',
          dataNascimento: '1990-01-01',
          email: 'joao.silva@email.com',
          telefone: '(11) 99999-9999',
          endereco: 'Rua das Flores, 123 - São Paulo, SP',
          curso: 'Informática',
          periodo: 'Manhã',
          status: 'ativa',
          dataMatricula: '2024-03-20',
          observacoes: 'Aluno com necessidades especiais'
        }
        setMatricula(mockData)
      } catch (error) {
        console.error('Erro ao buscar detalhes da matrícula:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatriculaDetails()
  }, [matriculaId])

  const handleCancelarMatricula = async () => {
    if (!matricula) return

    try {
      await matriculaService.cancelarMatricula(matricula.id)
      setMatricula({ ...matricula, status: 'cancelada' })
    } catch (err) {
      console.error('Erro ao cancelar matrícula:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!matricula) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Matrícula não encontrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Detalhes da Matrícula</h2>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CPF</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.cpf}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Nascimento</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(matricula.dataNascimento).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contato</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">E-mail</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.telefone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Endereço</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.endereco}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Matrícula</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Curso</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.curso}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Período</dt>
              <dd className="mt-1 text-sm text-gray-900">{matricula.periodo}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  matricula.status === 'ativa' ? 'bg-green-100 text-green-800' :
                  matricula.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {matricula.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data de Matrícula</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(matricula.dataMatricula).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </div>

        {matricula.observacoes && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
            <p className="text-sm text-gray-900">{matricula.observacoes}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary">
          Editar
        </Button>
        <Button 
          variant="outline"
          onClick={handleCancelarMatricula}
          disabled={matricula.status === 'cancelada'}
        >
          Cancelar Matrícula
        </Button>
      </div>
    </div>
  )
} 