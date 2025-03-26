import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cursoService } from '../../services/cursoService'
import { CursoFormData } from '@edunexia/database-schema'
import { Button, Input, Textarea, Select } from '@edunexia/ui-components'

export function CursoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [curso, setCurso] = useState<CursoFormData>({
    nome: '',
    descricao: '',
    modalidade: 'presencial',
    carga_horaria: 0,
    duracao_meses: 0,
    status: 'ativo',
    coordenador_id: '',
    institution_id: ''
  })

  useEffect(() => {
    if (id) {
      loadCurso()
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (id) {
        await cursoService.atualizarCurso(id, curso)
      } else {
        await cursoService.criarCurso(curso)
      }
      navigate('/cursos')
    } catch (err) {
      setError('Erro ao salvar curso')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurso(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Editar Curso' : 'Novo Curso'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/cursos')}>
          Cancelar
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome do Curso
          </label>
          <Input
            type="text"
            name="nome"
            id="nome"
            value={curso.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <Textarea
            name="descricao"
            id="descricao"
            value={curso.descricao}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="modalidade" className="block text-sm font-medium text-gray-700">
            Modalidade
          </label>
          <Select
            name="modalidade"
            id="modalidade"
            value={curso.modalidade}
            onChange={handleChange}
            required
          >
            <option value="presencial">Presencial</option>
            <option value="ead">EAD</option>
            <option value="hibrido">Híbrido</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="carga_horaria" className="block text-sm font-medium text-gray-700">
              Carga Horária (horas)
            </label>
            <Input
              type="number"
              name="carga_horaria"
              id="carga_horaria"
              value={curso.carga_horaria}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="duracao_meses" className="block text-sm font-medium text-gray-700">
              Duração (meses)
            </label>
            <Input
              type="number"
              name="duracao_meses"
              id="duracao_meses"
              value={curso.duracao_meses}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            name="status"
            id="status"
            value={curso.status}
            onChange={handleChange}
            required
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  )
} 