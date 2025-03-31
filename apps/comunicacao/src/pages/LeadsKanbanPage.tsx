import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeadCard } from '../components/crm/LeadCard';
import { LeadFilters } from '../components/crm/LeadFilters';
import { LeadMetrics } from '../components/crm/LeadMetrics';
import { Button } from '../mock-components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../mock-components';
import { useComunicacao } from '../contexts/ComunicacaoContext';
import type { Lead, LeadStatus } from '../types/comunicacao';
import { UserPlusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { LeadsKanban } from '../components/crm/LeadsKanban';
import { NovoLeadForm } from '../components/crm/NovoLeadForm';

const statusMap = {
  'NOVO': 'Novos Leads',
  'EM_CONTATO': 'Em Contato',
  'QUALIFICADO': 'Qualificados',
  'CONVERTIDO': 'Convertidos',
  'PERDIDO': 'Perdidos'
} as const;

export default function LeadsKanbanPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
  const [sortField, setSortField] = useState<'criado_at' | 'atualizado_at' | 'ultima_interacao'>('ultima_interacao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { leads, isLoading, error, createLead, updateLead, updateLeadStatus } = useLeads({
    busca: search,
    status: selectedStatus,
    ordenarPor: sortField,
    ordem: sortOrder
  });

  const { iniciarConversa } = useComunicacao();

  // Organizar leads por status para o Kanban
  const leadsByStatus = Object.keys(statusMap).reduce((acc, status) => {
    acc[status as LeadStatus] = leads.filter(lead => lead.status === status);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

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
      toast.success(`Lead movido para ${statusMap[newStatus]}`);
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
      toast.error('Erro ao mover o lead');
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowForm(true);
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
      toast.error('Não foi possível iniciar a conversa');
    }
  };

  const handleCreateLead = async (data: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    try {
      await createLead(data);
      setShowForm(false);
      toast.success('Lead criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
    }
  };

  const handleUpdateLead = async (data: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    if (!selectedLead) return;

    try {
      await updateLead(selectedLead.id, data);
      setShowForm(false);
      setSelectedLead(null);
      toast.success('Lead atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Erro ao atualizar lead');
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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
    <div className={`h-full flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">Kanban de Leads</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={toggleFullScreen}
            className="inline-flex items-center"
            title={isFullScreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </Button>

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

      {/* Conteúdo Kanban */}
      <div className="mt-4 flex-1 overflow-hidden">
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
      </div>

      {/* Modal de formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedLead ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
          </DialogHeader>
          <LeadForm
            initialData={selectedLead}
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