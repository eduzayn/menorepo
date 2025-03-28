import { useState, useEffect } from 'react'
import { DashboardFilters } from '../../services/dashboardService'

interface DashboardFilterProps {
  filters: DashboardFilters
  onFilterChange: (filters: DashboardFilters) => void
  cursos: { id: string; nome: string }[]
  isLoading?: boolean
}

export const DashboardFilter = ({
  filters,
  onFilterChange,
  cursos,
  isLoading = false
}: DashboardFilterProps) => {
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [cursoId, setCursoId] = useState<string>('')
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes')

  // Inicializar valores dos filtros
  useEffect(() => {
    if (filters.dataInicio) {
      setDataInicio(filters.dataInicio.toISOString().split('T')[0])
    }
    
    if (filters.dataFim) {
      setDataFim(filters.dataFim.toISOString().split('T')[0])
    }
    
    if (filters.cursoId) {
      setCursoId(filters.cursoId)
    }
    
    if (filters.periodo) {
      setPeriodo(filters.periodo)
    }
  }, [filters])

  // Aplicar filtros
  const aplicarFiltros = () => {
    const novosFiltros: DashboardFilters = {
      ...filters,
      periodo
    }
    
    if (dataInicio) {
      novosFiltros.dataInicio = new Date(dataInicio)
    }
    
    if (dataFim) {
      novosFiltros.dataFim = new Date(dataFim)
    }
    
    if (cursoId) {
      novosFiltros.cursoId = cursoId
    } else {
      delete novosFiltros.cursoId
    }
    
    onFilterChange(novosFiltros)
  }

  // Limpar filtros
  const limparFiltros = () => {
    // Define um período padrão de 30 dias
    const dataFimPadrao = new Date()
    const dataInicioPadrao = new Date()
    dataInicioPadrao.setDate(dataInicioPadrao.getDate() - 30)
    
    setDataInicio(dataInicioPadrao.toISOString().split('T')[0])
    setDataFim(dataFimPadrao.toISOString().split('T')[0])
    setCursoId('')
    setPeriodo('mes')
    
    onFilterChange({
      dataInicio: dataInicioPadrao,
      dataFim: dataFimPadrao,
      periodo: 'mes'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Filtros</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
              Data início
            </label>
            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
              Data fim
            </label>
            <input
              type="date"
              id="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="curso" className="block text-sm font-medium text-gray-700 mb-1">
              Curso
            </label>
            <select
              id="curso"
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isLoading}
            >
              <option value="">Todos os cursos</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
              Agrupar por
            </label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as any)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              disabled={isLoading}
            >
              <option value="dia">Dia</option>
              <option value="semana">Semana</option>
              <option value="mes">Mês</option>
              <option value="ano">Ano</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={limparFiltros}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          disabled={isLoading}
        >
          Limpar
        </button>
        <button
          type="button"
          onClick={aplicarFiltros}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Aplicar'}
        </button>
      </div>
    </div>
  )
} 