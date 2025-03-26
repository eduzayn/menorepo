import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cursoService } from '../../services/cursoService'
import { Curso } from '@edunexia/database-schema'
import { Button } from '@edunexia/ui-components'
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline'

export function CursosList() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCursos()
  }, [])

  const loadCursos = async () => {
    try {
      setLoading(true)
      const data = await cursoService.listarCursos()
      setCursos(data)
    } catch (err) {
      setError('Erro ao carregar cursos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Carregando cursos...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
        <Link to="/cursos/novo">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Curso
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Descrição</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Duração</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  {curso.nome}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {curso.descricao}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {curso.duracao_meses} meses
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    curso.status === 'ativo' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {curso.status}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/cursos/${curso.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/cursos/${curso.id}/editar`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 