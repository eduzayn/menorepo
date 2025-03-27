'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FileTextIcon,
  ArrowLeftIcon,
  ClockIcon,
  InfoIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DownloadIcon,
  TimerIcon,
  ExternalLinkIcon
} from 'lucide-react'
import { SolicitacaoServico } from '@/types/financeiro'
import { obterDetalhesSolicitacao, cancelarSolicitacao, gerarCobrancaServico } from '@/services/taxas-servicos'
import { formatCurrency } from '@/utils/formatters'

export default function DetalheSolicitacaoPage() {
  const params = useParams()
  const router = useRouter()
  const solicitacaoId = params.solicitacaoId as string
  
  const [solicitacao, setSolicitacao] = useState<SolicitacaoServico | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelando, setCancelando] = useState(false)
  const [gerandoPagamento, setGerandoPagamento] = useState(false)
  const [linkPagamento, setLinkPagamento] = useState<string | null>(null)
  
  // Carregar detalhes da solicitação
  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const solicitacaoData = await obterDetalhesSolicitacao(solicitacaoId)
        setSolicitacao(solicitacaoData)
      } catch (erro) {
        console.error('Erro ao carregar detalhes da solicitação:', erro)
        setError('Não foi possível carregar os detalhes da solicitação.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (solicitacaoId) {
      carregarDetalhes()
    }
  }, [solicitacaoId])
  
  // Verificar se a solicitação pode ser cancelada
  const podeCancelar = () => {
    if (!solicitacao) return false
    
    // Só pode cancelar se estiver pendente de pagamento ou em processamento inicial
    return ['PENDENTE_PAGAMENTO', 'PROCESSANDO'].includes(solicitacao.status) && 
      // Se estiver em processamento, verificar se está no início (menos de 24h)
      (solicitacao.status !== 'PROCESSANDO' || 
       (new Date().getTime() - new Date(solicitacao.dataAtualizacao).getTime()) < 24 * 60 * 60 * 1000)
  }
  
  // Cancelar solicitação
  const handleCancelar = async () => {
    if (!solicitacao || !podeCancelar()) return
    
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) return
    
    try {
      setCancelando(true)
      setError(null)
      
      await cancelarSolicitacao(solicitacao.id)
      
      // Atualizar status localmente
      setSolicitacao({
        ...solicitacao,
        status: 'CANCELADO',
        dataAtualizacao: new Date().toISOString()
      })
      
    } catch (erro) {
      console.error('Erro ao cancelar solicitação:', erro)
      setError('Não foi possível cancelar a solicitação. Por favor, tente novamente.')
    } finally {
      setCancelando(false)
    }
  }
  
  // Gerar link de pagamento
  const handleGerarPagamento = async () => {
    if (!solicitacao || solicitacao.status !== 'PENDENTE_PAGAMENTO') return
    
    try {
      setGerandoPagamento(true)
      setError(null)
      
      const link = await gerarCobrancaServico(solicitacao.id)
      setLinkPagamento(link)
      
    } catch (erro) {
      console.error('Erro ao gerar link de pagamento:', erro)
      setError('Não foi possível gerar o link de pagamento. Por favor, tente novamente.')
    } finally {
      setGerandoPagamento(false)
    }
  }
  
  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data)
  }
  
  // Obter ícone de status
  const obterIconeStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE_PAGAMENTO':
        return <CreditCardIcon className="h-6 w-6 text-orange-500" />
      case 'PROCESSANDO':
        return <ClockIcon className="h-6 w-6 text-blue-500" />
      case 'CONCLUIDO':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case 'REJEITADO':
        return <AlertCircleIcon className="h-6 w-6 text-red-500" />
      case 'CANCELADO':
        return <TimerIcon className="h-6 w-6 text-gray-500" />
      default:
        return <FileTextIcon className="h-6 w-6 text-gray-500" />
    }
  }
  
  // Obter texto de status
  const obterTextoStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE_PAGAMENTO':
        return 'Aguardando Pagamento'
      case 'PROCESSANDO':
        return 'Em Processamento'
      case 'CONCLUIDO':
        return 'Concluído'
      case 'REJEITADO':
        return 'Rejeitado'
      case 'CANCELADO':
        return 'Cancelado'
      default:
        return status
    }
  }
  
  // Obter badge de status
  const obterBadgeStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE_PAGAMENTO':
        return <Badge className="bg-orange-500">Aguardando Pagamento</Badge>
      case 'PROCESSANDO':
        return <Badge className="bg-blue-500">Em Processamento</Badge>
      case 'CONCLUIDO':
        return <Badge className="bg-green-500">Concluído</Badge>
      case 'REJEITADO':
        return <Badge className="bg-red-500">Rejeitado</Badge>
      case 'CANCELADO':
        return <Badge className="bg-gray-500">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  // Renderizar loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }
  
  // Renderizar erro
  if (error || !solicitacao) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error || 'Solicitação não encontrada'}
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => router.push('/servicos')}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para Serviços
          </Button>
        </AlertDescription>
      </Alert>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push('/servicos')} className="mr-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Solicitação</h1>
            <p className="text-muted-foreground">
              Acompanhe o status e informações da sua solicitação
            </p>
          </div>
        </div>
        <div>
          {solicitacao.status === 'PENDENTE_PAGAMENTO' && (
            <Button 
              onClick={handleGerarPagamento}
              disabled={gerandoPagamento}
              className="mr-2"
            >
              <CreditCardIcon className="h-4 w-4 mr-2" />
              {gerandoPagamento ? 'Gerando...' : 'Gerar Pagamento'}
            </Button>
          )}
          
          {podeCancelar() && (
            <Button 
              variant="outline" 
              onClick={handleCancelar}
              disabled={cancelando}
            >
              <TimerIcon className="h-4 w-4 mr-2" />
              {cancelando ? 'Cancelando...' : 'Cancelar Solicitação'}
            </Button>
          )}
        </div>
      </div>
      
      {linkPagamento && (
        <Alert className="bg-blue-50 border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
            <div className="flex items-center">
              <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
              <AlertDescription className="text-blue-700">
                Link de pagamento gerado com sucesso!
              </AlertDescription>
            </div>
            <Button
              size="sm"
              className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700"
              onClick={() => window.open(linkPagamento, '_blank')}
            >
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              Acessar Pagamento
            </Button>
          </div>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna de status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {obterIconeStatus(solicitacao.status)}
                <span className="ml-2">Status da Solicitação</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gray-100">
                  {obterIconeStatus(solicitacao.status)}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">{obterTextoStatus(solicitacao.status)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Atualizado em {formatarData(solicitacao.dataAtualizacao)}
                  </p>
                </div>
                
                {obterBadgeStatus(solicitacao.status)}
                
                <Separator className="my-4" />
                
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Data da Solicitação</span>
                    <span className="text-sm font-medium">{formatarData(solicitacao.dataEmissao)}</span>
                  </div>
                  
                  {solicitacao.dataPagamento && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data do Pagamento</span>
                      <span className="text-sm font-medium">{formatarData(solicitacao.dataPagamento)}</span>
                    </div>
                  )}
                  
                  {solicitacao.dataConclusao && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data da Conclusão</span>
                      <span className="text-sm font-medium">{formatarData(solicitacao.dataConclusao)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor</span>
                    <span className="text-sm font-medium">{formatCurrency(solicitacao.valorCobrado)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna de detalhes */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{solicitacao.servico?.nome || 'Detalhes do Serviço'}</CardTitle>
              <CardDescription>
                {solicitacao.servico?.descricao || 'Informações sobre a solicitação'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Prazo de entrega */}
              {solicitacao.servico?.prazoEntrega && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Prazo estimado</h3>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <p>{solicitacao.servico.prazoEntrega} dias úteis</p>
                  </div>
                </div>
              )}
              
              <Separator />
              
              {/* Justificativa */}
              {solicitacao.justificativa && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Justificativa</h3>
                  <div className="bg-gray-50 rounded-md p-4 text-sm">
                    {solicitacao.justificativa}
                  </div>
                </div>
              )}
              
              {/* Documentos */}
              {solicitacao.documentos && solicitacao.documentos.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Documentos Anexados</h3>
                  <div className="border rounded-md overflow-hidden">
                    {solicitacao.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">{doc.nome}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Observações da equipe */}
              {solicitacao.observacoes && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Observações da Equipe</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm">
                    <p className="text-blue-700">{solicitacao.observacoes}</p>
                  </div>
                </div>
              )}
              
              {/* Motivo de rejeição */}
              {solicitacao.status === 'REJEITADO' && solicitacao.motivoRejeicao && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Motivo de Rejeição</h3>
                  <div className="bg-red-50 border border-red-100 rounded-md p-4 text-sm">
                    <p className="text-red-700">{solicitacao.motivoRejeicao}</p>
                  </div>
                </div>
              )}
              
              {/* Documentos entregues */}
              {solicitacao.status === 'CONCLUIDO' && solicitacao.documentosEntregues && solicitacao.documentosEntregues.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Documentos Entregues</h3>
                  <div className="border rounded-md overflow-hidden">
                    {solicitacao.documentosEntregues.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm">{doc.nome}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 