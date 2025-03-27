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
  ArrowLeftIcon, 
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon
} from 'lucide-react'
import { buscarNegociacoes } from '@/services/financeiro'
import { PropostaNegociacao, StatusNegociacao } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatters'

export default function NegociacoesPage() {
  const router = useRouter()
  const [negociacoes, setNegociacoes] = useState<PropostaNegociacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarNegociacoes = async () => {
      try {
        setIsLoading(true)
        // Simula o ID do aluno logado
        const alunoId = 'aluno-123' // Deve vir de um contexto de autenticação
        
        // Carrega as negociações do aluno
        const dados = await buscarNegociacoes(alunoId)
        setNegociacoes(dados)
      } catch (erro) {
        console.error('Erro ao carregar negociações:', erro)
        setError('Não foi possível carregar as negociações. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarNegociacoes()
  }, [])

  // Função para mapear o status da negociação para exibição visual (badge)
  const getStatusBadge = (status: StatusNegociacao) => {
    switch (status) {
      case 'aprovada':
        return <Badge className="bg-green-500">Aprovada</Badge>
      case 'pendente':
        return <Badge className="bg-orange-500">Em análise</Badge>
      case 'rejeitada':
        return <Badge className="bg-red-500">Rejeitada</Badge>
      case 'cancelada':
        return <Badge className="bg-gray-500">Cancelada</Badge>
      case 'concluida':
        return <Badge className="bg-blue-500">Concluída</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Função para formatar uma data
  const formatarData = (dataString: string) => {
    if (!dataString) return 'N/A'
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR').format(data)
  }
  
  // Função para navegar para detalhes da negociação
  const navegarParaDetalheNegociacao = (negociacaoId: string) => {
    router.push(`/financeiro/negociacoes/${negociacaoId}`)
  }
  
  // Função para obter o ícone do status da negociação
  const getStatusIcon = (status: StatusNegociacao) => {
    switch (status) {
      case 'aprovada':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pendente':
        return <ClockIcon className="h-5 w-5 text-orange-500" />
      case 'rejeitada':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'cancelada':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />
      case 'concluida':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <FileTextIcon className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Barra de navegação */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/financeiro')}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Minhas Negociações</h1>
      </div>
      
      {/* Lista de negociações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Negociações</CardTitle>
          <CardDescription>
            Acompanhe suas propostas de negociação e seus status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : negociacoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileTextIcon className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p>Você ainda não possui negociações.</p>
              <Button 
                onClick={() => router.push('/financeiro')}
                variant="outline"
                className="mt-4"
              >
                Ver Parcelas
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor Original</TableHead>
                  <TableHead>Valor Negociado</TableHead>
                  <TableHead>Economia</TableHead>
                  <TableHead>Parcelas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {negociacoes.map((negociacao) => (
                  <TableRow key={negociacao.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navegarParaDetalheNegociacao(negociacao.id)}>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(negociacao.status)}
                        <span className="ml-2">{getStatusBadge(negociacao.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatarData(negociacao.dataEnvio)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(negociacao.valorOriginal)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(negociacao.valorNegociado)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(negociacao.valorOriginal - negociacao.valorNegociado)}
                    </TableCell>
                    <TableCell>
                      {negociacao.numeroParcelas > 1 
                        ? `${negociacao.numeroParcelas}x de ${formatCurrency(negociacao.valorNegociado / negociacao.numeroParcelas)}`
                        : 'À vista'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navegarParaDetalheNegociacao(negociacao.id);
                        }}
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
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
          <div className="flex items-center">
            <div className="mr-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-blue-700" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-1">Como funciona a negociação?</h3>
              <p className="text-blue-600 mb-4">
                Suas propostas são analisadas automaticamente com base nas regras da instituição.
                Após aprovação, você receberá os links de pagamento para as novas condições negociadas.
              </p>
              <Button 
                variant="link" 
                className="text-blue-700 p-0"
                onClick={() => router.push('/suporte')}
              >
                Precisa de ajuda com sua negociação?
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 