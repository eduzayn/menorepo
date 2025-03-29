import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Button, Badge, Spinner, Tabs, TabsContent, TabsList, TabsTrigger,
  Form, FormField, Input, Select, DatePicker, Progress, Textarea
} from '@edunexia/ui-components';
import { 
  SearchIcon, FileTextIcon, CalendarIcon, CheckCircleIcon,
  DownloadIcon, BookOpenIcon, AlertTriangleIcon, 
  ArrowRightIcon, RefreshCwIcon, CheckIcon, XIcon,
  AlertCircleIcon, BarChart2Icon, FileSearchIcon
} from 'lucide-react';

// Tipos de análises de auditoria
type StatusAnaliseAuditoria = 'em_andamento' | 'concluida' | 'com_divergencias' | 'pendente';
type TipoAnaliseAuditoria = 'consistencia_lancamentos' | 'cruzamento_receitas' | 'cruzamento_despesas' | 'validacao_fiscal' | 'validacao_tributaria';

interface AnaliseAuditoria {
  id: string;
  nome: string;
  tipo: TipoAnaliseAuditoria;
  dataInicio: string;
  dataFim?: string;
  status: StatusAnaliseAuditoria;
  progresso: number;
  totalRegistros?: number;
  registrosAnalisados?: number;
  totalDivergencias?: number;
}

interface Divergencia {
  id: string;
  analiseId: string;
  tipoRegistro: string;
  descricao: string;
  dataOcorrencia: string;
  valor: number;
  criticidade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_analise' | 'resolvida' | 'justificada';
}

// Mock de dados
const ANALISES_MOCK: AnaliseAuditoria[] = [
  {
    id: '1',
    nome: 'Auditoria de Consistência de Lançamentos - Março/2024',
    tipo: 'consistencia_lancamentos',
    dataInicio: '2024-04-02',
    dataFim: '2024-04-05',
    status: 'concluida',
    progresso: 100,
    totalRegistros: 872,
    registrosAnalisados: 872,
    totalDivergencias: 3
  },
  {
    id: '2',
    nome: 'Cruzamento de Receitas Declaradas x Reconhecidas - Março/2024',
    tipo: 'cruzamento_receitas',
    dataInicio: '2024-04-10',
    dataFim: '2024-04-12',
    status: 'com_divergencias',
    progresso: 100,
    totalRegistros: 156,
    registrosAnalisados: 156,
    totalDivergencias: 8
  },
  {
    id: '3',
    nome: 'Validação de Obrigações Tributárias - 1º Trimestre/2024',
    tipo: 'validacao_tributaria',
    dataInicio: '2024-04-15',
    status: 'em_andamento',
    progresso: 68,
    totalRegistros: 245,
    registrosAnalisados: 167,
    totalDivergencias: 5
  },
  {
    id: '4',
    nome: 'Auditoria Fiscal de EFD Contribuições - 1º Trimestre/2024',
    tipo: 'validacao_fiscal',
    dataInicio: '2024-04-18',
    status: 'pendente',
    progresso: 0
  }
];

const DIVERGENCIAS_MOCK: Divergencia[] = [
  {
    id: '101',
    analiseId: '2',
    tipoRegistro: 'Receita',
    descricao: 'Valor declarado no SPED divergente do reconhecido na contabilidade',
    dataOcorrencia: '2024-03-15',
    valor: 5782.45,
    criticidade: 'alta',
    status: 'pendente'
  },
  {
    id: '102',
    analiseId: '2',
    tipoRegistro: 'Receita',
    descricao: 'Nota fiscal não contabilizada',
    dataOcorrencia: '2024-03-18',
    valor: 1250.00,
    criticidade: 'alta',
    status: 'pendente'
  },
  {
    id: '103',
    analiseId: '2',
    tipoRegistro: 'Receita',
    descricao: 'Classificação incorreta de receita tributada como isenta',
    dataOcorrencia: '2024-03-22',
    valor: 3450.80,
    criticidade: 'media',
    status: 'em_analise'
  },
  {
    id: '104',
    analiseId: '1',
    tipoRegistro: 'Lançamento',
    descricao: 'Lançamento duplicado na contabilidade',
    dataOcorrencia: '2024-03-05',
    valor: 2135.90,
    criticidade: 'media',
    status: 'resolvida'
  },
  {
    id: '105',
    analiseId: '1',
    tipoRegistro: 'Lançamento',
    descricao: 'Conta contábil incorreta utilizada para despesa com marketing',
    dataOcorrencia: '2024-03-12',
    valor: 5320.00,
    criticidade: 'baixa',
    status: 'justificada'
  },
  {
    id: '106',
    analiseId: '3',
    tipoRegistro: 'Imposto',
    descricao: 'Base de cálculo de IRPJ divergente',
    dataOcorrencia: '2024-03-31',
    valor: 15680.35,
    criticidade: 'alta',
    status: 'em_analise'
  }
];

/**
 * Página de Auditoria Fiscal
 * Permite realizar e acompanhar auditorias fiscais e tributárias
 */
export default function AuditoriaFiscal() {
  // Estados
  const [analises, setAnalises] = useState<AnaliseAuditoria[]>(ANALISES_MOCK);
  const [divergencias, setDivergencias] = useState<Divergencia[]>(DIVERGENCIAS_MOCK);
  const [analiseSelecionada, setAnaliseSelecionada] = useState<AnaliseAuditoria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusAnaliseAuditoria | ''>('');
  const [periodo, setPeriodo] = useState({
    dataInicio: '',
    dataFim: ''
  });
  
  // Formatação de data
  function formatarData(data?: string): string {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  
  // Formatação de valor monetário
  function formatarMoeda(valor?: number): string {
    if (valor === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
  
  // Obter badge para status de análise
  function getStatusAnaliseBadge(status: StatusAnaliseAuditoria): React.ReactNode {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pendente</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em andamento</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
      case 'com_divergencias':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Com divergências</Badge>;
      default:
        return null;
    }
  }
  
  // Obter badge para criticidade de divergência
  function getCriticidadeBadge(criticidade: 'baixa' | 'media' | 'alta'): React.ReactNode {
    switch (criticidade) {
      case 'baixa':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Baixa</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Média</Badge>;
      case 'alta':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Alta</Badge>;
      default:
        return null;
    }
  }
  
  // Obter badge para status de divergência
  function getStatusDivergenciaBadge(status: string): React.ReactNode {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'em_analise':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em análise</Badge>;
      case 'resolvida':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolvida</Badge>;
      case 'justificada':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Justificada</Badge>;
      default:
        return null;
    }
  }
  
  // Filtrar análises
  function filtrarAnalises() {
    setIsLoading(true);
    
    // Simular chamada de API
    setTimeout(() => {
      // Implementação de filtros seria aqui
      setIsLoading(false);
    }, 800);
  }
  
  // Selecionar uma análise para ver detalhes
  function selecionarAnalise(analise: AnaliseAuditoria) {
    setAnaliseSelecionada(analise);
  }
  
  // Obter as divergências da análise selecionada
  function getDivergenciasDaAnalise(): Divergencia[] {
    if (!analiseSelecionada) return [];
    return divergencias.filter(d => d.analiseId === analiseSelecionada.id);
  }
  
  // Atualizar status de divergência
  function atualizarStatusDivergencia(id: string, novoStatus: 'pendente' | 'em_analise' | 'resolvida' | 'justificada') {
    setIsLoading(true);
    
    // Simular chamada de API
    setTimeout(() => {
      const divergenciasAtualizadas = divergencias.map(d => {
        if (d.id === id) {
          return { ...d, status: novoStatus };
        }
        return d;
      });
      
      setDivergencias(divergenciasAtualizadas);
      setIsLoading(false);
    }, 800);
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Auditoria Fiscal</h1>
          <p className="text-muted-foreground">
            Realize auditorias fiscais e tributárias para identificar divergências
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <FileSearchIcon className="w-4 h-4 mr-2" />
            Nova Auditoria
          </Button>
          
          <Button variant="outline">
            <BarChart2Icon className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
        </div>
      </div>
      
      {/* Resumo da Auditoria */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-50 mr-4">
                <FileTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Auditorias</p>
                <h3 className="text-2xl font-bold">{analises.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-50 mr-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                <h3 className="text-2xl font-bold">{analises.filter(a => a.status === 'concluida').length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-yellow-50 mr-4">
                <RefreshCwIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                <h3 className="text-2xl font-bold">{analises.filter(a => a.status === 'em_andamento').length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-red-50 mr-4">
                <AlertTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Divergências</p>
                <h3 className="text-2xl font-bold">{divergencias.filter(d => d.status === 'pendente' || d.status === 'em_analise').length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Conteúdo principal em duas colunas quando há análise selecionada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de Auditorias */}
        <div className={analiseSelecionada ? 'md:col-span-1' : 'md:col-span-3'}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-2 text-primary" />
                Auditorias Fiscais
              </CardTitle>
              <CardDescription>
                Acompanhe as auditorias fiscais e tributárias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField label="Status">
                  <Select 
                    value={filtroStatus} 
                    onChange={(value) => setFiltroStatus(value as StatusAnaliseAuditoria | '')}
                  >
                    <option value="">Todos</option>
                    <option value="pendente">Pendentes</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluida">Concluídas</option>
                    <option value="com_divergencias">Com divergências</option>
                  </Select>
                </FormField>
                
                <FormField label="Período Inicial">
                  <DatePicker
                    value={periodo.dataInicio}
                    onChange={(date) => setPeriodo({...periodo, dataInicio: date})}
                  />
                </FormField>
                
                <FormField label="Período Final">
                  <DatePicker
                    value={periodo.dataFim}
                    onChange={(date) => setPeriodo({...periodo, dataFim: date})}
                  />
                </FormField>
              </div>
              
              <div className="flex justify-end mb-4">
                <Button onClick={filtrarAnalises}>
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
              
              {/* Lista de Auditorias */}
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {analises.map((analise) => (
                    <div
                      key={analise.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors
                        ${analiseSelecionada?.id === analise.id 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'hover:bg-muted/50 border-gray-200'}`}
                      onClick={() => selecionarAnalise(analise)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{analise.nome}</h3>
                        {getStatusAnaliseBadge(analise.status)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {formatarData(analise.dataInicio)}
                          {analise.dataFim && (
                            <>
                              <ArrowRightIcon className="w-3 h-3 mx-1" />
                              {formatarData(analise.dataFim)}
                            </>
                          )}
                        </div>
                        
                        {analise.totalDivergencias !== undefined && (
                          <div className="flex items-center">
                            <AlertCircleIcon className="w-4 h-4 mr-1" />
                            {analise.totalDivergencias} divergência(s)
                          </div>
                        )}
                      </div>
                      
                      {/* Barra de progresso */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progresso</span>
                          <span>{analise.progresso}%</span>
                        </div>
                        <Progress value={analise.progresso} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Detalhes da Auditoria Selecionada */}
        {analiseSelecionada && (
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{analiseSelecionada.nome}</CardTitle>
                    <CardDescription>
                      Detalhes da auditoria e divergências encontradas
                    </CardDescription>
                  </div>
                  {getStatusAnaliseBadge(analiseSelecionada.status)}
                </div>
              </CardHeader>
              <CardContent>
                {/* Informações da Análise */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/20 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Período</p>
                    <p>
                      {formatarData(analiseSelecionada.dataInicio)}
                      {analiseSelecionada.dataFim && (
                        <>
                          {' '}<ArrowRightIcon className="w-3 h-3 inline" />{' '}
                          {formatarData(analiseSelecionada.dataFim)}
                        </>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Registros</p>
                    <p>
                      {analiseSelecionada.registrosAnalisados || 0} / {analiseSelecionada.totalRegistros || 0}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Divergências</p>
                    <p>{analiseSelecionada.totalDivergencias || 0}</p>
                  </div>
                </div>
                
                {/* Lista de Divergências */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Divergências Encontradas</h3>
                  
                  {getDivergenciasDaAnalise().length === 0 ? (
                    <div className="text-center p-8 bg-muted/10 rounded-md">
                      <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Não foram encontradas divergências nesta auditoria.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Criticidade</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getDivergenciasDaAnalise().map((divergencia) => (
                            <TableRow key={divergencia.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{divergencia.tipoRegistro}</div>
                                  <div className="text-sm text-muted-foreground">{divergencia.descricao}</div>
                                </div>
                              </TableCell>
                              <TableCell>{formatarData(divergencia.dataOcorrencia)}</TableCell>
                              <TableCell>{getCriticidadeBadge(divergencia.criticidade)}</TableCell>
                              <TableCell className="text-right font-medium">{formatarMoeda(divergencia.valor)}</TableCell>
                              <TableCell>{getStatusDivergenciaBadge(divergencia.status)}</TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-1">
                                  {divergencia.status === 'pendente' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => atualizarStatusDivergencia(divergencia.id, 'em_analise')}
                                      >
                                        <SearchIcon className="w-3.5 h-3.5 mr-1" />
                                        Analisar
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => atualizarStatusDivergencia(divergencia.id, 'resolvida')}
                                      >
                                        <CheckIcon className="w-3.5 h-3.5 mr-1" />
                                        Resolver
                                      </Button>
                                    </>
                                  )}
                                  
                                  {divergencia.status === 'em_analise' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => atualizarStatusDivergencia(divergencia.id, 'resolvida')}
                                      >
                                        <CheckIcon className="w-3.5 h-3.5 mr-1" />
                                        Resolver
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => atualizarStatusDivergencia(divergencia.id, 'justificada')}
                                      >
                                        <FileTextIcon className="w-3.5 h-3.5 mr-1" />
                                        Justificar
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
                
                {/* Botões de Ação */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setAnaliseSelecionada(null)}>
                    Voltar
                  </Button>
                  
                  <Button variant="outline">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                  
                  {analiseSelecionada.status === 'em_andamento' && (
                    <Button>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Concluir Auditoria
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 