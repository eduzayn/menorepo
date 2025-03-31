import React, { useState } from 'react';
// Removendo importações problemáticas
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeadCard } from '../components/crm/LeadCard';
import { LeadFilters } from '../components/crm/LeadFilters';
import { LeadMetrics } from '../components/crm/LeadMetrics';
import { Button } from '../mock-components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../mock-components';
import { useComunicacao } from '../contexts/ComunicacaoContext';
import type { Lead, LeadStatus } from '../types/comunicacao';
import { UserPlusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
// import { KanbanColumn } from '../components/crm/KanbanColumn';
import { NovoLeadForm } from '../components/crm/NovoLeadForm';
import { useLeads } from '../hooks/useLeads';

// Tipo para criação de leads
type LeadCreateData = Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>;

const statusMap = {
  'NOVO': 'Novos Leads',
  'EM_CONTATO': 'Em Contato',
  'QUALIFICADO': 'Qualificados',
  'CONVERTIDO': 'Convertidos',
  'PERDIDO': 'Perdidos'
} as const;

// Componente temporário para substituir o KanbanColumn
const SimpleKanbanColumn = ({ 
  title, 
  status, 
  leads = [], 
  onLeadDrop, 
  onLeadEdit, 
  onLeadView 
}: { 
  title: string; 
  status: LeadStatus; 
  leads: Lead[]; 
  onLeadDrop: (id: string, status: LeadStatus) => void; 
  onLeadEdit?: (lead: Lead) => void; 
  onLeadView?: (lead: Lead) => void; 
}) => (
  <div className="flex-shrink-0 w-80 bg-neutral-50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-primary bg-primary-lightest rounded-full">
        {leads.length}
      </span>
    </div>
    
    <div className="space-y-3">
      {leads.map((lead) => (
        <div key={lead.id} className="transform transition-transform hover:scale-[1.02]">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="font-medium">{lead.nome}</p>
            <p className="text-sm text-gray-500">{lead.email}</p>
            <div className="mt-2 flex justify-end gap-2">
              {onLeadEdit && (
                <button 
                  onClick={() => onLeadEdit(lead)} 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
              )}
              {onLeadView && (
                <button 
                  onClick={() => onLeadView(lead)} 
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Conversar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {leads.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-neutral-500">
            Nenhum lead neste status
          </p>
        </div>
      )}
    </div>
  </div>
);

// Versão simplificada do Dialog que não usa context
const SimpleDialog = ({ 
  open, 
  onOpenChange, 
  children, 
  className = "" 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg max-w-lg w-full ${className}`}>
        <div className="p-4">
          {children}
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

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
      const conversaId = await iniciarConversa({
        participante_id: lead.id,
        participante_tipo: 'LEAD',
        titulo: `Conversa com ${lead.nome}`,
        canal: 'CHAT'
      });
      if (conversaId) {
        // Navegar para a conversa
        window.location.href = `/conversas/${conversaId}`;
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
      toast.error('Não foi possível iniciar a conversa');
    }
  };

  const handleCreateLead = async (data: LeadCreateData) => {
    try {
      await createLead(data);
      setShowForm(false);
      toast.success('Lead criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
    }
  };

  const handleUpdateLead = async (data: Partial<Lead>) => {
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
        {/* Versão simplificada sem DndProvider */}
        <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
          {(Object.keys(statusMap) as LeadStatus[]).map((status) => (
            <SimpleKanbanColumn
              key={status}
              title={statusMap[status]}
              status={status}
              leads={leadsByStatus[status] || []}
              onLeadDrop={handleLeadDrop}
              onLeadEdit={handleEditLead}
              onLeadView={handleChatWithLead}
            />
          ))}
        </div>
      </div>

      {/* Modal de formulário simplificado */}
      <SimpleDialog open={showForm} onOpenChange={setShowForm} className="max-w-xl">
        <div>
          <h2 className="text-xl font-semibold mb-6">{selectedLead ? 'Editar Lead' : 'Novo Lead'}</h2>
          <NovoLeadForm
            initialData={selectedLead}
            onSubmit={selectedLead ? handleUpdateLead : handleCreateLead}
            onCancel={() => {
              setShowForm(false);
              setSelectedLead(null);
            }}
          />
        </div>
      </SimpleDialog>
    </div>
  );
} 