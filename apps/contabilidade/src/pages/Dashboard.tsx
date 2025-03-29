import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@edunexia/ui-components';
import { ChartBarIcon, TrendingUpIcon, DocumentTextIcon, CurrencyDollarIcon } from 'lucide-react';

/**
 * Página de Dashboard do módulo de contabilidade
 * Exibe um painel com visão geral da situação contábil
 */
export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="contabilidade-title">Dashboard Contábil</h1>
      
      <div className="dashboard-contabil mb-8">
        <div className="indicador-financeiro indicador-financeiro-positivo">
          <h3 className="text-lg font-medium">Saúde Fiscal</h3>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-2xl font-bold">92%</span>
          </div>
          <p className="text-sm mt-2">Acima da média do setor (85%)</p>
        </div>
        
        <div className="indicador-financeiro indicador-financeiro-neutro">
          <h3 className="text-lg font-medium">Obrigações Pendentes</h3>
          <div className="flex items-center mt-2">
            <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-2xl font-bold">3</span>
          </div>
          <p className="text-sm mt-2">Todas com prazo superior a 15 dias</p>
        </div>
        
        <div className="indicador-financeiro indicador-financeiro-positivo">
          <h3 className="text-lg font-medium">Economia Fiscal YTD</h3>
          <div className="flex items-center mt-2">
            <CurrencyDollarIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-2xl font-bold">R$ 28.490,00</span>
          </div>
          <p className="text-sm mt-2">12% acima do ano anterior</p>
        </div>
      </div>

      <h2 className="contabilidade-subtitle">Fechamento Mensal</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Balancete Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span>Receitas Totais</span>
              <span className="font-semibold">R$ 157.890,00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Despesas Totais</span>
              <span className="font-semibold">R$ 98.450,00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Resultado</span>
              <span className="font-bold text-green-600">R$ 59.440,00</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Impostos do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span>ICMS</span>
              <span className="font-semibold">R$ 12.890,00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>PIS/COFINS</span>
              <span className="font-semibold">R$ 7.450,00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>IRPJ/CSLL</span>
              <span className="font-semibold">R$ 9.120,00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="font-bold">R$ 29.460,00</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="contabilidade-subtitle">Calendário Fiscal</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Próximas Obrigações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 border rounded-md hover:bg-secondary/40">
              <div>
                <h4 className="font-medium">Entrega SPED Fiscal</h4>
                <p className="text-sm text-muted-foreground">Referente mês anterior</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">20/04/2025</p>
                <p className="text-sm text-muted-foreground">Em 22 dias</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 border rounded-md hover:bg-secondary/40">
              <div>
                <h4 className="font-medium">DARF PIS/COFINS</h4>
                <p className="text-sm text-muted-foreground">Regime não-cumulativo</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">25/04/2025</p>
                <p className="text-sm text-muted-foreground">Em 27 dias</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 border rounded-md hover:bg-secondary/40">
              <div>
                <h4 className="font-medium">GIAS Estaduais</h4>
                <p className="text-sm text-muted-foreground">SP, RJ e MG</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">10/05/2025</p>
                <p className="text-sm text-muted-foreground">Em 42 dias</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 