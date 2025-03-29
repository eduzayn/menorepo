import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Button, Badge, Spinner, Tabs, TabsContent, TabsList, TabsTrigger,
  Form, FormField, Input, Select, DatePicker
} from '@edunexia/ui-components';
import { 
  PlusIcon, FilterIcon, FileTextIcon, CalendarIcon,
  DownloadIcon, AlertTriangleIcon, CheckCircleIcon, 
  EyeIcon, ClockIcon, DollarSignIcon, FileIcon
} from 'lucide-react';

// Mock de dados de impostos
const IMPOSTOS_MOCK = [
  {
    id: '1',
    nome: 'IRPJ',
    descricao: 'Imposto de Renda Pessoa Jurídica',
    tipo: 'FEDERAL',
    competencia: '2024-03',
    vencimento: '2024-04-30',
    valor: 12850.45,
    status: 'pendente'
  },
  {
    id: '2',
    nome: 'CSLL',
    descricao: 'Contribuição Social sobre o Lucro Líquido',
    tipo: 'FEDERAL',
    competencia: '2024-03',
    vencimento: '2024-04-30',
    valor: 4628.56,
    status: 'pendente'
  },
  {
    id: '3',
    nome: 'PIS',
    descricao: 'Programa de Integração Social',
    tipo: 'FEDERAL',
    competencia: '2024-03',
    vencimento: '2024-04-25',
    valor: 1957.32,
    status: 'pago',
    dataPagamento: '2024-04-22'
  },
  {
    id: '4',
    nome: 'COFINS',
    descricao: 'Contribuição para o Financiamento da Seguridade Social',
    tipo: 'FEDERAL',
    competencia: '2024-03',
    vencimento: '2024-04-25',
    valor: 9025.78,
    status: 'pago',
    dataPagamento: '2024-04-22'
  },
  {
    id: '5',
    nome: 'ISS',
    descricao: 'Imposto Sobre Serviços',
    tipo: 'MUNICIPAL',
    competencia: '2024-03',
    vencimento: '2024-04-15',
    valor: 3245.90,
    status: 'pago',
    dataPagamento: '2024-04-10'
  },
  {
    id: '6',
    nome: 'DCTF',
    descricao: 'Declaração de Débitos e Créditos Tributários Federais',
    tipo: 'OBRIGACAO',
    competencia: '2024-03',
    vencimento: '2024-05-15',
    status: 'pendente'
  },
  {
    id: '7',
    nome: 'EFD-Contribuições',
    descricao: 'Escrituração Fiscal Digital de PIS/COFINS',
    tipo: 'OBRIGACAO',
    competencia: '2024-03',
    vencimento: '2024-05-10',
    status: 'pendente'
  }
];

// Mock de dados de obrigações
const OBRIGACOES_MOCK = [
  {
    id: '1',
    nome: 'EFD-ICMS/IPI',
    descricao: 'Escrituração Fiscal Digital ICMS/IPI',
    prazo: 'Mensal - Dia 10 do mês subsequente',
    proxVencimento: '2024-05-10',
    ultimaEntrega: '2024-04-09',
    status: 'em_dia'
  },
  {
    id: '2',
    nome: 'DCTF Web',
    descricao: 'Declaração de Débitos e Créditos Tributários Federais pela Internet',
    prazo: 'Mensal - Dia 15 do mês subsequente',
    proxVencimento: '2024-05-15',
    ultimaEntrega: '2024-04-12',
    status: 'em_dia'
  },
  {
    id: '3',
    nome: 'ECD',
    descricao: 'Escrituração Contábil Digital',
    prazo: 'Anual - Último dia útil de maio',
    proxVencimento: '2024-05-31',
    ultimaEntrega: '2023-05-30',
    status: 'pendente'
  },
  {
    id: '4',
    nome: 'ECF',
    descricao: 'Escrituração Contábil Fiscal',
    prazo: 'Anual - Último dia útil de julho',
    proxVencimento: '2024-07-31',
    ultimaEntrega: '2023-07-28',
    status: 'pendente'
  },
  {
    id: '5',
    nome: 'DIRF',
    descricao: 'Declaração do Imposto de Renda Retido na Fonte',
    prazo: 'Anual - Último dia útil de fevereiro',
    proxVencimento: '2025-02-28',
    ultimaEntrega: '2024-02-29',
    status: 'em_dia'
  }
];

// Tipos
type TipoImposto = 'FEDERAL' | 'ESTADUAL' | 'MUNICIPAL' | 'OBRIGACAO';
type StatusImposto = 'pendente' | 'pago' | 'atrasado' | 'isento';
type StatusObrigacao = 'em_dia' | 'pendente' | 'atrasado';

interface Imposto {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoImposto;
  competencia: string;
  vencimento: string;
  valor?: number;
  status: StatusImposto;
  dataPagamento?: string;
}

interface Obrigacao {
  id: string;
  nome: string;
  descricao: string;
  prazo: string;
  proxVencimento: string;
  ultimaEntrega?: string;
  status: StatusObrigacao;
}

interface FiltroImposto {
  competencia?: string;
  tipo?: TipoImposto;
  status?: StatusImposto;
}

/**
 * Página de Impostos e Obrigações Fiscais
 * Permite gerenciar impostos, guias e datas de vencimento.
 */
export default function ImpostosFiscais() {
  // Estados
  const [impostos, setImpostos] = useState<Imposto[]>(IMPOSTOS_MOCK);
  const [obrigacoes, setObrigacoes] = useState<Obrigacao[]>(OBRIGACOES_MOCK);
  const [abaSelecionada, setAbaSelecionada] = useState<'impostos' | 'obrigacoes'>('impostos');
  const [filtros, setFiltros] = useState<FiltroImposto>({
    competencia: format(new Date(), 'yyyy-MM')
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Formatar data
  function format(date: Date, formato: string): string {
    // Implementação simplificada - em produção usar date-fns
    if (formato === 'yyyy-MM') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // Formatar para exibição
  function formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return dia ? `${dia}/${mes}/${ano}` : `${mes}/${ano}`;
  }
  
  // Formatar valor monetário
  function formatarMoeda(valor?: number): string {
    if (valor === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
  
  // Status badges
  function getStatusImposto(status: StatusImposto): React.ReactNode {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pago</Badge>;
      case 'atrasado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Atrasado</Badge>;
      case 'isento':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Isento</Badge>;
      default:
        return null;
    }
  }
  
  function getStatusObrigacao(status: StatusObrigacao): React.ReactNode {
    switch (status) {
      case 'em_dia':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Em dia</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'atrasado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Atrasado</Badge>;
      default:
        return null;
    }
  }

  // Aplicar filtros
  function aplicarFiltros() {
    setIsLoading(true);
    
    // Simulação de chamada ao backend
    setTimeout(() => {
      setIsLoading(false);
      // Aqui implementaríamos a lógica real de filtragem ou busca na API
    }, 800);
  }
  
  // Registrar pagamento
  function registrarPagamento(id: string) {
    setIsLoading(true);
    
    // Simulação de chamada ao backend
    setTimeout(() => {
      const impostosAtualizados = impostos.map(imposto => {
        if (imposto.id === id) {
          return {
            ...imposto,
            status: 'pago' as StatusImposto,
            dataPagamento: format(new Date(), 'yyyy-MM-dd')
          };
        }
        return imposto;
      });
      
      setImpostos(impostosAtualizados);
      setIsLoading(false);
    }, 800);
  }
  
  // Registrar entrega de obrigação
  function registrarEntrega(id: string) {
    setIsLoading(true);
    
    // Simulação de chamada ao backend
    setTimeout(() => {
      const obrigacoesAtualizadas = obrigacoes.map(obrigacao => {
        if (obrigacao.id === id) {
          return {
            ...obrigacao,
            status: 'em_dia' as StatusObrigacao,
            ultimaEntrega: format(new Date(), 'yyyy-MM-dd')
          };
        }
        return obrigacao;
      });
      
      setObrigacoes(obrigacoesAtualizadas);
      setIsLoading(false);
    }, 800);
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Impostos e Obrigações Fiscais</h1>
          <p className="text-muted-foreground">
            Gerencie impostos, guias e obrigações acessórias da instituição
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Imposto
          </Button>
          
          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Calendário Fiscal - Card no topo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
            Calendário Fiscal - Próximos Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <CalendarioFiscalCard 
              titulo="Hoje" 
              quantidade={0}
              corFundo="bg-green-50"
              corTexto="text-green-700"
              corBorda="border-green-200"
            />
            
            <CalendarioFiscalCard 
              titulo="Próximos 7 dias" 
              quantidade={3}
              corFundo="bg-yellow-50"
              corTexto="text-yellow-700"
              corBorda="border-yellow-200"
            />
            
            <CalendarioFiscalCard 
              titulo="Próximos 15 dias" 
              quantidade={5}
              corFundo="bg-blue-50"
              corTexto="text-blue-700"
              corBorda="border-blue-200"
            />
            
            <CalendarioFiscalCard 
              titulo="Atrasados" 
              quantidade={0}
              corFundo="bg-red-50"
              corTexto="text-red-700"
              corBorda="border-red-200"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs para alternar entre Impostos e Obrigações */}
      <Tabs defaultValue="impostos" value={abaSelecionada} onValueChange={(v) => setAbaSelecionada(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="impostos" className="flex items-center">
            <DollarSignIcon className="w-4 h-4 mr-2" />
            Impostos e Guias
          </TabsTrigger>
          <TabsTrigger value="obrigacoes" className="flex items-center">
            <FileIcon className="w-4 h-4 mr-2" />
            Obrigações Acessórias
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="impostos">
          {/* Filtros para Impostos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FilterIcon className="w-5 h-5 mr-2 text-primary" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Competência">
                  <Input 
                    type="month" 
                    value={filtros.competencia} 
                    onChange={(e) => setFiltros({ ...filtros, competencia: e.target.value })}
                  />
                </FormField>
                
                <FormField label="Tipo">
                  <Select 
                    value={filtros.tipo} 
                    onChange={(value) => setFiltros({ ...filtros, tipo: value as TipoImposto })}
                  >
                    <option value="">Todos</option>
                    <option value="FEDERAL">Federal</option>
                    <option value="ESTADUAL">Estadual</option>
                    <option value="MUNICIPAL">Municipal</option>
                    <option value="OBRIGACAO">Obrigação</option>
                  </Select>
                </FormField>
                
                <FormField label="Status">
                  <Select 
                    value={filtros.status} 
                    onChange={(value) => setFiltros({ ...filtros, status: value as StatusImposto })}
                  >
                    <option value="">Todos</option>
                    <option value="pendente">Pendentes</option>
                    <option value="pago">Pagos</option>
                    <option value="atrasado">Atrasados</option>
                    <option value="isento">Isentos</option>
                  </Select>
                </FormField>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={aplicarFiltros}>
                  Aplicar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabela de Impostos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSignIcon className="w-5 h-5 mr-2 text-primary" />
                Impostos e Guias
              </CardTitle>
              <CardDescription>
                Impostos e guias para a competência {formatarData(filtros.competencia || '')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imposto</TableHead>
                        <TableHead>Competência</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {impostos.map((imposto) => (
                        <TableRow key={imposto.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{imposto.nome}</div>
                              <div className="text-sm text-muted-foreground">{imposto.descricao}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatarData(imposto.competencia)}</TableCell>
                          <TableCell>{formatarData(imposto.vencimento)}</TableCell>
                          <TableCell className="text-right">{formatarMoeda(imposto.valor)}</TableCell>
                          <TableCell>{getStatusImposto(imposto.status)}</TableCell>
                          <TableCell>
                            {imposto.dataPagamento ? (
                              formatarData(imposto.dataPagamento)
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                              {imposto.status === 'pendente' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => registrarPagamento(imposto.id)}
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="obrigacoes">
          {/* Tabela de Obrigações Acessórias */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileIcon className="w-5 h-5 mr-2 text-primary" />
                Obrigações Acessórias
              </CardTitle>
              <CardDescription>
                Monitoramento de obrigações acessórias e seus prazos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Obrigação</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Próximo Vencimento</TableHead>
                        <TableHead>Última Entrega</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {obrigacoes.map((obrigacao) => (
                        <TableRow key={obrigacao.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{obrigacao.nome}</div>
                              <div className="text-sm text-muted-foreground">{obrigacao.descricao}</div>
                            </div>
                          </TableCell>
                          <TableCell>{obrigacao.prazo}</TableCell>
                          <TableCell>{formatarData(obrigacao.proxVencimento)}</TableCell>
                          <TableCell>
                            {obrigacao.ultimaEntrega ? (
                              formatarData(obrigacao.ultimaEntrega)
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>{getStatusObrigacao(obrigacao.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                              {obrigacao.status === 'pendente' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => registrarEntrega(obrigacao.id)}
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para card de calendário fiscal
interface CalendarioFiscalCardProps {
  titulo: string;
  quantidade: number;
  corFundo: string;
  corTexto: string;
  corBorda: string;
}

function CalendarioFiscalCard({ titulo, quantidade, corFundo, corTexto, corBorda }: CalendarioFiscalCardProps) {
  return (
    <div className={`flex items-center p-4 rounded-md border ${corBorda} ${corFundo}`}>
      <div className="mr-4">
        {quantidade > 0 ? (
          <AlertTriangleIcon className={`w-8 h-8 ${corTexto}`} />
        ) : (
          <CheckCircleIcon className={`w-8 h-8 ${corTexto}`} />
        )}
      </div>
      <div>
        <h3 className={`font-medium ${corTexto}`}>{titulo}</h3>
        <p className={`text-2xl font-bold ${corTexto}`}>{quantidade}</p>
      </div>
    </div>
  );
} 