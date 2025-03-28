import { useState } from 'react';
import { ChartBarIcon, InboxIcon, ClockIcon, DevicePhoneMobileIcon, CalendarIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Skeleton } from '@/components/ui/skeleton';

// Componente para exibir um card de métrica
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  loading = false
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  description?: string;
  trend?: { value: number; positive: boolean };
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            {loading ? (
              <>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-9 w-20 mb-1" />
                {description && <Skeleton className="h-4 w-40" />}
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold mt-1">{value}</h3>
                  {trend && (
                    <span 
                      className={`text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {trend.positive ? '+' : ''}{trend.value}%
                    </span>
                  )}
                </div>
                {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
              </>
            )}
          </div>
          <div className="rounded-full bg-primary-light p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para o gráfico de barras de horários de engajamento
function HorariosEngajamentoChart({ loading = false }) {
  const chartData = [
    { hora: '08:00', engajamento: 35 },
    { hora: '10:00', engajamento: 58 },
    { hora: '12:00', engajamento: 42 },
    { hora: '14:00', engajamento: 65 },
    { hora: '16:00', engajamento: 72 },
    { hora: '18:00', engajamento: 54 },
    { hora: '20:00', engajamento: 48 },
  ];
  
  const maxEngajamento = Math.max(...chartData.map(item => item.engajamento));
  
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Horários de Maior Engajamento</h3>
      
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500">Horários com maior taxa de abertura e resposta</p>
          <div className="flex items-end h-[200px] space-x-4 mt-4">
            {chartData.map((item) => (
              <div key={item.hora} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-primary rounded-t-md w-full" 
                  style={{ height: `${(item.engajamento / maxEngajamento) * 100}%` }}
                ></div>
                <span className="text-xs mt-2 text-neutral-600">{item.hora}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="link" size="sm" className="text-xs">
              Ver análise detalhada
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Componente para o gráfico de efetividade por canal
function EfetividadeCanalChart({ loading = false }) {
  const canaisData = [
    { canal: 'WhatsApp', entrega: 98, abertura: 92, resposta: 45 },
    { canal: 'Email', entrega: 94, abertura: 62, resposta: 28 },
    { canal: 'SMS', entrega: 99, abertura: 78, resposta: 32 },
    { canal: 'Push', entrega: 96, abertura: 54, resposta: 18 },
  ];
  
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Efetividade por Canal</h3>
      
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500">Comparativo de taxas por canal de comunicação</p>
          <div className="space-y-6 mt-4">
            {canaisData.map((item) => (
              <div key={item.canal} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.canal}</span>
                  <div className="flex space-x-4 text-xs">
                    <span className="text-blue-600">{item.entrega}% entrega</span>
                    <span className="text-green-600">{item.abertura}% abertura</span>
                    <span className="text-amber-600">{item.resposta}% resposta</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: `${item.entrega}%` }}></div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: `${item.abertura}%` }}></div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-amber-500 h-full" style={{ width: `${item.resposta}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="link" size="sm" className="text-xs">
              Ver análise detalhada
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [periodo, setPeriodo] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleExportData = () => {
    // Implementar a exportação de dados
    alert('Exportando dados...');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Análise e Métricas de Comunicação</h1>
        <div className="flex space-x-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {periodo === 'custom' && (
            <div className="flex space-x-2">
              <DatePicker />
              <span className="self-center">até</span>
              <DatePicker />
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={handleExportData}
          >
            <ArrowDownOnSquareIcon className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Taxa de Entrega" 
              value="96.8%" 
              description="Média de todos os canais"
              icon={InboxIcon} 
              trend={{ value: 2.3, positive: true }}
              loading={loading}
            />
            <MetricCard 
              title="Taxa de Abertura" 
              value="72.5%" 
              description="Média de todos os canais"
              icon={ChartBarIcon} 
              trend={{ value: 3.7, positive: true }}
              loading={loading}
            />
            <MetricCard 
              title="Tempo Médio de Resposta" 
              value="4.8h" 
              description="Redução de 22min vs período anterior"
              icon={ClockIcon} 
              trend={{ value: 12.5, positive: true }}
              loading={loading}
            />
            <MetricCard 
              title="Canal Mais Efetivo" 
              value="WhatsApp" 
              description="Taxa de resposta de 45%"
              icon={DevicePhoneMobileIcon} 
              loading={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <HorariosEngajamentoChart loading={loading} />
            </Card>
            <Card>
              <EfetividadeCanalChart loading={loading} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Horários de Maior Engajamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 mb-6">
                  Análise detalhada dos horários com maior taxa de abertura e resposta por período do dia.
                </p>
                <HorariosEngajamentoChart loading={loading} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 mb-6">
                  Análise de engajamento por tipo de conteúdo enviado (texto, imagem, vídeo, etc).
                </p>
                {/* Placeholder para gráfico de tipos de conteúdo */}
                <div className="h-64 bg-neutral-50 flex items-center justify-center rounded-md border border-dashed border-neutral-200">
                  <p className="text-sm text-neutral-400">Dados de engajamento por tipo de conteúdo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Canal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500 mb-6">
                Comparativo completo entre canais de comunicação, incluindo taxas de entrega, abertura e resposta.
              </p>
              <EfetividadeCanalChart loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Campanhas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500 mb-6">
                Análise de métricas por campanha, incluindo alcance, engajamento e conversão.
              </p>
              {/* Placeholder para dados de campanhas */}
              <div className="h-64 bg-neutral-50 flex items-center justify-center rounded-md border border-dashed border-neutral-200">
                <p className="text-sm text-neutral-400">Dados de desempenho de campanhas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 