import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  PlusIcon, 
  TableCellsIcon, 
  ViewColumnsIcon, 
  FunnelIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { KanbanColumn } from '../components/crm/KanbanColumn';
import { LeadCard } from '../components/crm/LeadCard';
import { LeadMetrics } from '../components/crm/LeadMetrics';
import { LeadFilters } from '../components/crm/LeadFilters';
import { LeadForm } from '../components/crm/LeadForm';
import { LeadActivity } from '../components/crm/LeadActivity';
import { useLeads } from '../hooks/useLeads';
import { useComunicacao } from '../contexts/ComunicacaoContext';
import type { Lead, LeadStatus } from '../types/comunicacao';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@edunexia/ui-components';
import { toast } from 'sonner';

const statusMap = {
  'NOVO': 'Novos Leads',
  'EM_CONTATO': 'Em Contato',
  'QUALIFICADO': 'Qualificados',
  'CONVERTIDO': 'Convertidos',
  'PERDIDO': 'Perdidos'
} as const;

export default function CRMPage() {
  const [viewType, setViewType] = useState<'kanban' | 'funil'>('kanban');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
  const [sortField, setSortField] = useState<'criado_at' | 'atualizado_at' | 'ultima_interacao'>('ultima_interacao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { leads, isLoading, error, createLead, updateLead, updateLeadStatus, deleteLead } = useLeads({
    busca: search,
    status: selectedStatus,
    ordenarPor: sortField,
    ordem: sortOrder
  });

  const { iniciarConversa, loading: conversaLoading } = useComunicacao();

  // Organizar leads por status para o Kanban
  const leadsByStatus = Object.keys(statusMap).reduce((acc, status) => {
    acc[status as LeadStatus] = leads.filter(lead => lead.status === status);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  // Agrupar leads para o funil
  const leadsCount = Object.keys(statusMap).reduce((acc, status) => {
    acc[status as LeadStatus] = leads.filter(lead => lead.status === status).length;
    return acc;
  }, {} as Record<LeadStatus, number>);

  const totalLeads = leads.length;

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleStatusChange = (status: LeadStatus | null) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (field: 'criado_at' | 'atualizado_at' | 'ultima_interacao') => {
    setSortField(field);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const handleLeadDrop = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowForm(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    // Aqui poderia navegar para uma página de detalhes
    toast.info(`Visualizando lead: ${lead.nome}`);
  };

  const handleChatWithLead = async (lead: Lead) => {
    try {
      const conversaId = await iniciarConversa(lead);
      if (conversaId) {
        // Navegar para a conversa
        window.location.href = `/?conversa=${conversaId}`;
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
    }
  };

  const handleCreateLead = async (data: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    try {
      await createLead(data);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  const handleUpdateLead = async (data: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    if (!selectedLead) return;

    try {
      await updateLead(selectedLead.id, data);
      setShowForm(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-600">
        Erro ao carregar leads. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">CRM - Gestão de Leads</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-3">
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewType('kanban')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border border-gray-300 
                ${viewType === 'kanban' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewType('funil')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border border-gray-300 
                ${viewType === 'funil' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } -ml-px focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>

          <Button
            onClick={() => {
              setSelectedLead(null);
              setShowForm(true);
            }}
            className="inline-flex items-center"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-4">
        <LeadFilters
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          onOrderChange={handleOrderChange}
        />
      </div>

      {/* Métricas */}
      <div className="my-4">
        <LeadMetrics leads={leads} />
      </div>

      {/* Conteúdo */}
      <div className="mt-4 flex-1 overflow-hidden">
        {viewType === 'kanban' ? (
          <DndProvider backend={HTML5Backend}>
            <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
              {(Object.keys(statusMap) as LeadStatus[]).map((status) => (
                <KanbanColumn
                  key={status}
                  title={statusMap[status]}
                  status={status}
                  leads={leadsByStatus[status] || []}
                  onLeadDrop={handleLeadDrop}
                  onLeadEdit={handleEditLead}
                  onLeadChat={handleChatWithLead}
                />
              ))}
            </div>
          </DndProvider>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Funil de Conversão</h3>
              
              {Object.entries(statusMap).map(([status, label], index) => {
                const count = leadsCount[status as LeadStatus] || 0;
                const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                const width = `${percentage}%`;
                
                // Cores para cada estágio do funil
                const colors = [
                  'bg-blue-500',
                  'bg-indigo-500',
                  'bg-purple-500',
                  'bg-green-500',
                  'bg-red-500'
                ];
                
                return (
                  <div key={status} className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className="text-sm text-gray-500">{count} leads ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`${colors[index]} h-4 rounded-full transition-all duration-500`} 
                        style={{ width }}
                      ></div>
                    </div>
                    
                    {/* Lista de leads neste estágio */}
                    {count > 0 && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {leadsByStatus[status as LeadStatus].slice(0, 4).map(lead => (
                          <div 
                            key={lead.id}
                            className="text-sm p-2 bg-gray-50 rounded flex justify-between items-center"
                          >
                            <span className="truncate">{lead.nome}</span>
                            <button 
                              onClick={() => handleChatWithLead(lead)}
                              className="text-indigo-600 hover:text-indigo-800"
                              disabled={conversaLoading}
                            >
                              Conversar
                            </button>
                          </div>
                        ))}
                        {leadsByStatus[status as LeadStatus].length > 4 && (
                          <div className="text-sm text-center p-2 bg-gray-50 rounded text-gray-500">
                            + {leadsByStatus[status as LeadStatus].length - 4} leads
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal do formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedLead ? 'Editar Lead' : 'Novo Lead'}
            </DialogTitle>
          </DialogHeader>
          <LeadForm
            lead={selectedLead}
            onSubmit={selectedLead ? handleUpdateLead : handleCreateLead}
            onCancel={() => {
              setShowForm(false);
              setSelectedLead(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 