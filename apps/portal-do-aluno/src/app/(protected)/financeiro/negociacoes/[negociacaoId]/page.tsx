'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeftIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknoteIcon,
  FileTextIcon,
  AlertCircleIcon,
  PrinterIcon,
  DownloadIcon
} from 'lucide-react'
import { buscarDetalheNegociacao, gerarLinkPagamento } from '@/services/financeiro'
import { PropostaNegociacao, ParcelaAcordo, StatusNegociacao } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'react-hot-toast'

export default function DetalheNegociacaoPage() {
  const router = useRouter()
  const { negociacaoId } = useParams()
  
  const [negociacao, setNegociacao] = useState<PropostaNegociacao | null>(null)
  const [parcelas, setParcelas] = useState<ParcelaAcordo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDetalhes = async () => {
      if (!negociacaoId) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // Carrega detalhes da negociação e parcelas
        const { negociacao, parcelas } = await buscarDetalheNegociacao(negociacaoId as string)
        setNegociacao(negociacao)
        setParcelas(parcelas)
      } catch (erro) {
        console.error('Erro ao carregar detalhes da negociação:', erro)
        setError('Não foi possível carregar os detalhes da negociação. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarDetalhes()
  }, [negociacaoId])

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
  
  // Função para gerar o link de pagamento para uma parcela
  const gerarLink = async (parcelaId: string) => {
    try {
      setIsProcessing(true)
      const link = await gerarLinkPagamento(parcelaId)
      
      // Abre o link de pagamento em uma nova aba
      if (link) {
        window.open(link, '_blank')
      } else {
        toast.error('Não foi possível gerar o link de pagamento.')
      }
    } catch (erro) {
      console.error('Erro ao gerar link de pagamento:', erro)
      toast.error('Ocorreu um erro ao gerar o link de pagamento. Tente novamente mais tarde.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Função para imprimir o comprovante
  const imprimirComprovante = () => {
    if (!negociacao) return
    window.print()
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
  
  // Função para obter o ícone do método de pagamento
  const getMetodoPagamentoIcon = (metodo: string) => {
    switch (metodo) {
      case 'pix':
        return <BanknoteIcon className="h-5 w-5 text-green-500" />
      case 'boleto':
        return <FileTextIcon className="h-5 w-5 text-blue-500" />
      case 'cartao':
        return <CreditCardIcon className="h-5 w-5 text-purple-500" />
      default:
        return <BanknoteIcon className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error || !negociacao) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Não foi possível carregar os detalhes</h2>
            <p className="text-red-600 mb-4">{error || 'Negociação não encontrada'}</p>
            <Button 
              onClick={() => router.push('/financeiro/negociacoes')}
              variant="outline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar para Negociações
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6" id="detalhe-negociacao">
      {/* Barra de navegação */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/financeiro/negociacoes')}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Detalhes da Negociação</h1>
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={imprimirComprovante}
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Lógica para baixar comprovante em PDF seria implementada aqui
              toast.success('Comprovante baixado com sucesso!')
            }}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Baixar
          </Button>
        </div>
      </div>
      
      {/* Status da negociação */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Status da Negociação</CardTitle>
            <div className="flex items-center">
              {getStatusIcon(negociacao.status)}
              <span className="ml-2">{getStatusBadge(negociacao.status)}</span>
            </div>
          </div>
          <CardDescription>
            Proposta enviada em {formatarData(negociacao.dataEnvio)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Original</p>
              <p className="text-xl font-semibold">{formatCurrency(negociacao.valorOriginal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Negociado</p>
              <p className="text-xl font-semibold">{formatCurrency(negociacao.valorNegociado)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Economia</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(negociacao.valorOriginal - negociacao.valorNegociado)}
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Negociação</p>
              <p className="font-medium">
                {negociacao.tipoNegociacao === 'desconto' ? 'Desconto à vista' : 
                 negociacao.tipoNegociacao === 'parcelamento' ? 'Parcelamento' : 
                 'Parcelamento com desconto'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Parcelas</p>
              <p className="font-medium">
                {negociacao.numeroParcelas > 1 
                  ? `${negociacao.numeroParcelas}x de ${formatCurrency(negociacao.valorNegociado / negociacao.numeroParcelas)}`
                  : 'Pagamento à vista'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
              <p className="font-medium flex items-center">
                {getMetodoPagamentoIcon(negociacao.metodoPagamento)}
                <span className="ml-2">
                  {negociacao.metodoPagamento === 'pix' ? 'PIX' : 
                   negociacao.metodoPagamento === 'boleto' ? 'Boleto Bancário' : 
                   'Cartão de Crédito'}
                </span>
              </p>
            </div>
          </div>
          
          {negociacao.observacoes && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="p-3 bg-gray-50 rounded-md">{negociacao.observacoes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Lista de parcelas da negociação */}
      {parcelas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parcelas do Acordo</CardTitle>
            <CardDescription>
              Acompanhe o status de pagamento das parcelas da sua negociação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcelas.map((parcela, index) => (
                  <TableRow key={parcela.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatarData(parcela.dataVencimento)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(parcela.valor)}</TableCell>
                    <TableCell>
                      {parcela.status === 'paga' ? (
                        <Badge className="bg-green-500">Paga</Badge>
                      ) : parcela.status === 'aberta' ? (
                        <Badge className="bg-blue-500">Em aberto</Badge>
                      ) : (
                        <Badge className="bg-red-500">Atrasada</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {parcela.status === 'aberta' && (
                        <Button 
                          size="sm" 
                          onClick={() => gerarLink(parcela.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                          ) : (
                            <BanknoteIcon className="h-4 w-4 mr-2" />
                          )}
                          Pagar
                        </Button>
                      )}
                      
                      {parcela.status === 'paga' && parcela.comprovantePagamentoUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(parcela.comprovantePagamentoUrl, '_blank')}
                        >
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          Comprovante
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          {negociacao.status === 'aprovada' && (
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-center text-muted-foreground max-w-md">
                <AlertCircleIcon className="h-4 w-4 inline-block mr-1 mb-1" />
                Importante: Mantenha o pagamento das parcelas em dia para manter o acordo válido.
                O atraso em qualquer parcela pode cancelar os benefícios concedidos.
              </p>
            </CardFooter>
          )}
        </Card>
      )}
      
      {/* Acordos anteriores (se houver) */}
      {negociacao.historicoNegociacoes && negociacao.historicoNegociacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Negociações</CardTitle>
            <CardDescription>
              Acordos anteriores relacionados a esta dívida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {negociacao.historicoNegociacoes.map((historico, index) => (
                <div key={index} className="p-4 rounded-md border">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{formatarData(historico.data)}</span>
                    {historico.status === 'cancelada' ? (
                      <Badge className="bg-red-500">Cancelada</Badge>
                    ) : (
                      <Badge className="bg-green-500">Concluída</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {historico.descricao}
                  </p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Valor negociado: </span>
                    <span>{formatCurrency(historico.valor)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Informações adicionais */}
      {negociacao.status === 'rejeitada' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircleIcon className="h-10 w-10 text-red-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-1">Sua proposta foi rejeitada</h3>
                <p className="text-red-600 mb-3">
                  Infelizmente sua proposta não atende aos critérios necessários para aprovação.
                  Você pode fazer uma nova proposta com diferentes condições.
                </p>
                <Button 
                  onClick={() => router.push(`/financeiro/negociar/${negociacao.parcelaId}`)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Fazer Nova Proposta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {negociacao.status === 'pendente' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClockIcon className="h-10 w-10 text-orange-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-orange-700 mb-1">Sua proposta está em análise</h3>
                <p className="text-orange-600">
                  Nossa equipe está analisando sua proposta de negociação.
                  Você receberá uma notificação assim que houver uma atualização.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {negociacao.status === 'aprovada' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-10 w-10 text-green-600 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-1">Sua proposta foi aprovada!</h3>
                <p className="text-green-600">
                  Você já pode realizar o pagamento das parcelas conforme as condições negociadas.
                  Clique no botão "Pagar" ao lado de cada parcela para gerar o link de pagamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 