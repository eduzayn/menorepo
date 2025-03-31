import React from 'react';
import type { Lead } from '../../types/comunicacao';

interface LeadMetricsProps {
  leads: Lead[];
}

export function LeadMetrics({ leads }: LeadMetricsProps) {
  // Cálculo de métricas básicas
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'NOVO').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'QUALIFICADO').length;
  const convertedLeads = leads.filter(lead => lead.status === 'CONVERTIDO').length;
  
  // Taxa de conversão
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  
  // Média de engajamento
  const avgEngagement = totalLeads > 0 
    ? Math.round(leads.reduce((sum, lead) => sum + lead.engajamento, 0) / totalLeads) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total de Leads</h3>
        <p className="text-2xl font-bold">{totalLeads}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Novos Leads</h3>
        <p className="text-2xl font-bold text-blue-600">{newLeads}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Qualificados</h3>
        <p className="text-2xl font-bold text-green-600">{qualifiedLeads}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Taxa de Conversão</h3>
        <p className="text-2xl font-bold text-purple-600">{conversionRate}%</p>
        <p className="text-xs text-gray-500">{convertedLeads} convertidos</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Engajamento Médio</h3>
        <p className="text-2xl font-bold text-amber-600">{avgEngagement}/10</p>
      </div>
    </div>
  );
} 