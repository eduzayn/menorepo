import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cursoService } from '../../services/cursoService'
import { Curso } from '@edunexia/database-schema'
import { Button } from '@edunexia/ui-components'
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export function CursoDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCurso()
  }, [id])

  const loadCurso = async () => {
    try {
      setLoading(true)
      const data = await cursoService.buscarCurso(id!)
      setCurso(data)
    } catch (err) {
      setError('Erro ao carregar curso')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!curso) {
    return <div>Curso não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/cursos')}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{curso.nome}</h1>
        </div>
        <Button
          onClick={() => navigate(`/cursos/${curso.id}/editar`)}
          className="flex items-center space-x-2"
        >
          <PencilIcon className="h-5 w-5" />
          <span>Editar</span>
        </Button>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Descrição</h2>
            <p className="mt-1 text-sm text-gray-900">{curso.descricao || '-'}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Modalidade</h2>
            <p className="mt-1 text-sm text-gray-900 capitalize">{curso.modalidade}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Carga Horária</h2>
            <p className="mt-1 text-sm text-gray-900">{curso.carga_horaria} horas</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Duração</h2>
            <p className="mt-1 text-sm text-gray-900">{curso.duracao_meses} meses</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Status</h2>
            <p className="mt-1">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                curso.status === 'ativo' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {curso.status}
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Data de Criação</h2>
            <p className="mt-1 text-sm text-gray-900">
              {curso.created_at ? new Date(curso.created_at).toLocaleDateString() : '-'}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Última Atualização</h2>
            <p className="mt-1 text-sm text-gray-900">
              {curso.updated_at ? new Date(curso.updated_at).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 