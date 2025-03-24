import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@edunexia/ui-components'
import { useState, useEffect } from 'react'
import { Matricula } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'

export function MatriculaDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState<Matricula | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatricula = async () => {
      try {
        if (!id) return
        const data = await matriculaService.buscarMatricula(id)
        setMatricula(data)
      } catch (err) {
        setError('Erro ao carregar os detalhes da matrícula')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatricula()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    )
  }

  if (!matricula) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Matrícula não encontrada</p>
        <Button onClick={() => navigate('/matriculas')} variant="secondary" className="mt-4">
          Voltar para lista
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Detalhes da Matrícula</h2>
        <Button onClick={() => navigate('/matriculas')} variant="secondary">
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Aluno</h3>
          <p className="text-gray-600">{matricula.nomeAluno}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Curso</h3>
          <p className="text-gray-600">{matricula.nomeCurso}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Data da Matrícula</h3>
          <p className="text-gray-600">
            {new Date(matricula.dataMatricula).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Status</h3>
          <p className="text-gray-600">{matricula.status}</p>
        </div>
      </div>

      {matricula.status === 'ativa' && (
        <div className="mt-8">
          <Button
            onClick={async () => {
              try {
                await matriculaService.cancelarMatricula(matricula.id)
                navigate('/matriculas')
              } catch (err) {
                setError('Erro ao cancelar matrícula')
                console.error('Erro:', err)
              }
            }}
            variant="danger"
          >
            Cancelar Matrícula
          </Button>
        </div>
      )}
    </div>
  )
} 