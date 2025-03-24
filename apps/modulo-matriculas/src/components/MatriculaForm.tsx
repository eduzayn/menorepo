import { useState } from 'react'
import { Button } from '@edunexia/ui-components'
import { MatriculaFormData } from '../types/matricula'
import { matriculaService } from '../services/matriculaService'

export function MatriculaForm() {
  const [formData, setFormData] = useState<MatriculaFormData>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    endereco: '',
    curso: '',
    periodo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await matriculaService.criarMatricula(formData)
      // TODO: Implementar feedback de sucesso e redirecionamento
      console.log('Matrícula criada com sucesso!')
    } catch (err) {
      setError('Erro ao criar matrícula. Por favor, tente novamente.')
      console.error('Erro ao criar matrícula:', err)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="curso" className="block text-sm font-medium text-gray-700">
            Curso
          </label>
          <select
            id="curso"
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecione um curso</option>
            <option value="informatica">Informática</option>
            <option value="administracao">Administração</option>
            <option value="contabilidade">Contabilidade</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">
            Período
          </label>
          <select
            id="periodo"
            name="periodo"
            value={formData.periodo}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecione um período</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Processando...' : 'Realizar Matrícula'}
        </Button>
      </div>
    </form>
  )
} 