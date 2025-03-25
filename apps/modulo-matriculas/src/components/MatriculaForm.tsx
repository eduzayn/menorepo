import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select } from '@edunexia/ui-components'
import { MatriculaFormData } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'

export function MatriculaForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<MatriculaFormData>({
    aluno_id: '',
    curso_id: '',
    plano_id: '',
    data_inicio: '',
    data_conclusao_prevista: '',
    status: 'pendente',
    observacoes: null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await matriculaService.criarMatricula(formData)
      navigate('/matriculas')
    } catch (err) {
      setError('Erro ao criar matrícula')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nova Matrícula</h1>
        <Button variant="outline" onClick={() => navigate('/matriculas')}>
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
          <label htmlFor="aluno_id" className="block text-sm font-medium text-gray-700">
            ID do Aluno
          </label>
          <Input
            type="text"
            name="aluno_id"
            id="aluno_id"
            value={formData.aluno_id}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="curso_id" className="block text-sm font-medium text-gray-700">
            ID do Curso
          </label>
          <Input
            type="text"
            name="curso_id"
            id="curso_id"
            value={formData.curso_id}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="plano_id" className="block text-sm font-medium text-gray-700">
            ID do Plano
          </label>
          <Input
            type="text"
            name="plano_id"
            id="plano_id"
            value={formData.plano_id}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
            Data de Início
          </label>
          <Input
            type="date"
            name="data_inicio"
            id="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="data_conclusao_prevista" className="block text-sm font-medium text-gray-700">
            Data de Conclusão Prevista
          </label>
          <Input
            type="date"
            name="data_conclusao_prevista"
            id="data_conclusao_prevista"
            value={formData.data_conclusao_prevista}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pendente">Pendente</option>
            <option value="ativa">Ativa</option>
            <option value="cancelada">Cancelada</option>
            <option value="trancada">Trancada</option>
            <option value="concluida">Concluída</option>
          </Select>
        </div>

        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <Input
            type="text"
            name="observacoes"
            id="observacoes"
            value={formData.observacoes || ''}
            onChange={handleChange}
          />
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