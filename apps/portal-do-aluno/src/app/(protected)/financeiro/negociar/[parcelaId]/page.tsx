'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertCircleIcon, 
  CheckCircleIcon, 
  CalculatorIcon,
  BadgePercentIcon,
  CalendarIcon,
  ArrowLeftIcon,
  InfoIcon,
  PiggyBankIcon,
  LoaderIcon,
  CreditCardIcon
} from 'lucide-react'
import { 
  buscarDetalheParcela, 
  buscarRegrasNegociacao, 
  verificarPossibilidadeNegociacao,
  criarPropostaNegociacao
} from '@/services/financeiro'
import { Parcela, RegrasNegociacao, PropostaNegociacao, MetodoPagamento } from '@/types/financeiro'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { toast } from 'react-hot-toast'

export default function NegociarParcelaPage() {
  const router = useRouter()
  const { parcelaId } = useParams()
  
  const [parcela, setParcela] = useState<Parcela | null>(null)
  const [regras, setRegras] = useState<RegrasNegociacao | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canNegotiate, setCanNegotiate] = useState(false)
  
  // Estados do formulário
  const [tipoNegociacao, setTipoNegociacao] = useState<'avista' | 'parcelado'>('avista')
  const [percentualDesconto, setPercentualDesconto] = useState(0)
  const [numeroParcelas, setNumeroParcelas] = useState(1)
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>('pix')
  const [aceitouTermos, setAceitouTermos] = useState(false)

  // Valores calculados
  const [valorOriginal, setValorOriginal] = useState(0)
  const [valorComDesconto, setValorComDesconto] = useState(0)
  const [valorPorParcela, setValorPorParcela] = useState(0)
  const [economiaTotal, setEconomiaTotal] = useState(0)
  const [valorEntrada, setValorEntrada] = useState(0)
  const [valorTotal, setValorTotal] = useState(0)

  useEffect(() => {
    const carregarDados = async () => {
      if (!parcelaId) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // Carrega dados da parcela
        const dadosParcela = await buscarDetalheParcela(parcelaId as string)
        setParcela(dadosParcela)
        setValorOriginal(dadosParcela.valor)
        
        // Verifica se é possível negociar
        const { podeNegociar, regras } = await verificarPossibilidadeNegociacao(parcelaId as string)
        setCanNegotiate(podeNegociar)
        
        if (podeNegociar && regras) {
          // Define as regras de negociação
          setRegras(regras)
          
          // Define valores iniciais com base nas regras
          setPercentualDesconto(regras.percentualDescontoMinimo || 5)
          setNumeroParcelas(regras.minimoParcelas || 2)
        }
      } catch (erro) {
        console.error('Erro ao carregar dados para negociação:', erro)
        setError('Não foi possível carregar os dados para negociação. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }
    
    carregarDados()
  }, [parcelaId])

  // Recalcula valores sempre que mudam as opções
  useEffect(() => {
    if (!parcela || !regras) return
    
    const valorBase = valorOriginal
    let desconto = 0
    
    if (tipoNegociacao === 'avista') {
      desconto = valorBase * (percentualDesconto / 100)
    }
    
    const valorFinal = valorBase - desconto
    setValorComDesconto(valorFinal)
    setEconomiaTotal(desconto)
    
    const numParcelas = tipoNegociacao === 'parcelado' ? numeroParcelas : 1
    
    setValorPorParcela(valorFinal / numParcelas)
  }, [tipoNegociacao, percentualDesconto, numeroParcelas, valorOriginal, parcela, regras])

  const handleSubmit = async () => {
    if (!parcela || !regras || !canNegotiate || !aceitouTermos) return
    
    try {
      setIsSending(true)
      
      const proposta: PropostaNegociacao = {
        parcelaId: parcela.id,
        tipoNegociacao,
        percentualDesconto: tipoNegociacao === 'avista' ? percentualDesconto : 0,
        numeroParcelas: tipoNegociacao === 'parcelado' ? numeroParcelas : 1,
        valorOriginal,
        valorNegociado: valorComDesconto,
        metodoPagamento,
        dataEnvio: new Date().toISOString(),
        status: 'pendente',
        observacoes: ''
      }
      
      await criarPropostaNegociacao(proposta)
      
      toast.success('Proposta de negociação enviada com sucesso!')
      router.push('/financeiro/negociacoes')
    } catch (erro) {
      console.error('Erro ao enviar proposta de negociação:', erro)
      toast.error('Não foi possível enviar sua proposta. Tente novamente mais tarde.')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error || !parcela) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Não foi possível carregar a parcela</h2>
            <p className="text-red-600 mb-4">{error || 'Parcela não encontrada'}</p>
            <Button 
              onClick={() => router.push('/financeiro')}
              variant="outline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar para Financeiro
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!canNegotiate) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircleIcon className="h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold text-orange-700 mb-2">Negociação indisponível</h2>
            <p className="text-orange-600 mb-4">
              Esta parcela não está disponível para negociação no momento. 
              Entre em contato com o suporte para mais informações.
            </p>
            <Button 
              onClick={() => router.push('/financeiro')}
              variant="outline"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Voltar para Financeiro
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
        <h1 className="text-2xl font-bold">Negociar Parcela</h1>
      </div>
      
      {/* Informações da parcela */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Parcela</CardTitle>
          <CardDescription>
            Informações sobre a parcela que você está negociando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Parcela</p>
              <p className="font-medium">{parcela.numeroParcela}/{parcela.totalParcelas}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vencimento</p>
              <p className="font-medium">{new Date(parcela.dataVencimento).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Atualizado</p>
              <p className="font-medium text-red-600">{formatCurrency(valorOriginal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dias em atraso</p>
              <p className="font-medium">{parcela.diasAtraso || 0} dias</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Multa</p>
              <p className="font-medium">{parcela.multa ? formatCurrency(parcela.multa) : 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Juros</p>
              <p className="font-medium">{parcela.juros ? formatCurrency(parcela.juros) : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Formulário de negociação */}
      <Card>
        <CardHeader>
          <CardTitle>Proposta de Negociação</CardTitle>
          <CardDescription>
            Escolha a opção que melhor se adapta às suas necessidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de negociação */}
          <div className="space-y-3">
            <Label>Tipo de Negociação</Label>
            <RadioGroup 
              value={tipoNegociacao} 
              onValueChange={(v) => setTipoNegociacao(v as 'avista' | 'parcelado')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="avista" id="avista" />
                <Label htmlFor="avista" className="cursor-pointer">Pagamento à vista</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parcelado" id="parcelado" />
                <Label htmlFor="parcelado" className="cursor-pointer">Pagamento parcelado</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Opções conforme o tipo escolhido */}
          {tipoNegociacao === 'avista' && regras && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Porcentagem de Desconto: {percentualDesconto}%</Label>
                <div className="text-sm text-muted-foreground">
                  Máx: {regras.percentualDescontoMaximo}%
                </div>
              </div>
              <Slider
                min={regras.percentualDescontoMinimo}
                max={regras.percentualDescontoMaximo}
                step={1}
                value={[percentualDesconto]}
                onValueChange={(values) => setPercentualDesconto(values[0])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>{regras.percentualDescontoMinimo}%</span>
                <span className="flex items-center text-green-600">
                  <BadgePercentIcon className="h-4 w-4 mr-1" />
                  {formatCurrency(economiaTotal)} de economia
                </span>
                <span>{regras.percentualDescontoMaximo}%</span>
              </div>
            </div>
          )}
          
          {tipoNegociacao === 'parcelado' && regras && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Número de Parcelas: {numeroParcelas}</Label>
                <div className="text-sm text-muted-foreground">
                  Máx: {regras.maximoParcelas}
                </div>
              </div>
              <Slider
                min={regras.minimoParcelas}
                max={regras.maximoParcelas}
                step={1}
                value={[numeroParcelas]}
                onValueChange={(values) => setNumeroParcelas(values[0])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>{regras.minimoParcelas}</span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatCurrency(valorPorParcela)} por parcela
                </span>
                <span>{regras.maximoParcelas}</span>
              </div>
            </div>
          )}
          
          {/* Método de pagamento */}
          <div className="space-y-3">
            <Label>Método de Pagamento</Label>
            <RadioGroup 
              value={metodoPagamento} 
              onValueChange={(v) => setMetodoPagamento(v as MetodoPagamento)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="cursor-pointer">PIX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boleto" id="boleto" />
                <Label htmlFor="boleto" className="cursor-pointer">Boleto Bancário</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cartao" id="cartao" />
                <Label htmlFor="cartao" className="cursor-pointer">Cartão de Crédito</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Termos e condições */}
          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch 
              id="termos" 
              checked={aceitouTermos}
              onCheckedChange={setAceitouTermos}
            />
            <Label htmlFor="termos" className="text-sm cursor-pointer">
              Concordo com os <a href="#" className="text-blue-600 hover:underline">termos e condições</a> da negociação.
            </Label>
          </div>
        </CardContent>
        
        {/* Resumo da negociação */}
        <CardFooter className="flex-col space-y-4">
          <div className="w-full p-4 rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalculatorIcon className="h-5 w-5 mr-2 text-blue-600" />
              Resumo da Negociação
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-muted-foreground">Valor original:</span>
                <span>{formatCurrency(valorOriginal)}</span>
              </div>
              
              {tipoNegociacao === 'avista' && (
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-muted-foreground">Desconto ({percentualDesconto}%):</span>
                  <span className="text-green-600">- {formatCurrency(economiaTotal)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-muted-foreground">Valor a pagar:</span>
                <span className="font-semibold">{formatCurrency(valorComDesconto)}</span>
              </div>
              
              {tipoNegociacao === 'parcelado' && (
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-muted-foreground">Parcelamento:</span>
                  <span>{numeroParcelas}x de {formatCurrency(valorPorParcela)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-1 pt-2">
                <span className="font-semibold">Economia total:</span>
                <span className="font-semibold text-green-600">{formatCurrency(economiaTotal)}</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSending || !aceitouTermos}
            className="w-full"
          >
            {isSending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                Enviando proposta...
              </>
            ) : (
              'Enviar Proposta de Negociação'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Informativo */}
      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-10 w-10 text-blue-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-1">Sua proposta será analisada automaticamente</h3>
              <p className="text-blue-600">
                Na maioria dos casos, sua proposta será aprovada instantaneamente conforme as regras de negociação.
                Caso necessário, nossa equipe entrará em contato para ajustes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 