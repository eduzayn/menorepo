'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileTextIcon,
  FilePlusIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon,
  AlertCircleIcon,
  TimerIcon,
  ArrowRightIcon
} from 'lucide-react'
import { ServicoAdicional, SolicitacaoServico } from '@/types/financeiro'
import { listarServicosDisponiveis, listarSolicitacoesServicos } from '@/services/taxas-servicos'
import { formatCurrency } from '@/utils/formatters'
import { useRouter } from 'next/navigation'

export default function ServicosPage() {
  const router = useRouter()
  const [servicos, setServicos] = useState<ServicoAdicional[]>([])
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoServico[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Simula o ID do aluno logado (em produção viria do contexto de autenticação)
        const alunoId = 'aluno-123'
        
        // Carregar serviços disponíveis e solicitações do aluno
        const [servicosData, solicitacoesData] = await Promise.all([
          listarServicosDisponiveis(),
          listarSolicitacoesServicos(alunoId)
        ])
        
        setServicos(servicosData)
        setSolicitacoes(solicitacoesData)
      } catch (erro) {
        console.error('Erro ao carregar dados de serviços:', erro)
        setError('Não foi possível carregar os serviços. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarDados()
  }, [])
  
  // Obter estatísticas de solicitações
  const pendentes = solicitacoes.filter(s => ['PENDENTE_PAGAMENTO', 'PROCESSANDO'].includes(s.status)).length
  const concluidas = solicitacoes.filter(s => s.status === 'CONCLUIDO').length
  const canceladas = solicitacoes.filter(s => ['REJEITADO', 'CANCELADO'].includes(s.status)).length
  
  // Função para formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR').format(data)
  }
  
  // Função para obter o ícone de status
  const obterIconeStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE_PAGAMENTO':
        return <CreditCardIcon className="h-5 w-5 text-orange-500" />
      case 'PROCESSANDO':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'CONCLUIDO':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'REJEITADO':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />
      case 'CANCELADO':
        return <TimerIcon className="h-5 w-5 text-gray-500" />
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />
    }
  }
  
  // Função para obter badge de status
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Serviços e Solicitações</h1>
        <p className="text-muted-foreground">
          Solicite documentos e serviços administrativos aqui
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircleIcon className="h-10 w-10 text-red-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-1">Erro ao carregar serviços</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendentes}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Solicitações Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{concluidas}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Solicitações Canceladas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{canceladas}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="solicitar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solicitar">Solicitar Serviço</TabsTrigger>
              <TabsTrigger value="minhas-solicitacoes">Minhas Solicitações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="solicitar" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {servicos.map((servico) => (
                  <Card key={servico.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>{servico.nome}</CardTitle>
                      <CardDescription>{servico.descricao}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-lg">
                          {formatCurrency(servico.valor)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Prazo: {servico.prazoEntrega} dias
                        </div>
                      </div>
                      
                      <div className="space-y-1 mt-4">
                        {servico.requerJustificativa && (
                          <div className="text-xs text-muted-foreground flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Requer justificativa
                          </div>
                        )}
                        
                        {servico.requerDocumentos && (
                          <div className="text-xs text-muted-foreground flex items-center">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Requer anexos
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/servicos/solicitar/${servico.id}`)}
                      >
                        <FilePlusIcon className="h-4 w-4 mr-2" />
                        Solicitar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {servicos.length === 0 && (
                <Card className="bg-gray-50">
                  <CardContent className="p-6 text-center">
                    <FileTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">Nenhum serviço disponível</h3>
                    <p className="text-muted-foreground mt-2">
                      No momento não existem serviços disponíveis para solicitação.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="minhas-solicitacoes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Solicitações</CardTitle>
                  <CardDescription>
                    Acompanhe o status das suas solicitações de serviços
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {solicitacoes.length === 0 ? (
                    <div className="text-center py-8">
                      <FileTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold">Nenhuma solicitação encontrada</h3>
                      <p className="text-muted-foreground mt-2">
                        Você ainda não solicitou nenhum serviço.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          const element = document.querySelector('[data-value="solicitar"]') as HTMLElement;
                          if (element) element.click();
                        }}
                      >
                        Solicitar Serviço
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {solicitacoes.map((solicitacao) => (
                        <div 
                          key={solicitacao.id} 
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/servicos/solicitacao/${solicitacao.id}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className="mr-4 mt-1">
                                {obterIconeStatus(solicitacao.status)}
                              </div>
                              <div>
                                <h4 className="font-semibold">
                                  {solicitacao.servico?.nome || 'Serviço'}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Solicitado em {formatarData(solicitacao.dataEmissao)}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              {obterBadgeStatus(solicitacao.status)}
                              <p className="mt-2 text-sm font-medium">
                                {formatCurrency(solicitacao.valorCobrado)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/servicos/solicitacao/${solicitacao.id}`);
                              }}
                            >
                              <ArrowRightIcon className="h-4 w-4 mr-2" />
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
} 