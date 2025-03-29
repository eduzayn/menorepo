import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@edunexia/ui-components';
import { GitMergeIcon, RefreshCwIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

import { useContabilidade } from '../hooks/useContabilidade';
import { IntegracaoFinanceira } from '../types/contabilidade';

/**
 * Página de Integração com o Módulo Financeiro
 * Exibe e gerencia as integrações entre os módulos de contabilidade e financeiro
 */
export default function IntegracaoFinanceiraPage() {
  const [statusFiltro, setStatusFiltro] = useState<string | undefined>();
  
  const { 
    useIntegracoes, 
    useSincronizarFinanceiro 
  } = useContabilidade();
  
  // Busca as integrações de acordo com o filtro
  const { data: integracoes, isLoading, refetch } = useIntegracoes(statusFiltro);
  
  // Mutation para sincronizar com o financeiro
  const { mutate: sincronizar, isPending: sincronizando } = useSincronizarFinanceiro();
  
  // Função para iniciar sincronização manual
  const handleSincronizar = () => {
    sincronizar(undefined, {
      onSuccess: () => {
        refetch();
      }
    });
  };
  
  // Formata a data em formato legível
  const formatarData = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };
  
  // Retorna badge baseado no status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'processado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Processado</Badge>;
      case 'erro':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Erro</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="contabilidade-title">Integração com Financeiro</h1>
          <p className="text-muted-foreground">Gerencie a sincronização dos dados entre os módulos de contabilidade e financeiro</p>
        </div>
        
        <Button 
          onClick={handleSincronizar} 
          disabled={sincronizando}
          className="flex items-center"
        >
          {sincronizando ? <Spinner size="sm" className="mr-2" /> : <RefreshCwIcon className="w-4 h-4 mr-2" />}
          Sincronizar Agora
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitMergeIcon className="w-5 h-5 mr-2 text-primary" />
            Status da Integração
          </CardTitle>
          <CardDescription>
            Visão geral da integração entre os módulos de contabilidade e financeiro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-medium">Transações Sincronizadas</h3>
              </div>
              <p className="text-2xl font-bold">
                {integracoes?.filter(i => i.status === 'processado')?.length || 0}
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <RefreshCwIcon className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="font-medium">Pendentes de Processamento</h3>
              </div>
              <p className="text-2xl font-bold">
                {integracoes?.filter(i => i.status === 'pendente')?.length || 0}
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center mb-2">
                <AlertCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="font-medium">Erros de Integração</h3>
              </div>
              <p className="text-2xl font-bold">
                {integracoes?.filter(i => i.status === 'erro')?.length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="todos" className="mb-8">
        <TabsList>
          <TabsTrigger 
            value="todos" 
            onClick={() => setStatusFiltro(undefined)}
          >
            Todos
          </TabsTrigger>
          <TabsTrigger 
            value="pendentes" 
            onClick={() => setStatusFiltro('pendente')}
          >
            Pendentes
          </TabsTrigger>
          <TabsTrigger 
            value="processados" 
            onClick={() => setStatusFiltro('processado')}
          >
            Processados
          </TabsTrigger>
          <TabsTrigger 
            value="erros" 
            onClick={() => setStatusFiltro('erro')}
          >
            Erros
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-4">
          <ListaIntegracoes integracoes={integracoes} isLoading={isLoading} getStatusBadge={getStatusBadge} formatarData={formatarData} />
        </TabsContent>
        <TabsContent value="pendentes" className="mt-4">
          <ListaIntegracoes integracoes={integracoes} isLoading={isLoading} getStatusBadge={getStatusBadge} formatarData={formatarData} />
        </TabsContent>
        <TabsContent value="processados" className="mt-4">
          <ListaIntegracoes integracoes={integracoes} isLoading={isLoading} getStatusBadge={getStatusBadge} formatarData={formatarData} />
        </TabsContent>
        <TabsContent value="erros" className="mt-4">
          <ListaIntegracoes integracoes={integracoes} isLoading={isLoading} getStatusBadge={getStatusBadge} formatarData={formatarData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para exibir a lista de integrações
function ListaIntegracoes({ 
  integracoes, 
  isLoading, 
  getStatusBadge, 
  formatarData 
}: { 
  integracoes?: IntegracaoFinanceira[]; 
  isLoading: boolean; 
  getStatusBadge: (status: string) => React.ReactNode;
  formatarData: (dateString: string) => string;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!integracoes || integracoes.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-secondary/20">
        <p className="text-muted-foreground">Nenhum registro de integração encontrado.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-secondary/50">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Origem</th>
            <th className="py-3 px-4 text-left">Entidade</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Data de Criação</th>
            <th className="py-3 px-4 text-left">Processado em</th>
          </tr>
        </thead>
        <tbody>
          {integracoes.map((integracao) => (
            <tr key={integracao.id} className="border-t hover:bg-secondary/20">
              <td className="py-3 px-4 font-mono text-sm">{integracao.id.substring(0, 8)}...</td>
              <td className="py-3 px-4">
                {integracao.moduloOrigem === 'financeiro' ? 'Financeiro → Contabilidade' : 'Contabilidade → Financeiro'}
              </td>
              <td className="py-3 px-4">
                {integracao.entidadeTipo} (ID: {integracao.entidadeId.substring(0, 6)}...)
              </td>
              <td className="py-3 px-4">
                {getStatusBadge(integracao.status)}
                {integracao.erro && (
                  <p className="text-xs text-red-600 mt-1">{integracao.erro}</p>
                )}
              </td>
              <td className="py-3 px-4 text-sm">{formatarData(integracao.criadoEm)}</td>
              <td className="py-3 px-4 text-sm">
                {integracao.processadoEm ? formatarData(integracao.processadoEm) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 