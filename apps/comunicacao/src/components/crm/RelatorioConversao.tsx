import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Lead, LeadStatus } from '../../types/comunicacao';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DatePicker } from '../ui/date-picker';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ChartBarIcon, DownloadIcon, FilterIcon, RefreshIcon } from '@heroicons/react/24/outline';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RelatorioConversaoProps {
  periodoInicial?: 'semana' | 'mes' | 'trimestre' | 'ano';
}

// Mapa de cores para os status
const statusColors: Record<LeadStatus, string> = {
  'NOVO': 'bg-blue-500',
  'EM_CONTATO': 'bg-yellow-500',
  'QUALIFICADO': 'bg-indigo-500',
  'CONVERTIDO': 'bg-green-500',
  'PERDIDO': 'bg-red-500'
};

// Mapa de labels para os status
const statusLabels: Record<LeadStatus, string> = {
  'NOVO': 'Novos',
  'EM_CONTATO': 'Em Contato',
  'QUALIFICADO': 'Qualificados',
  'CONVERTIDO': 'Convertidos',
  'PERDIDO': 'Perdidos'
};

export function RelatorioConversao({ periodoInicial = 'mes' }: RelatorioConversaoProps) {
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'trimestre' | 'ano'>(periodoInicial);
  const [dataInicio, setDataInicio] = useState<Date>(() => {
    switch (periodoInicial) {
      case 'semana': return subDays(new Date(), 7);
      case 'mes': return subMonths(new Date(), 1);
      case 'trimestre': return subMonths(new Date(), 3);
      case 'ano': return subMonths(new Date(), 12);
    }
  });
  const [dataFim, setDataFim] = useState<Date>(new Date());
  const [agrupamento, setAgrupamento] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [isLoading, setIsLoading] = useState(false);
  const [dadosFunil, setDadosFunil] = useState<Record<LeadStatus, number>>({
    'NOVO': 0,
    'EM_CONTATO': 0,
    'QUALIFICADO': 0,
    'CONVERTIDO': 0,
    'PERDIDO': 0
  });
  const [tendencia, setTendencia] = useState<{
    status: LeadStatus,
    atual: number,
    anterior: number,
    variacao: number
  }[]>([]);
  const [taxaConversao, setTaxaConversao] = useState({
    novoParaContato: 0,
    contatoParaQualificado: 0,
    qualificadoParaConvertido: 0,
    geral: 0
  });
  const [activeTab, setActiveTab] = useState('funil');

  // Carregar dados quando os filtros mudarem
  useEffect(() => {
    carregarDados();
  }, [periodo, dataInicio, dataFim, agrupamento]);

  // Função para preparar datas com base no período selecionado
  const aplicarPeriodo = (novoPeriodo: 'semana' | 'mes' | 'trimestre' | 'ano') => {
    setPeriodo(novoPeriodo);
    let novaDataInicio;

    switch (novoPeriodo) {
      case 'semana':
        novaDataInicio = subDays(new Date(), 7);
        break;
      case 'mes':
        novaDataInicio = subMonths(new Date(), 1);
        break;
      case 'trimestre':
        novaDataInicio = subMonths(new Date(), 3);
        break;
      case 'ano':
        novaDataInicio = subMonths(new Date(), 12);
        break;
    }

    setDataInicio(novaDataInicio);
    setDataFim(new Date());
  };

  // Função principal para carregar os dados
  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // Dados para o funil
      await carregarDadosFunil();

      // Dados de tendência
      await carregarTendencias();

      // Taxas de conversão
      await calcularTaxasConversao();
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados para o funil de vendas
  const carregarDadosFunil = async () => {
    try {
      // Consultar leads por status no período
      const { data, error } = await supabase
        .from('leads')
        .select('status, count')
        .gte('criado_at', dataInicio.toISOString())
        .lte('criado_at', dataFim.toISOString())
        .group('status');

      if (error) throw error;

      // Formatar os dados para o estado
      const dadosFormatados: Record<LeadStatus, number> = {
        'NOVO': 0,
        'EM_CONTATO': 0,
        'QUALIFICADO': 0,
        'CONVERTIDO': 0,
        'PERDIDO': 0
      };

      data.forEach(item => {
        if (item.status in dadosFormatados) {
          dadosFormatados[item.status as LeadStatus] = item.count;
        }
      });

      setDadosFunil(dadosFormatados);
    } catch (error) {
      console.error('Erro ao carregar dados do funil:', error);
    }
  };

  // Carrega dados de tendência comparando períodos
  const carregarTendencias = async () => {
    try {
      // Calcular data início do período anterior para comparação
      const diferencaDias = (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24);
      const dataInicioAnterior = new Date(dataInicio);
      dataInicioAnterior.setDate(dataInicioAnterior.getDate() - diferencaDias);
      const dataFimAnterior = new Date(dataInicio);
      dataFimAnterior.setDate(dataFimAnterior.getDate() - 1);

      // Período atual
      const { data: dataAtual, error: errorAtual } = await supabase
        .from('leads')
        .select('status, count')
        .gte('criado_at', dataInicio.toISOString())
        .lte('criado_at', dataFim.toISOString())
        .group('status');

      if (errorAtual) throw errorAtual;

      // Período anterior
      const { data: dataAnterior, error: errorAnterior } = await supabase
        .from('leads')
        .select('status, count')
        .gte('criado_at', dataInicioAnterior.toISOString())
        .lte('criado_at', dataFimAnterior.toISOString())
        .group('status');

      if (errorAnterior) throw errorAnterior;

      // Processar dados para comparação
      const statusList: LeadStatus[] = ['NOVO', 'EM_CONTATO', 'QUALIFICADO', 'CONVERTIDO', 'PERDIDO'];
      const tendencias = statusList.map(status => {
        const atualItem = dataAtual.find(d => d.status === status);
        const anteriorItem = dataAnterior.find(d => d.status === status);
        
        const atual = atualItem ? atualItem.count : 0;
        const anterior = anteriorItem ? anteriorItem.count : 0;
        
        let variacao = 0;
        if (anterior > 0) {
          variacao = ((atual - anterior) / anterior) * 100;
        } else if (atual > 0) {
          variacao = 100; // 100% de aumento se não havia dados anteriores
        }
        
        return {
          status,
          atual,
          anterior,
          variacao
        };
      });

      setTendencia(tendencias);
    } catch (error) {
      console.error('Erro ao carregar tendências:', error);
    }
  };

  // Calcular taxas de conversão entre etapas do funil
  const calcularTaxasConversao = async () => {
    try {
      // Usar os dados já carregados
      const novoParaContato = dadosFunil.NOVO > 0 
        ? (dadosFunil.EM_CONTATO / dadosFunil.NOVO) * 100 
        : 0;
        
      const contatoParaQualificado = dadosFunil.EM_CONTATO > 0 
        ? (dadosFunil.QUALIFICADO / dadosFunil.EM_CONTATO) * 100 
        : 0;
        
      const qualificadoParaConvertido = dadosFunil.QUALIFICADO > 0 
        ? (dadosFunil.CONVERTIDO / dadosFunil.QUALIFICADO) * 100 
        : 0;
        
      const totalLeads = dadosFunil.NOVO + dadosFunil.EM_CONTATO + dadosFunil.QUALIFICADO + 
                          dadosFunil.CONVERTIDO + dadosFunil.PERDIDO;
      
      const geral = dadosFunil.NOVO > 0 
        ? (dadosFunil.CONVERTIDO / dadosFunil.NOVO) * 100 
        : 0;
        
      setTaxaConversao({
        novoParaContato,
        contatoParaQualificado,
        qualificadoParaConvertido,
        geral
      });
    } catch (error) {
      console.error('Erro ao calcular taxas de conversão:', error);
    }
  };

  // Função para exportar os dados para CSV
  const exportarCSV = () => {
    // Cabeçalho
    let csv = 'Status,Quantidade,Porcentagem\n';
    
    // Total de leads
    const total = Object.values(dadosFunil).reduce((a, b) => a + b, 0);
    
    // Adicionar linhas
    Object.entries(dadosFunil).forEach(([status, quantidade]) => {
      const porcentagem = total > 0 ? (quantidade / total) * 100 : 0;
      csv += `${statusLabels[status as LeadStatus]},${quantidade},${porcentagem.toFixed(2)}%\n`;
    });

    // Adicionar taxas de conversão
    csv += '\nTaxas de Conversão\n';
    csv += `Novo para Em Contato,${taxaConversao.novoParaContato.toFixed(2)}%\n`;
    csv += `Em Contato para Qualificado,${taxaConversao.contatoParaQualificado.toFixed(2)}%\n`;
    csv += `Qualificado para Convertido,${taxaConversao.qualificadoParaConvertido.toFixed(2)}%\n`;
    csv += `Taxa de Conversão Geral,${taxaConversao.geral.toFixed(2)}%\n`;
    
    // Criar e baixar o arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_conversao_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cálculo do total de leads
  const totalLeads = Object.values(dadosFunil).reduce((a, b) => a + b, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Relatório de Conversão
            </CardTitle>
            <CardDescription>
              Análise do funil de vendas e taxas de conversão entre {format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })} e {format(dataFim, 'dd/MM/yyyy', { locale: ptBR })}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportarCSV}
              className="flex items-center"
            >
              <DownloadIcon className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => carregarDados()}
              disabled={isLoading}
              className="flex items-center"
            >
              <RefreshIcon className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-medium">Período</label>
            <Select 
              value={periodo} 
              onValueChange={(value) => aplicarPeriodo(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última semana</SelectItem>
                <SelectItem value="mes">Último mês</SelectItem>
                <SelectItem value="trimestre">Último trimestre</SelectItem>
                <SelectItem value="ano">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Data Início</label>
            <DatePicker 
              value={dataInicio}
              onChange={setDataInicio}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Data Fim</label>
            <DatePicker 
              value={dataFim}
              onChange={setDataFim}
            />
          </div>
          
          <div className="space-y-1 flex-1">
            <label className="text-sm font-medium">Agrupamento</label>
            <Select 
              value={agrupamento} 
              onValueChange={(value) => setAgrupamento(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o agrupamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Por dia</SelectItem>
                <SelectItem value="semana">Por semana</SelectItem>
                <SelectItem value="mes">Por mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="funil" className="flex-1">Funil de Conversão</TabsTrigger>
            <TabsTrigger value="taxas" className="flex-1">Taxas de Conversão</TabsTrigger>
            <TabsTrigger value="tendencias" className="flex-1">Tendências</TabsTrigger>
          </TabsList>

          <TabsContent value="funil">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-gray-500">Total de Leads</div>
                  <div className="text-3xl font-bold">{totalLeads}</div>
                </div>

                {/* Funil Visual */}
                <div className="space-y-5">
                  {(['NOVO', 'EM_CONTATO', 'QUALIFICADO', 'CONVERTIDO', 'PERDIDO'] as LeadStatus[]).map((status, index) => {
                    const count = dadosFunil[status];
                    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                    // Largura diminui gradualmente para criar efeito de funil
                    const width = `${100 - (index * 5)}%`;
                    
                    return (
                      <div key={status} className="mx-auto" style={{ width }}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{statusLabels[status]}</span>
                          <span className="text-sm">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4">
                          <div 
                            className={`${statusColors[status]} h-4 rounded-full transition-all duration-500`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="taxas">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="text-sm font-medium text-gray-500">Taxa de Conversão Geral</div>
                  <div className="text-3xl font-bold">{taxaConversao.geral.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">
                    De Leads Novos para Convertidos
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Taxas de conversão entre etapas */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">Novo → Em Contato</div>
                        <div className="text-2xl font-bold mt-2">{taxaConversao.novoParaContato.toFixed(1)}%</div>
                        <Progress 
                          value={taxaConversao.novoParaContato} 
                          className="h-2 mt-2"
                          color="blue"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">Em Contato → Qualificado</div>
                        <div className="text-2xl font-bold mt-2">{taxaConversao.contatoParaQualificado.toFixed(1)}%</div>
                        <Progress 
                          value={taxaConversao.contatoParaQualificado} 
                          className="h-2 mt-2"
                          color="indigo"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">Qualificado → Convertido</div>
                        <div className="text-2xl font-bold mt-2">{taxaConversao.qualificadoParaConvertido.toFixed(1)}%</div>
                        <Progress 
                          value={taxaConversao.qualificadoParaConvertido} 
                          className="h-2 mt-2"
                          color="green"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tendencias">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-gray-500">Comparação com Período Anterior</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-right">Período Atual</th>
                        <th className="py-2 px-4 text-right">Período Anterior</th>
                        <th className="py-2 px-4 text-right">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tendencia.map(item => (
                        <tr key={item.status} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${statusColors[item.status]} mr-2`}></div>
                              {statusLabels[item.status]}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">{item.atual}</td>
                          <td className="py-3 px-4 text-right text-gray-500">{item.anterior}</td>
                          <td className={`py-3 px-4 text-right font-medium ${
                            item.variacao > 0 
                              ? 'text-green-600' 
                              : item.variacao < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {item.variacao > 0 ? '+' : ''}{item.variacao.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 