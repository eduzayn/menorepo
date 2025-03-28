import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@edunexia/ui-components/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@edunexia/ui-components/components/ui/tabs';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  LineChartIcon,
  AlertTriangleIcon,
  HandCoinsIcon
} from 'lucide-react';

import type { DashboardResumo } from '../../types/financeiro';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

interface DashboardSummaryProps {
  data: DashboardResumo;
  isLoading: boolean;
}

export function DashboardSummary({ data, isLoading }: DashboardSummaryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'mes' | 'ano'>('mes');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Atualizar a data atual a cada minuto
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h2>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">Carregando...</span>
          </div>
        </div>
        
        <Tabs defaultValue="mes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="mes">Este Mês</TabsTrigger>
            <TabsTrigger value="ano">Este Ano</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </CardTitle>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
      
      <Tabs 
        defaultValue="mes" 
        value={selectedPeriod}
        onValueChange={(value) => setSelectedPeriod(value as 'hoje' | 'mes' | 'ano')}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="mes">Este Mês</TabsTrigger>
          <TabsTrigger value="ano">Este Ano</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hoje" className="space-y-4">
          {/* Conteúdo do dia será implementado depois */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas de Hoje</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.receitas_mes_atual / 30)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projeção com base no mês
                </p>
              </CardContent>
            </Card>
            
            {/* Outros cards similares para o dia */}
          </div>
        </TabsContent>
        
        <TabsContent value="mes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.receitas_mes_atual)}</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.despesas_mes_atual)}</div>
                <p className="text-xs text-muted-foreground">
                  -1.5% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                <LineChartIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.saldo_atual)}</div>
                <p className="text-xs text-muted-foreground">
                  Fluxo de caixa mensal
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
                <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.inadimplencia_total)}</div>
                <p className="text-xs text-muted-foreground">
                  {data.percentual_inadimplencia.toFixed(1)}% do faturamento
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cobranças Pendentes</CardTitle>
                <CreditCardIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.cobrancas_pendentes}</div>
                <p className="text-xs text-muted-foreground">
                  Cobranças aguardando pagamento
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cobranças Pagas</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.cobrancas_pagas}</div>
                <p className="text-xs text-muted-foreground">
                  Cobranças confirmadas no mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cobranças Vencidas</CardTitle>
                <AlertTriangleIcon className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.cobrancas_vencidas}</div>
                <p className="text-xs text-muted-foreground">
                  Cobranças em atraso
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comissões a Pagar</CardTitle>
                <HandCoinsIcon className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.comissoes_a_pagar)}</div>
                <p className="text-xs text-muted-foreground">
                  Para consultores e polos
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ano" className="space-y-4">
          {/* Conteúdo do ano será implementado depois */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas do Ano</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.receitas_mes_atual * 12)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projeção com base no mês atual
                </p>
              </CardContent>
            </Card>
            
            {/* Outros cards similares para o ano */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 