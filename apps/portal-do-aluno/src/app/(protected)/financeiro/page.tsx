'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  BanknoteIcon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  CalendarIcon,
  ReceiptIcon,
  BarChart3Icon 
} from 'lucide-react'
import { buscarParcelas, buscarEstatisticasFinanceiras } from '@/services/financeiro'
import { Parcela, StatusParcela, EstatisticasFinanceiras } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatters'

export default function FinanceiroPage() {
  const router = useRouter()
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasFinanceiras | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true)
        // Simula o ID do aluno logado
        const alunoId = 'aluno-123' // Deve vir de um contexto de autenticação
        
        // Carrega as parcelas do aluno
        const dados = await buscarParcelas(alunoId)
        setParcelas(dados)
        
        // Carrega estatísticas financeiras
        const stats = await buscarEstatisticasFinanceiras(alunoId)
        setEstatisticas(stats)
      } catch (erro) {
        console.error('Erro ao carregar dados financeiros:', erro)
        setError('Não foi possível carregar os dados financeiros. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarDados()
  }, [])

  // Função para mapear o status da parcela para exibição visual (badge)
  const getStatusBadge = (status: StatusParcela) => {
    switch (status) {
      case 'paga':
        return <Badge className="bg-green-500">Paga</Badge>
      case 'aberta':
        return <Badge className="bg-blue-500">Em aberto</Badge>
      case 'atrasada':
        return <Badge className="bg-red-500">Atrasada</Badge>
      case 'negociando':
        return <Badge className="bg-orange-500">Em negociação</Badge>
      case 'acordo':
        return <Badge className="bg-purple-500">Acordo ativo</Badge>
      case 'cancelada':
        return <Badge className="bg-gray-500">Cancelada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Função para formatar uma data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR').format(data)
  }
  
  // Função para determinar se uma parcela pode ser negociada
  const podeNegociar = (parcela: Parcela) => {
    return parcela.status === 'atrasada'
  }
  
  // Função para navegar para a página de negociação
  const navegarParaNegociacao = (parcelaId: string) => {
    router.push(`/financeiro/negociar/${parcelaId}`)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Gerencie seus pagamentos, parcelas e negociações</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => router.push('/financeiro/negociacoes')}
            variant="outline"
            className="mr-2"
          >
            <ClockIcon className="h-4 w-4 mr-2" />
            Minhas Negociações
          </Button>
          <Button 
            onClick={() => router.push('/financeiro/historico')}
            variant="outline"
          >
            <ReceiptIcon className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>
      
      {/* Indicadores */}
      {estatisticas && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total em Aberto</CardTitle>
              <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estatisticas.totalAberto)}</div>
              <p className="text-xs text-muted-foreground">
                {estatisticas.parcelasEmDia} parcelas em dia
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
              <AlertCircleIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estatisticas.totalAtrasado)}</div>
              <p className="text-xs text-muted-foreground">
                {estatisticas.parcelasAtrasadas} parcelas em atraso
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Negociações</CardTitle>
              <ClockIcon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.parcelasNegociando}</div>
              <p className="text-xs text-muted-foreground">
                {estatisticas.acordosVigentes} acordos vigentes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Descontos Obtidos</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estatisticas.descontosObtidos)}</div>
              <p className="text-xs text-muted-foreground">
                Total economizado nas negociações
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Lista de parcelas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Parcelas</CardTitle>
          <CardDescription>
            Gerencie suas mensalidades e parcelas pendentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : parcelas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircleIcon className="mx-auto h-12 w-12 mb-4 text-green-500" />
              <p>Não há parcelas pendentes.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcelas.map((parcela) => (
                  <TableRow key={parcela.id}>
                    <TableCell className="font-medium">
                      {parcela.numeroParcela}/{parcela.totalParcelas}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatarData(parcela.dataVencimento)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(parcela.valor)}</TableCell>
                    <TableCell>{getStatusBadge(parcela.status)}</TableCell>
                    <TableCell className="text-right">
                      {parcela.status === 'aberta' && parcela.linkPagamento && (
                        <Button 
                          size="sm" 
                          className="mr-2"
                          onClick={() => window.open(parcela.linkPagamento, '_blank')}
                        >
                          Pagar
                        </Button>
                      )}
                      
                      {podeNegociar(parcela) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navegarParaNegociacao(parcela.id)}
                        >
                          Negociar
                        </Button>
                      )}
                      
                      {parcela.status === 'paga' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(parcela.comprovantePagamentoUrl, '_blank')}
                          disabled={!parcela.comprovantePagamentoUrl}
                        >
                          Comprovante
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Informativo */}
      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="mr-6 mb-4 md:mb-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BanknoteIcon className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-1">Está com dificuldades financeiras?</h3>
              <p className="text-blue-600 mb-4">
                Você pode negociar parcelas em atraso com descontos especiais e parcelamento facilitado.
              </p>
              <Button 
                variant="default" 
                className="bg-blue-700 hover:bg-blue-800"
                onClick={() => router.push('/financeiro/negociar')}
              >
                Saiba mais sobre negociações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 