import { useState, useEffect } from 'react'
import {
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { 
  DashboardFilter, 
  StatsCard, 
  DashboardCard,
  ChartMatriculasPorPeriodo
} from '../../components/dashboard'
import { dashboardService } from '../../services/index'
import { DashboardFilters, FinanceiroSummary } from '../../services/dashboardService'
import { formatCurrency } from '../../utils/formatters'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/Layout/DashboardLayout'
import { DashboardFilter } from '../../components/dashboard/DashboardFilter'
import { StatsCard } from '@edunexia/ui-components'
import { ChartMatriculasPorPeriodo } from '../../components/dashboard/ChartMatriculasPorPeriodo'
import { DashboardCard } from '../../components/dashboard/DashboardCard'

export const RelatorioFinanceiro = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cursos, setCursos] = useState<{ id: string; nome: string }[]>([])
  const [filters, setFilters] = useState<DashboardFilters>(() => {
    // Definir período padrão de 30 dias
    const dataFim = new Date()
    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - 30)
    
    return {
      dataInicio,
      dataFim,
      periodo: 'mes'
    }
  })
  
  const [financeiroData, setFinanceiroData] = useState<FinanceiroSummary | null>(null)

  // Carregar dados dos cursos para os filtros
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // Em um ambiente real, buscaríamos os cursos da API
        const cursosSimulados = [
          { id: '1', nome: 'Análise e Desenvolvimento de Sistemas' },
          { id: '2', nome: 'Engenharia de Software' },
          { id: '3', nome: 'Design Gráfico' },
          { id: '4', nome: 'Administração' },
          { id: '5', nome: 'Ciências Contábeis' },
          { id: '6', nome: 'Marketing Digital' },
        ]
        setCursos(cursosSimulados)
      } catch (error) {
        console.error('Erro ao carregar cursos:', error)
      }
    }

    fetchCursos()
  }, [])

  // Carregar dados financeiros com base nos filtros
  useEffect(() => {
    const fetchFinanceiroData = async () => {
      setIsLoading(true)
      try {
        // Carregar dados financeiros
        const summary = await dashboardService.getFinanceiroSummary(filters)
        setFinanceiroData(summary)
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinanceiroData()
  }, [filters])

  // Atualizar filtros
  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters)
  }

  // Calcular variação da receita
  const calcularVariacaoReceita = () => {
    // Em um ambiente real, isso seria calculado com base em períodos anteriores
    if (!financeiroData) return 0
    
    // Simulação de variação
    const receitaAnterior = 85000 // valor simulado do mês anterior
    const diferenca = financeiroData.valorTotalRecebido - receitaAnterior
    return diferenca === 0 ? 0 : (diferenca / receitaAnterior) * 100
  }

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Relatório Financeiro</h1>
            <p className="mt-2 text-sm text-gray-700">
              Análise financeira das matrículas, receitas e pagamentos.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <DashboardFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            cursos={cursos}
            isLoading={isLoading}
          />
        </div>

        {/* Cards de estatísticas financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Receita Total"
            value={formatCurrency(financeiroData?.valorTotalRecebido || 0)}
            icon={<BanknotesIcon className="h-6 w-6" />}
            className="bg-white"
            trend={{
              value: calcularVariacaoReceita(),
              isPositive: calcularVariacaoReceita() >= 0,
              text: "vs. período anterior"
            }}
            isLoading={isLoading}
          />
          
          <StatsCard
            title="Pagamentos Pendentes"
            value={formatCurrency(financeiroData?.valorEmAberto || 0)}
            icon={<ClockIcon className="h-6 w-6" />}
            className="bg-white"
            description="Valores ainda não vencidos"
            isLoading={isLoading}
          />
          
          <StatsCard
            title="Pagamentos Vencidos"
            value={formatCurrency(financeiroData?.valorVencido || 0)}
            icon={<ExclamationTriangleIcon className="h-6 w-6" />}
            className="bg-white"
            description="Valores vencidos não pagos"
            isLoading={isLoading}
          />
          
          <StatsCard
            title="Previsão de Receita"
            value={formatCurrency(financeiroData?.valorTotalPrevisto || 0)}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            className="bg-white"
            description="Valor total esperado no período"
            isLoading={isLoading}
          />
        </div>

        {/* Gráfico de Receita */}
        <div className="mb-6">
          <ChartMatriculasPorPeriodo
            title="Receita por Período"
            data={financeiroData?.receitaPorMes || []}
            isLoading={isLoading}
            tooltipLabel="Receita"
            colorLine="#10B981"
            height={350}
          />
        </div>
        
        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DashboardCard
            title="Taxa de Adimplência"
            value={`${financeiroData?.taxaAdimplencia.toFixed(2) || 0}%`}
            className="h-full"
            isLoading={isLoading}
          >
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-4 w-full">
                <div 
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${financeiroData?.taxaAdimplencia || 0}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {financeiroData?.taxaAdimplencia || 0 >= 80 ? (
                  <span className="text-green-600">Taxa saudável de adimplência</span>
                ) : financeiroData?.taxaAdimplencia || 0 >= 60 ? (
                  <span className="text-yellow-600">Taxa média de adimplência</span>
                ) : (
                  <span className="text-red-600">Taxa baixa de adimplência</span>
                )}
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Valores Médios"
            className="h-full"
            isLoading={isLoading}
          >
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Valor Médio de Mensalidade</h4>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(financeiroData?.valorMedioMensalidade || 0)}
                </p>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500">Prazo Médio de Pagamento</h4>
                <p className="text-lg font-semibold text-gray-800">
                  5 dias após vencimento
                </p>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500">Preferência de Pagamento</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Boleto</div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">PIX</div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Cartão</div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
} 