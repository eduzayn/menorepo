'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeftIcon, 
  BadgePercentIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  WalletIcon,
  HeartIcon,
  ShieldIcon,
  GraduationCapIcon
} from 'lucide-react'
import { buscarParcelas } from '@/services/financeiro'
import { Parcela } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatters'

export default function NegociarPage() {
  const router = useRouter()
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const carregarParcelasAtrasadas = async () => {
      try {
        setIsLoading(true)
        // Simula o ID do aluno logado
        const alunoId = 'aluno-123' // Deve vir de um contexto de autenticação
        
        // Carrega apenas parcelas em atraso
        const dados = await buscarParcelas(alunoId, 'atrasada')
        setParcelas(dados)
      } catch (erro) {
        console.error('Erro ao carregar parcelas atrasadas:', erro)
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarParcelasAtrasadas()
  }, [])

  // Função para formatar uma data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR').format(data)
  }
  
  // Função para navegar para a página de negociação de uma parcela específica
  const navegarParaNegociacao = (parcelaId: string) => {
    router.push(`/financeiro/negociar/${parcelaId}`)
  }

  return (
    <div className="space-y-8">
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
        <h1 className="text-2xl font-bold">Portal de Negociações</h1>
      </div>
      
      {/* Banner principal */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Negocie suas Parcelas em Atraso</h2>
              <p className="text-blue-50 mb-6">
                Sabemos que imprevistos acontecem. Por isso, oferecemos condições especiais 
                para você regularizar sua situação financeira e continuar sua jornada de aprendizado
                sem preocupações.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <BadgePercentIcon className="h-5 w-5 mr-2 text-blue-200" />
                  <span>Descontos especiais</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-200" />
                  <span>Parcelamento flexível</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-200" />
                  <span>Aprovação rápida</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="p-8 bg-white bg-opacity-10 rounded-full">
                <WalletIcon className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Parcelas em atraso */}
      {parcelas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suas Parcelas em Atraso</CardTitle>
            <CardDescription>
              Selecione uma parcela para iniciar sua negociação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : (
                parcelas.map((parcela) => (
                  <Card key={parcela.id} className="border-red-200 hover:border-red-400 cursor-pointer transition-all duration-200" onClick={() => navegarParaNegociacao(parcela.id)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex justify-between">
                        <span>Parcela {parcela.numeroParcela}/{parcela.totalParcelas}</span>
                        <span className="text-red-600">{parcela.diasAtraso} dias</span>
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Vencimento: {formatarData(parcela.dataVencimento)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-xl font-bold text-red-600">{formatCurrency(parcela.valorAtualizado || parcela.valor)}</div>
                      {parcela.valorAtualizado && parcela.valor < parcela.valorAtualizado && (
                        <div className="text-xs text-gray-500">
                          Valor original: {formatCurrency(parcela.valor)}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full" variant="outline">
                        <ArrowRightIcon className="h-4 w-4 mr-2" />
                        Negociar esta parcela
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Como funciona */}
      <Card>
        <CardHeader>
          <CardTitle>Como funciona a negociação?</CardTitle>
          <CardDescription>
            Entenda o processo de negociação de dívidas em poucos passos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-700">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Escolha sua parcela</h3>
              <p className="text-gray-600">
                Selecione a parcela em atraso que deseja negociar. 
                Você pode negociar uma ou várias parcelas.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-700">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalize sua proposta</h3>
              <p className="text-gray-600">
                Escolha entre desconto à vista, parcelamento, ou ambos.
                Simule diferentes condições até encontrar a ideal para você.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-700">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Aproveite sua negociação</h3>
              <p className="text-gray-600">
                Após aprovação, você receberá os links de pagamento conforme as
                novas condições negociadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Abas com benefícios e perguntas frequentes */}
      <Tabs defaultValue="beneficios">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="beneficios">Benefícios da Negociação</TabsTrigger>
          <TabsTrigger value="faq">Dúvidas Frequentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="beneficios" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <BadgePercentIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Descontos exclusivos</h3>
                    <p className="text-gray-600">
                      Obtenha descontos especiais em multas e juros, 
                      possibilitando o pagamento do valor original ou até menos.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <CreditCardIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Condições especiais</h3>
                    <p className="text-gray-600">
                      Parcele sua dívida em condições mais favoráveis,
                      adequando os pagamentos ao seu orçamento atual.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <ShieldIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Regularize sua situação</h3>
                    <p className="text-gray-600">
                      Normalize sua situação financeira e evite bloqueios no 
                      acesso ao curso ou restrições em seu nome.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <GraduationCapIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Continue estudando</h3>
                    <p className="text-gray-600">
                      Mantenha seu acesso ao curso e continue sua jornada 
                      educacional sem interrupções.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quais parcelas posso negociar?</h3>
                <p className="text-gray-600">
                  Você pode negociar parcelas que estejam em atraso. Parcelas em dia ou futuras 
                  não estão disponíveis para negociação.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Qual o desconto máximo que posso conseguir?</h3>
                <p className="text-gray-600">
                  Os descontos variam de acordo com o tempo de atraso e o número de parcelas em aberto.
                  Em geral, oferecemos descontos de até 90% em juros e multas e até 20% no valor principal.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Em quantas vezes posso parcelar minha dívida?</h3>
                <p className="text-gray-600">
                  Você pode parcelar sua dívida em até 12 vezes, dependendo do valor total.
                  As condições são personalizadas e apresentadas durante a simulação.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">A aprovação da negociação é imediata?</h3>
                <p className="text-gray-600">
                  Na maioria dos casos, sim! Nosso sistema analisa automaticamente as propostas
                  com base nas regras vigentes. Se sua proposta estiver dentro dos parâmetros,
                  a aprovação é imediata.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-2">O que acontece se eu não pagar as parcelas do acordo?</h3>
                <p className="text-gray-600">
                  O não pagamento das parcelas do acordo pode cancelar os benefícios concedidos,
                  retornando a dívida ao valor original acrescido de juros e multas. Recomendamos
                  manter o acordo em dia.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* CTA final */}
      <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <HeartIcon className="h-16 w-16 mx-auto mb-4 text-green-200" />
            <h2 className="text-2xl font-bold">Estamos aqui para ajudar</h2>
            <p className="max-w-2xl mx-auto">
              Sabemos que cada situação é única. Se você precisa de condições especiais
              ou tem alguma dúvida sobre o processo de negociação, nossa equipe está pronta para ajudar.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                variant="secondary"
                onClick={() => router.push('/suporte')}
              >
                Falar com um Consultor
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white hover:text-green-700"
                onClick={() => router.push('/financeiro')}
              >
                Ver Minhas Parcelas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 