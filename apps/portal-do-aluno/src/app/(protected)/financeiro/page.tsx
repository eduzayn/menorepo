'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  BanknotesIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ReceiptIcon,
  ArrowRightIcon,
  PiggyBankIcon,
  ChartPieIcon,
  CreditCardIcon,
  FileTextIcon,
  AlertCircleIcon
} from 'lucide-react'

import { Parcela, StatusParcela, PropostaNegociacao, EstatisticasFinanceiras } from '@/types/financeiro'
import { buscarParcelas, buscarEstatisticasFinanceiras, buscarNegociacoes } from '@/services/financeiro'
import { formatCurrency } from '@/utils/formatters'

export default function FinanceiroPage() {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [negociacoes, setNegociacoes] = useState<PropostaNegociacao[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasFinanceiras | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // ID do aluno simulado (em produção viria do contexto de autenticação)
        const alunoId = 'aluno-123'
        
        // Carregar dados financeiros
        const [
          parcelasData, 
          estatisticasData, 
          negociacoesData
        ] = await Promise.all([
          buscarParcelas(alunoId),
          buscarEstatisticasFinanceiras(alunoId),
          buscarNegociacoes(alunoId)
        ])
        
        setParcelas(parcelasData)
        setEstatisticas(estatisticasData)
        setNegociacoes(negociacoesData)
      } catch (erro) {
        console.error('Erro ao carregar dados financeiros:', erro)
        setError('Não foi possível carregar seus dados financeiros. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarDados()
  }, [])
  
  // Agrupar parcelas por status
  const parcelasAbertas = parcelas.filter(p => p.status === 'aberta')
  const parcelasAtrasadas = parcelas.filter(p => p.status === 'atrasada')
  const parcelasPagas = parcelas.filter(p => p.status === 'paga')
  
  // Obter contagens para dashboard
  const totalEmAberto = parcelasAbertas.length + parcelasAtrasadas.length
  const totalPago = parcelasPagas.length
  const totalNegociacoes = negociacoes.length
  
  // Obter próxima parcela a vencer
  const hoje = new Date()
  const proximaParcela = parcelasAbertas
    .filter(p => new Date(p.dataVencimento) >= hoje)
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())[0]
  
  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR').format(data)
  }
  
  // Calcular dias até vencimento
  const calcularDiasAteVencimento = (dataVencimento: string) => {
    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    const diffTime = vencimento.getTime() - hoje.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  // Obter badge de status para parcelas
  const obterBadgeStatus = (status: StatusParcela) => {
    switch (status) {
      case 'aberta':
        return <Badge className="bg-blue-500">Em Aberto</Badge>
      case 'atrasada':
        return <Badge className="bg-red-500">Atrasada</Badge>
      case 'paga':
        return <Badge className="bg-green-500">Paga</Badge>
      case 'acordo':
        return <Badge className="bg-purple-500">Em Acordo</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  // Obter badge de status para negociações
  const obterBadgeStatusNegociacao = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-orange-500">Pendente</Badge>
      case 'aprovada':
        return <Badge className="bg-green-500">Aprovada</Badge>
      case 'rejeitada':
        return <Badge className="bg-red-500">Rejeitada</Badge>
      case 'cancelada':
        return <Badge className="bg-gray-500">Cancelada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  // Renderizar loading
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }
  
  // Renderizar erro
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertCircleIcon className="h-10 w-10 text-red-500 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-1">Erro ao carregar dados financeiros</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">
          Gerencie seus pagamentos e faça negociações de parcelas
        </p>
      </div>
      
      {/* Dashboard */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parcelas em Aberto
            </CardTitle>
            <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmAberto}</div>
            <p className="text-xs text-muted-foreground">
              {parcelasAtrasadas.length > 0 && (
                <span className="text-red-500 font-medium">
                  {parcelasAtrasadas.length} atrasada{parcelasAtrasadas.length > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pago
            </CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPago}</div>
            <p className="text-xs text-muted-foreground">
              {estatisticas && (
                <span>
                  {formatCurrency(estatisticas.valorTotalPago)} no total
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Negociações
            </CardTitle>
            <PiggyBankIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNegociacoes}</div>
            <p className="text-xs text-muted-foreground">
              {negociacoes.filter(n => n.status === 'aprovada').length} aprovadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Próxima parcela (destaque) */}
      {proximaParcela && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Próximo Vencimento</CardTitle>
            <CardDescription className="text-blue-600">
              Parcela com vencimento próximo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="text-sm text-blue-600 font-medium">
                  {proximaParcela.descricao}
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(proximaParcela.valor)}
                </div>
                <div className="text-sm text-blue-600">
                  Vencimento: {formatarData(proximaParcela.dataVencimento)}
                </div>
              </div>
              <div className="mt-4 md:mt-0 space-y-2">
                <div className="bg-white rounded-md px-3 py-2 text-center">
                  <span className="text-sm font-medium text-blue-700">
                    {calcularDiasAteVencimento(proximaParcela.dataVencimento)} dias restantes
                  </span>
                </div>
                <Button className="w-full" size="sm">
                  <CreditCardIcon className="h-4 w-4 mr-2" />
                  Pagar Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs de Parcelas e Negociações */}
      <Tabs defaultValue="parcelas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parcelas">Parcelas</TabsTrigger>
          <TabsTrigger value="negociacoes">Negociações</TabsTrigger>
        </TabsList>
        
        {/* Conteúdo Parcelas */}
        <TabsContent value="parcelas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Parcelas</CardTitle>
              <CardDescription>
                Visualize todas as suas parcelas e realize pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {parcelas.length === 0 ? (
                  <div className="text-center py-8">
                    <ReceiptIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">Nenhuma parcela encontrada</h3>
                    <p className="text-muted-foreground mt-2">
                      Você não possui parcelas registradas no momento.
                    </p>
                  </div>
                ) : (
                  <>
                    {parcelas.map((parcela) => (
                      <div key={parcela.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{parcela.descricao}</h4>
                            <p className="text-sm text-muted-foreground">
                              Vencimento: {formatarData(parcela.dataVencimento)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            {obterBadgeStatus(parcela.status)}
                            <p className="mt-2 font-semibold">{formatCurrency(parcela.valor)}</p>
                          </div>
                        </div>
                        
                        <div className="flex mt-4 space-x-3 justify-end">
                          {(parcela.status === 'aberta' || parcela.status === 'atrasada') && (
                            <>
                              <Button size="sm" variant="outline">
                                <CreditCardIcon className="h-4 w-4 mr-2" />
                                Pagar
                              </Button>
                              
                              {parcela.status === 'atrasada' && (
                                <Link href={`/financeiro/negociar/${parcela.id}`} passHref>
                                  <Button size="sm">
                                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                                    Negociar
                                  </Button>
                                </Link>
                              )}
                            </>
                          )}
                          
                          {parcela.status === 'paga' && (
                            <Button size="sm" variant="outline">
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              Comprovante
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conteúdo Negociações */}
        <TabsContent value="negociacoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Negociações</CardTitle>
              <CardDescription>
                Acompanhe suas propostas de negociação de dívidas
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {negociacoes.length === 0 ? (
                  <div className="text-center py-8">
                    <PiggyBankIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">Nenhuma negociação encontrada</h3>
                    <p className="text-muted-foreground mt-2">
                      Você não possui negociações em andamento.
                    </p>
                    {parcelasAtrasadas.length > 0 && (
                      <Button className="mt-4">
                        <ArrowRightIcon className="h-4 w-4 mr-2" />
                        Iniciar Negociação
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {negociacoes.map((negociacao) => (
                      <div key={negociacao.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Proposta de Negociação</h4>
                            <p className="text-sm text-muted-foreground">
                              Criada em: {formatarData(negociacao.dataCriacao)}
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Parcelas: </span>
                              {negociacao.parcelasIds.length}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            {obterBadgeStatusNegociacao(negociacao.status)}
                            <p className="mt-2 font-semibold">{formatCurrency(negociacao.valorTotal)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Proposta: </span>
                            {negociacao.formaPagamento === 'avista' ? 'Pagamento à vista' : `Parcelado em ${negociacao.numeroParcelas}x`}
                          </p>
                          {negociacao.desconto > 0 && (
                            <p className="text-sm text-green-600">
                              Desconto de {(negociacao.desconto * 100).toFixed(0)}%
                            </p>
                          )}
                        </div>
                        
                        <div className="flex mt-4 space-x-3 justify-end">
                          <Link href={`/financeiro/negociacao/${negociacao.id}`} passHref>
                            <Button size="sm">
                              <ArrowRightIcon className="h-4 w-4 mr-2" />
                              Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Total de negociações: {negociacoes.length}
              </p>
              {parcelasAtrasadas.length > 0 && (
                <Button>
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Nova Negociação
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 