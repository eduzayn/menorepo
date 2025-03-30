import { useState, useEffect } from 'react';
import { ApiClient } from '@edunexia/api-client/src/client';
import { Lead, getAllLeads, updateLead, deleteLead } from '../../services/leads-service';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');
  
  // Criar uma instância do ApiClient diretamente para demonstração
  const apiClient = { /* Mock client */ } as ApiClient;

  // Carregar leads na montagem do componente
  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { leads: fetchedLeads, error } = await getAllLeads(
        apiClient, 
        statusFilter === 'all' ? undefined : statusFilter
      );
      
      if (error) throw error;
      
      setLeads(fetchedLeads);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Falha ao carregar os leads. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const { success, error } = await updateLead(apiClient, leadId, { status: newStatus });
      
      if (error) throw error;
      
      if (success) {
        // Atualizar a lista localmente após a atualização no servidor
        setLeads(prev => prev.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
      setError('Falha ao atualizar o status do lead. Por favor, tente novamente.');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const { success, error } = await deleteLead(apiClient, leadId);
      
      if (error) throw error;
      
      if (success) {
        // Remover o lead da lista localmente após exclusão no servidor
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      setError('Falha ao excluir o lead. Por favor, tente novamente.');
    }
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Cores de badge para cada status
  const getStatusBadgeColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Tradução dos status
  const getStatusTranslation = (status: Lead['status']) => {
    const translations: Record<Lead['status'], string> = {
      new: 'Novo',
      contacted: 'Contatado',
      qualified: 'Qualificado',
      converted: 'Convertido',
      rejected: 'Rejeitado'
    };
    return translations[status];
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Gerenciamento de Leads</h1>
          <p className="mt-2 text-sm text-gray-700">
            Visualize e gerencie os leads capturados pelo site institucional.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Ocorreu um erro
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <div className="mb-4">
          <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
            Filtrar por status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-md border border-gray-300 py-1 px-2 text-sm"
          >
            <option value="all">Todos</option>
            <option value="new">Novos</option>
            <option value="contacted">Contatados</option>
            <option value="qualified">Qualificados</option>
            <option value="converted">Convertidos</option>
            <option value="rejected">Rejeitados</option>
          </select>
        </div>
        
        {isLoading ? (
          <div className="mt-6 animate-pulse">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <th key={i} scope="col" className="px-3 py-3.5">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="whitespace-nowrap px-3 py-4">
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="mt-6 text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum lead encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'all'
                ? 'Ainda não existem leads cadastrados.'
                : `Não há leads com o status "${getStatusTranslation(statusFilter as Lead['status'])}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Nome
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {lead.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {lead.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(lead.status)}`}>
                        {getStatusTranslation(lead.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleViewDetails(lead)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        Detalhes
                      </button>
                      <div className="inline-block relative">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as Lead['status'])}
                          className="mr-2 rounded border-gray-300 py-1 pl-2 pr-7 text-xs"
                        >
                          <option value="new">Novo</option>
                          <option value="contacted">Contatado</option>
                          <option value="qualified">Qualificado</option>
                          <option value="converted">Convertido</option>
                          <option value="rejected">Rejeitado</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal de detalhes do lead */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Detalhes do Lead
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Nome</h4>
                        <p className="mt-1">{selectedLead.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p className="mt-1">{selectedLead.email}</p>
                      </div>
                      {selectedLead.phone && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                          <p className="mt-1">{selectedLead.phone}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Assunto</h4>
                        <p className="mt-1">{selectedLead.subject || '-'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Mensagem</h4>
                        <p className="mt-1 whitespace-pre-wrap">{selectedLead.message}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <p className="mt-1">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(selectedLead.status)}`}>
                            {getStatusTranslation(selectedLead.status)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Origem</h4>
                        <p className="mt-1">{selectedLead.source}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Data de criação</h4>
                        <p className="mt-1">{formatDate(selectedLead.created_at)}</p>
                      </div>
                      {selectedLead.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                          <p className="mt-1 whitespace-pre-wrap">{selectedLead.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 