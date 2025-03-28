import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { LeadForm } from '@/components/crm/LeadForm';
import { LeadFilters } from '@/components/crm/LeadFilters';
import { LeadMetrics } from '@/components/crm/LeadMetrics';
import { LeadCard } from '@/components/crm/LeadCard';
import { LeadActivity } from '@/components/crm/LeadActivity';
import type { Lead } from '@/types/comunicacao';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Lead['status'] | null>(null);
  const [sort, setSort] = useState<'criado_at' | 'atualizado_at' | 'ultima_interacao'>('ultima_interacao');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { leads, isLoading, criar, atualizar, deletar } = useLeads({
    busca: search,
    status,
    ordenarPor: sort,
    ordem,
  });

  const handleCreateLead = async (data: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    try {
      await criar(data);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  const handleUpdateLead = async (data: Omit<Lead, 'id' | 'criado_at' | 'atualizado_at' | 'online' | 'ultimo_acesso'>) => {
    if (!selectedLead) return;

    try {
      await atualizar({ id: selectedLead.id, lead: data });
      setShowForm(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deletar(id);
      toast.success('Lead excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast.error('Erro ao excluir lead');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Lead
        </Button>
      </div>

      <LeadMetrics leads={leads} />

      <LeadFilters
        onSearch={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onOrderChange={setOrder}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={() => {
                setSelectedLead(lead);
                setShowForm(true);
              }}
              onView={() => setSelectedLead(lead)}
            />
          ))
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedLead ? 'Editar Lead' : 'Novo Lead'}
            </DialogTitle>
          </DialogHeader>
          <LeadForm
            lead={selectedLead || undefined}
            onSubmit={selectedLead ? handleUpdateLead : handleCreateLead}
            onCancel={() => {
              setShowForm(false);
              setSelectedLead(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Lead</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informações</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {selectedLead.nome}</p>
                  <p><span className="font-medium">Email:</span> {selectedLead.email}</p>
                  <p><span className="font-medium">Telefone:</span> {selectedLead.telefone}</p>
                  <p><span className="font-medium">Status:</span> {selectedLead.status}</p>
                  <p><span className="font-medium">Canal de Origem:</span> {selectedLead.canal_origem}</p>
                  <p><span className="font-medium">Engajamento:</span> {selectedLead.engajamento}%</p>
                </div>
              </div>
              <LeadActivity lead={selectedLead} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 