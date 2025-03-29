import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, 
  Button, Badge, Spinner, Tabs, TabsContent, TabsList, TabsTrigger,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Form, FormField, Input, Select, DatePicker
} from '@edunexia/ui-components';
import { 
  ClipboardListIcon, RefreshCwIcon, UserIcon, 
  CalendarIcon, BriefcaseIcon, ReceiptIcon, FileTextIcon 
} from 'lucide-react';

import { useContabilidade } from '../hooks/useContabilidade';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Página de Integração com o Módulo RH
 * Exibe e gerencia as integrações entre os módulos de contabilidade e RH
 */
export default function IntegracaoRhPage() {
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<string>(
    format(new Date(), 'yyyy-MM')
  );
  const [filtrosFerias, setFiltrosFerias] = useState({
    dataInicio: format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), 'yyyy-MM-dd'),
    dataFim: format(new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0), 'yyyy-MM-dd'),
    status: 'pendente',
  });

  // Hooks de contabilidade para integração com RH
  const { 
    useFolhaPagamento,
    useContabilizarFolha,
    useDadosFerias,
    useContabilizarProvisaoFerias,
    useDadosBeneficios,
    useContabilizarBeneficios
  } = useContabilidade();
  
  // Consultas para os diferentes tipos de dados
  const { 
    data: dadosFolha, 
    isLoading: isLoadingFolha, 
    refetch: refetchFolha 
  } = useFolhaPagamento(mesAnoSelecionado);
  
  const { 
    data: dadosFerias, 
    isLoading: isLoadingFerias, 
    refetch: refetchFerias 
  } = useDadosFerias(filtrosFerias);
  
  const { 
    data: dadosBeneficios, 
    isLoading: isLoadingBeneficios, 
    refetch: refetchBeneficios 
  } = useDadosBeneficios(mesAnoSelecionado);
  
  // Mutations para contabilizar
  const { mutate: contabilizarFolha, isPending: isContabilizandoFolha } = useContabilizarFolha();
  const { mutate: contabilizarFerias, isPending: isContabilizandoFerias } = useContabilizarProvisaoFerias();
  const { mutate: contabilizarBeneficios, isPending: isContabilizandoBeneficios } = useContabilizarBeneficios();
  
  // Handlers
  const handleContabilizarFolha = () => {
    if (!dadosFolha?.idEntidade) return;
    
    contabilizarFolha({
      mesAno: mesAnoSelecionado,
      idFolha: dadosFolha.idEntidade
    }, {
      onSuccess: () => {
        refetchFolha();
      }
    });
  };
  
  const handleContabilizarFerias = () => {
    contabilizarFerias(mesAnoSelecionado, {
      onSuccess: () => {
        refetchFerias();
      }
    });
  };
  
  const handleContabilizarBeneficios = () => {
    if (!dadosBeneficios?.idEntidade) return;
    
    contabilizarBeneficios({
      mesAno: mesAnoSelecionado,
      idPeriodo: dadosBeneficios.idEntidade
    }, {
      onSuccess: () => {
        refetchBeneficios();
      }
    });
  };
  
  const formatMesAno = (mesAno: string) => {
    const [ano, mes] = mesAno.split('-');
    return `${mes}/${ano}`;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente_contabilizacao':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'ja_contabilizado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Contabilizado</Badge>;
      case 'erro':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Erro</Badge>;
      default:
        return null;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="contabilidade-title">Integração com RH</h1>
          <p className="text-muted-foreground">Gerencie a contabilização de folha de pagamento, férias e benefícios</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Período: {formatMesAno(mesAnoSelecionado)}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecionar Período</DialogTitle>
                <DialogDescription>
                  Escolha o mês e ano de referência para os dados de RH
                </DialogDescription>
              </DialogHeader>
              <Form onSubmit={(data) => {
                setMesAnoSelecionado(data.mesAno);
              }}>
                <FormField label="Mês/Ano" name="mesAno">
                  <Input 
                    type="month" 
                    defaultValue={mesAnoSelecionado} 
                    onChange={(e) => setMesAnoSelecionado(e.target.value)}
                  />
                </FormField>
                <div className="flex justify-end mt-4">
                  <Button type="submit">Aplicar</Button>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => {
            refetchFolha();
            refetchFerias();
            refetchBeneficios();
          }}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardListIcon className="w-5 h-5 mr-2 text-primary" />
            Status da Integração com RH
          </CardTitle>
          <CardDescription>
            Visão geral da integração entre os módulos de contabilidade e RH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard 
              icon={<UserIcon className="w-5 h-5 text-blue-600 mr-2" />}
              title="Folha de Pagamento"
              status={dadosFolha?.status || 'pendente_contabilizacao'}
              valor={dadosFolha?.data?.folhaPagamento?.totalSalarioBruto || 0}
              periodo={formatMesAno(mesAnoSelecionado)}
              isLoading={isLoadingFolha}
              getStatusBadge={getStatusBadge}
              formatCurrency={formatCurrency}
            />
            
            <StatusCard 
              icon={<CalendarIcon className="w-5 h-5 text-indigo-600 mr-2" />}
              title="Férias"
              status={dadosFerias?.status || 'pendente_contabilizacao'}
              valor={dadosFerias?.data?.ferias?.reduce((acc, f) => acc + f.valorTotal, 0) || 0}
              periodo={`${format(new Date(filtrosFerias.dataInicio), 'dd/MM/yyyy')} - ${format(new Date(filtrosFerias.dataFim), 'dd/MM/yyyy')}`}
              isLoading={isLoadingFerias}
              getStatusBadge={getStatusBadge}
              formatCurrency={formatCurrency}
            />
            
            <StatusCard 
              icon={<BriefcaseIcon className="w-5 h-5 text-purple-600 mr-2" />}
              title="Benefícios"
              status={dadosBeneficios?.status || 'pendente_contabilizacao'}
              valor={dadosBeneficios?.data?.beneficios?.reduce((acc, b) => acc + b.valorTotal, 0) || 0}
              periodo={formatMesAno(mesAnoSelecionado)}
              isLoading={isLoadingBeneficios}
              getStatusBadge={getStatusBadge}
              formatCurrency={formatCurrency}
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="folha" className="mb-8">
        <TabsList>
          <TabsTrigger value="folha">
            Folha de Pagamento
          </TabsTrigger>
          <TabsTrigger value="ferias">
            Férias
          </TabsTrigger>
          <TabsTrigger value="beneficios">
            Benefícios
          </TabsTrigger>
          <TabsTrigger value="relatorios">
            Relatórios
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="folha" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Folha de Pagamento - {formatMesAno(mesAnoSelecionado)}</CardTitle>
                <Button 
                  onClick={handleContabilizarFolha} 
                  disabled={
                    isContabilizandoFolha || 
                    !dadosFolha?.idEntidade || 
                    dadosFolha?.status === 'ja_contabilizado'
                  }
                >
                  {isContabilizandoFolha ? <Spinner size="sm" className="mr-2" /> : <ReceiptIcon className="w-4 h-4 mr-2" />}
                  Contabilizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingFolha ? (
                <div className="py-8 flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : dadosFolha?.data?.folhaPagamento ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-slate-500">Salários Brutos</h3>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(dadosFolha.data.folhaPagamento.totalSalarioBruto)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-slate-500">Descontos</h3>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(dadosFolha.data.folhaPagamento.totalDescontos)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-slate-500">Provisões</h3>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(dadosFolha.data.folhaPagamento.totalProvisoes)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-slate-500">Líquido</h3>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(dadosFolha.data.folhaPagamento.totalSalarioLiquido)}</p>
                    </div>
                  </div>
                  
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-2 border">Funcionário</th>
                        <th className="text-left p-2 border">Departamento</th>
                        <th className="text-right p-2 border">Bruto</th>
                        <th className="text-right p-2 border">Descontos</th>
                        <th className="text-right p-2 border">Líquido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosFolha.data.folhaPagamento.itens?.slice(0, 5).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-2 border">{item.funcionario.nome}</td>
                          <td className="p-2 border">{item.funcionario.departamento}</td>
                          <td className="p-2 border text-right">{formatCurrency(item.salarioBruto)}</td>
                          <td className="p-2 border text-right">{formatCurrency(
                            item.descontos.inss + item.descontos.irrf + item.descontos.outrosDescontos
                          )}</td>
                          <td className="p-2 border text-right">{formatCurrency(item.salarioLiquido)}</td>
                        </tr>
                      ))}
                      {dadosFolha.data.folhaPagamento.itens?.length > 5 && (
                        <tr>
                          <td colSpan={5} className="p-2 border text-center text-slate-500">
                            + {dadosFolha.data.folhaPagamento.itens.length - 5} funcionários
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Não há dados de folha de pagamento para o período selecionado.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ferias" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Férias - Período Atual</CardTitle>
                <Button 
                  onClick={handleContabilizarFerias} 
                  disabled={
                    isContabilizandoFerias || 
                    !dadosFerias?.data?.ferias?.length || 
                    dadosFerias?.status === 'ja_contabilizado'
                  }
                >
                  {isContabilizandoFerias ? <Spinner size="sm" className="mr-2" /> : <ReceiptIcon className="w-4 h-4 mr-2" />}
                  Contabilizar Provisões
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingFerias ? (
                <div className="py-8 flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : dadosFerias?.data?.ferias?.length ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-2 border">Funcionário</th>
                      <th className="text-left p-2 border">Período</th>
                      <th className="text-center p-2 border">Dias</th>
                      <th className="text-right p-2 border">Valor Férias</th>
                      <th className="text-right p-2 border">1/3</th>
                      <th className="text-right p-2 border">Total</th>
                      <th className="text-center p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFerias.data.ferias.map((ferias) => (
                      <tr key={ferias.id} className="hover:bg-slate-50">
                        <td className="p-2 border">{ferias.funcionario.nome}</td>
                        <td className="p-2 border">
                          {format(new Date(ferias.dataInicio), 'dd/MM/yyyy')} - {format(new Date(ferias.dataFim), 'dd/MM/yyyy')}
                        </td>
                        <td className="p-2 border text-center">{ferias.diasGozados}</td>
                        <td className="p-2 border text-right">{formatCurrency(ferias.valorFerias)}</td>
                        <td className="p-2 border text-right">{formatCurrency(ferias.valorTerco)}</td>
                        <td className="p-2 border text-right">{formatCurrency(ferias.valorTotal)}</td>
                        <td className="p-2 border text-center">
                          <Badge variant="outline" className={
                            ferias.status === 'contabilizada' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }>
                            {ferias.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Não há dados de férias para o período selecionado.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="beneficios" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Benefícios - {formatMesAno(mesAnoSelecionado)}</CardTitle>
                <Button 
                  onClick={handleContabilizarBeneficios} 
                  disabled={
                    isContabilizandoBeneficios || 
                    !dadosBeneficios?.idEntidade || 
                    dadosBeneficios?.status === 'ja_contabilizado'
                  }
                >
                  {isContabilizandoBeneficios ? <Spinner size="sm" className="mr-2" /> : <ReceiptIcon className="w-4 h-4 mr-2" />}
                  Contabilizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBeneficios ? (
                <div className="py-8 flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : dadosBeneficios?.data?.beneficios?.length ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left p-2 border">Tipo</th>
                      <th className="text-left p-2 border">Nome</th>
                      <th className="text-center p-2 border">Funcionários</th>
                      <th className="text-right p-2 border">Valor Total</th>
                      <th className="text-center p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosBeneficios.data.beneficios.map((beneficio) => (
                      <tr key={beneficio.id} className="hover:bg-slate-50">
                        <td className="p-2 border capitalize">{beneficio.tipo.replace('_', ' ')}</td>
                        <td className="p-2 border">{beneficio.nome}</td>
                        <td className="p-2 border text-center">{beneficio.funcionarios.length}</td>
                        <td className="p-2 border text-right">{formatCurrency(beneficio.valorTotal)}</td>
                        <td className="p-2 border text-center">
                          <Badge variant="outline" className={
                            beneficio.status === 'contabilizado' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : beneficio.status === 'processando'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                          }>
                            {beneficio.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Não há dados de benefícios para o período selecionado.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios para Contabilidade</CardTitle>
              <CardDescription>
                Relatórios de RH para fins contábeis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start p-4 h-auto">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <FileTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-medium">Custos de Pessoal por Departamento</span>
                    </div>
                    <p className="text-left text-sm text-slate-500">
                      Relatório analítico com a distribuição de custos de pessoal por departamento
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start p-4 h-auto">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <FileTextIcon className="w-5 h-5 mr-2 text-green-600" />
                      <span className="font-medium">Provisões Trabalhistas</span>
                    </div>
                    <p className="text-left text-sm text-slate-500">
                      Relatório com valores provisionados de férias, 13º e encargos
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start p-4 h-auto">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <FileTextIcon className="w-5 h-5 mr-2 text-purple-600" />
                      <span className="font-medium">Benefícios por Tipo</span>
                    </div>
                    <p className="text-left text-sm text-slate-500">
                      Relatório agrupado de benefícios por tipo e centro de custo
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start p-4 h-auto">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <FileTextIcon className="w-5 h-5 mr-2 text-amber-600" />
                      <span className="font-medium">Encargos Sociais</span>
                    </div>
                    <p className="text-left text-sm text-slate-500">
                      Relatório detalhado de encargos sociais e impostos sobre folha
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente auxiliar para cartões de status
interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  valor: number;
  periodo: string;
  isLoading: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  formatCurrency: (value: number) => string;
}

function StatusCard({ 
  icon, 
  title, 
  status, 
  valor, 
  periodo, 
  isLoading, 
  getStatusBadge, 
  formatCurrency 
}: StatusCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {!isLoading && getStatusBadge(status)}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold mb-1">{formatCurrency(valor)}</p>
          <p className="text-sm text-slate-500">Período: {periodo}</p>
        </>
      )}
    </div>
  );
} 