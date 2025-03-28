import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@edunexia/ui-components'
import { MatriculaDetalhada } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'

export function MatriculasList() {
  const navigate = useNavigate()
  const [matriculas, setMatriculas] = useState<MatriculaDetalhada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const data = await matriculaService.listarMatriculas()
        setMatriculas(data)
      } catch (err) {
        setError('Erro ao carregar as matrículas')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatriculas()
  }, [])

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

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Matrículas</h2>
          <Button onClick={() => navigate('/matriculas/nova')} variant="primary">
            Nova Matrícula
          </Button>
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {matriculas.map((matricula) => (
          <li
            key={matricula.id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/matriculas/${matricula.id}`)}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{matricula.nomeAluno}</div>
                  <div className="text-sm text-gray-500">ID: {matricula.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-900">{matricula.nomeCurso}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(matricula.dataMatricula).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    matricula.status === 'ativa'
                      ? 'bg-green-100 text-green-800'
                      : matricula.status === 'pendente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {matricula.status}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 