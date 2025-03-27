'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  FileTextIcon,
  InfoIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
  UploadIcon,
  CheckCircleIcon,
  LoaderIcon
} from 'lucide-react'
import { ServicoAdicional } from '@/types/financeiro'
import { obterServicoDetalhes, solicitarServico } from '@/services/taxas-servicos'
import { formatCurrency } from '@/utils/formatters'

export default function SolicitarServicoPage() {
  const params = useParams()
  const router = useRouter()
  const servicoId = params.servicoId as string
  
  const [servico, setServico] = useState<ServicoAdicional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [justificativa, setJustificativa] = useState('')
  const [arquivos, setArquivos] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  
  // Carregar detalhes do serviço
  useEffect(() => {
    const carregarServico = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const servicoData = await obterServicoDetalhes(servicoId)
        setServico(servicoData)
      } catch (erro) {
        console.error('Erro ao carregar serviço:', erro)
        setError('Não foi possível carregar os detalhes do serviço solicitado.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (servicoId) {
      carregarServico()
    }
  }, [servicoId])
  
  // Validar formulário
  const isFormValid = () => {
    if (!servico) return false
    
    if (servico.requerJustificativa && !justificativa.trim()) {
      return false
    }
    
    if (servico.requerDocumentos && arquivos.length === 0) {
      return false
    }
    
    return true
  }
  
  // Lidar com seleção de arquivos
  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setArquivos(prevArquivos => [...prevArquivos, ...filesArray])
    }
  }
  
  // Remover arquivo da lista
  const handleRemoverArquivo = (index: number) => {
    setArquivos(prevArquivos => prevArquivos.filter((_, i) => i !== index))
  }
  
  // Solicitar serviço
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!servico || !isFormValid()) return
    
    try {
      setEnviando(true)
      setError(null)
      
      // ID do aluno (em produção viria do contexto de autenticação)
      const alunoId = 'aluno-123'
      
      // Criar solicitação
      await solicitarServico({
        alunoId,
        servicoId: servico.id,
        justificativa,
        arquivos
      })
      
      setSucesso(true)
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/servicos')
      }, 3000)
    } catch (erro) {
      console.error('Erro ao solicitar serviço:', erro)
      setError('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.')
    } finally {
      setEnviando(false)
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
  if (error || !servico) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          {error || 'Serviço não encontrado'}
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => router.push('/servicos')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Alert>
    )
  }
  
  // Renderizar sucesso
  if (sucesso) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-4">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-2">Solicitação enviada com sucesso!</h2>
            <p className="text-green-600 mb-6">
              Sua solicitação foi registrada e está sendo processada.
              Você pode acompanhar o status na aba "Minhas Solicitações".
            </p>
            <div className="animate-pulse text-sm text-green-500">
              Redirecionando automaticamente...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push('/servicos')} className="mr-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Solicitar Serviço</h1>
          <p className="text-muted-foreground">
            Preencha as informações para solicitar {servico.nome}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna de informações do serviço */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{servico.nome}</CardTitle>
              <CardDescription>{servico.descricao}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Valor</div>
                  <div className="text-xl font-bold">{formatCurrency(servico.valor)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Prazo de entrega</div>
                  <div>{servico.prazoEntrega} dias úteis</div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">Requisitos</span>
                  </div>
                  
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {servico.requerJustificativa && (
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-2 text-green-500" />
                        Justificativa
                      </li>
                    )}
                    
                    {servico.requerDocumentos && (
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-2 text-green-500" />
                        Documentos anexos
                      </li>
                    )}
                    
                    {servico.temTaxaExtra && (
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-2 text-green-500" />
                        Taxa adicional inclusa
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna do formulário */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Solicitação</CardTitle>
              <CardDescription>
                Preencha os dados necessários para processar sua solicitação
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                {servico.requerJustificativa && (
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="justificativa">
                      Justificativa <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="justificativa"
                      placeholder="Explique o motivo da sua solicitação"
                      value={justificativa}
                      onChange={(e) => setJustificativa(e.target.value)}
                      rows={5}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Explique detalhadamente o motivo da sua solicitação.
                    </p>
                  </div>
                )}
                
                {servico.requerDocumentos && (
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="arquivos">
                      Documentos Anexos <span className="text-red-500">*</span>
                    </Label>
                    
                    <div className="border-2 border-dashed border-gray-200 p-6 rounded-lg text-center">
                      <UploadIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste e solte arquivos aqui ou clique para selecionar
                      </p>
                      <Input
                        id="arquivos"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleArquivoChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('arquivos')?.click()}
                      >
                        Selecionar Arquivos
                      </Button>
                    </div>
                    
                    {arquivos.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>Arquivos selecionados:</Label>
                        <div className="border rounded-lg overflow-hidden">
                          {arquivos.map((arquivo, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <FileTextIcon className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm truncate max-w-xs">{arquivo.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoverArquivo(index)}
                              >
                                Remover
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <Alert className="mb-6">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Observação</AlertTitle>
                  <AlertDescription>
                    Ao solicitar este serviço, você concorda com a cobrança de {formatCurrency(servico.valor)}.
                    {servico.temTaxaExtra && ' Taxas adicionais poderão ser aplicadas.'}
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/servicos')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid() || enviando}
                  >
                    {enviando ? (
                      <>
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Confirmar Solicitação'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 