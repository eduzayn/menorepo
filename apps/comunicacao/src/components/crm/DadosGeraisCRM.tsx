import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Lead, Oportunidade } from '../../types/comunicacao';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription,
  Spinner
} from '@edunexia/ui-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  UserIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  UsersIcon
} from '@heroicons/react/24/outline';

// Interface para dados gerais do CRM
interface DadosCRM {
  totalLeads: number;
  novosLeadsMes: number;
  leadsQualificados: number;
  totalOportunidades: number;
  valorPipeline: number;
  valorPonderado: number;
  conversaoMes: number;
  conversaoTotal: number;
}

export function DadosGeraisCRM() {
  const [dados, setDados] = useState<DadosCRM | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do CRM
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        
        // Buscar todos os leads
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('*');
          
        if (leadsError) throw leadsError;
        
        // Buscar todas as oportunidades
        const { data: oportunidades, error: opError } = await supabase
          .from('oportunidades')
          .select('*');
          
        if (opError) throw opError;
        
        // Calcular métricas
        const dataAtual = new Date();
        const inicioMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
        
        // Total de leads
        const totalLeads = leads ? leads.length : 0;
        
        // Novos leads no mês atual
        const novosLeadsMes = leads 
          ? leads.filter(lead => {
              const dataCriacao = new Date(lead.criado_at);
              return dataCriacao >= inicioMes;
            }).length
          : 0;
        
        // Leads qualificados
        const leadsQualificados = leads 
          ? leads.filter(lead => lead.status === 'QUALIFICADO').length
          : 0;
        
        // Total de oportunidades
        const totalOportunidades = oportunidades ? oportunidades.length : 0;
        
        // Valor total do pipeline
        const valorPipeline = oportunidades 
          ? oportunidades.reduce((sum, op) => sum + (op.valor || 0), 0)
          : 0;
        
        // Valor ponderado (valor * probabilidade / 100)
        const valorPonderado = oportunidades 
          ? oportunidades.reduce((sum, op) => sum + ((op.valor || 0) * (op.probabilidade / 100)), 0)
          : 0;
        
        // Taxa de conversão no mês atual
        const leadsConvertidosMes = leads 
          ? leads.filter(lead => {
              const dataAtualizacao = new Date(lead.atualizado_at);
              return lead.status === 'CONVERTIDO' && dataAtualizacao >= inicioMes;
            }).length
          : 0;
          
        const novosLeadsTotaisMes = leads 
          ? leads.filter(lead => {
              const dataCriacao = new Date(lead.criado_at);
              return dataCriacao >= inicioMes;
            }).length
          : 0;
        
        const conversaoMes = novosLeadsTotaisMes > 0 
          ? (leadsConvertidosMes / novosLeadsTotaisMes) * 100
          : 0;
        
        // Taxa de conversão total
        const leadsConvertidosTotal = leads 
          ? leads.filter(lead => lead.status === 'CONVERTIDO').length
          : 0;
          
        const conversaoTotal = totalLeads > 0 
          ? (leadsConvertidosTotal / totalLeads) * 100
          : 0;
        
        // Atualizar estado com dados calculados
        setDados({
          totalLeads,
          novosLeadsMes,
          leadsQualificados,
          totalOportunidades,
          valorPipeline,
          valorPonderado,
          conversaoMes,
          conversaoTotal
        });
      } catch (error) {
        console.error('Erro ao carregar dados do CRM:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarDados();
  }, []);

  // Formatação de valores monetários
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatação de percentuais
  const formatarPercentual = (valor: number): string => {
    return valor.toFixed(1) + '%';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="flex justify-center items-center h-32">
            <Spinner size="md" />
          </Card>
        ))}
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="text-center py-8 text-gray-500">
        Erro ao carregar dados do CRM. Tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card de Total de Leads */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-gray-600">
            <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
            Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dados.totalLeads}</div>
          <div className="text-sm text-gray-500 mt-1">
            {dados.novosLeadsMes} novos neste mês
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-gray-500">
            {dados.leadsQualificados} qualificados ({formatarPercentual(dados.leadsQualificados / dados.totalLeads * 100)})
          </div>
        </CardFooter>
      </Card>
      
      {/* Card de Oportunidades */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-gray-600">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-500" />
            Oportunidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dados.totalOportunidades}</div>
          <div className="text-sm text-gray-500 mt-1">
            Valor: {formatarMoeda(dados.valorPipeline)}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-gray-500">
            Valor ponderado: {formatarMoeda(dados.valorPonderado)}
          </div>
        </CardFooter>
      </Card>
      
      {/* Card de Conversão Mensal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-gray-600">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Conversão Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarPercentual(dados.conversaoMes)}</div>
          <div className="text-sm text-gray-500 mt-1">
            {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-gray-500">
            Comparado a {formatarPercentual(dados.conversaoTotal)} total
          </div>
        </CardFooter>
      </Card>
      
      {/* Card personalizado - Próximas Etapas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-gray-600">
            <UserIcon className="h-5 w-5 mr-2 text-purple-500" />
            Leads Qualificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dados.leadsQualificados}</div>
          <div className="text-sm text-gray-500 mt-1">
            Potencial: {formatarMoeda(dados.valorPonderado)}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-gray-500">
            {formatarPercentual(dados.leadsQualificados / dados.totalLeads * 100)} dos leads totais
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 