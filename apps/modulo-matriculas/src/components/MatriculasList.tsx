import { useState, useEffect } from 'react'
import { Button } from '@edunexia/ui-components'
import { Matricula } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'

export function MatriculasList() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const data = await matriculaService.listarMatriculas()
        setMatriculas(data)
      } catch (err) {
        setError('Erro ao carregar matrículas. Por favor, tente novamente.')
        console.error('Erro ao buscar matrículas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatriculas()
  }, [])

  const handleCancelarMatricula = async (id: string) => {
    try {
      await matriculaService.cancelarMatricula(id)
      setMatriculas(matriculas.map(m => 
        m.id === id ? { ...m, status: 'cancelada' } : m
      ))
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

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Curso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Período
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Matrícula
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {matriculas.map((matricula) => (
            <tr key={matricula.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{matricula.nome}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{matricula.curso}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{matricula.periodo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  matricula.status === 'ativa' ? 'bg-green-100 text-green-800' :
                  matricula.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {matricula.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(matricula.dataMatricula).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button variant="secondary" className="mr-2">
                  Editar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleCancelarMatricula(matricula.id)}
                  disabled={matricula.status === 'cancelada'}
                >
                  Cancelar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 