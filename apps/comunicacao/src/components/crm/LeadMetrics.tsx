import { useMemo } from 'react';
import type { Lead, LeadStatus } from '@/types/comunicacao';
import { Card } from '@/components/ui/card';
import {
  UsersIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface LeadMetricsProps {
  leads: Lead[];
}

export function LeadMetrics({ leads }: LeadMetricsProps) {
  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const leadsOnline = leads.filter(lead => lead.online).length;
    const leadsQualificados = leads.filter(lead => lead.status === 'QUALIFICADO').length;
    const leadsConvertidos = leads.filter(lead => lead.status === 'CONVERTIDO').length;
    const leadsPerdidos = leads.filter(lead => lead.status === 'PERDIDO').length;

    const taxaConversao = totalLeads > 0
      ? Math.round((leadsConvertidos / totalLeads) * 100)
      : 0;

    const taxaQualificacao = totalLeads > 0
      ? Math.round((leadsQualificados / totalLeads) * 100)
      : 0;

    const taxaPerda = totalLeads > 0
      ? Math.round((leadsPerdidos / totalLeads) * 100)
      : 0;

    const mediaEngajamento = leads.length > 0
      ? Math.round(leads.reduce((acc, lead) => acc + lead.engajamento, 0) / leads.length)
      : 0;

    return {
      totalLeads,
      leadsOnline,
      taxaConversao,
      taxaQualificacao,
      taxaPerda,
      mediaEngajamento,
    };
  }, [leads]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Leads</p>
            <p className="text-2xl font-semibold text-gray-900">{metrics.totalLeads}</p>
          </div>
          <UsersIcon className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Leads Online</p>
            <p className="text-2xl font-semibold text-gray-900">{metrics.leadsOnline}</p>
          </div>
          <ChartBarIcon className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
            <p className="text-2xl font-semibold text-gray-900">{metrics.taxaConversao}%</p>
          </div>
          <TrendingUpIcon className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Média de Engajamento</p>
            <p className="text-2xl font-semibold text-gray-900">{metrics.mediaEngajamento}%</p>
          </div>
          <ClockIcon className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>
    </div>
  );
} 