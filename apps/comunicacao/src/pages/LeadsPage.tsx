import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TableCellsIcon, ViewColumnsIcon, PlusIcon } from '@heroicons/react/24/outline';
import { KanbanColumn } from '@/components/crm/KanbanColumn';
import type { Lead } from '@/types/comunicacao';
import { classNames } from '@/lib/utils';
import { useLeads } from '@/hooks/useLeads';

const statusMap = {
  'NOVO': 'Novos Leads',
  'QUALIFICADO': 'Qualificados',
  'CONTATO': 'Em Contato',
  'NEGOCIACAO': 'Em Negociação',
  'FECHADO': 'Fechados'
} as const;

export default function LeadsPage() {
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const { data: leads = [], isLoading, error, updateLeadStatus } = useLeads();

  const leadsByStatus = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = [];
    }
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<Lead['status'], Lead[]>);

  const handleLeadDrop = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
    }
  };

  const handleLeadChat = (lead: Lead) => {
    // Implementar navegação para a conversa
    console.log('Iniciar chat com:', lead);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Erro ao carregar leads. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">Leads</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center space-x-3">
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewType('list')}
              className={classNames(
                viewType === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-neutral-50',
                'px-4 py-2 text-sm font-medium rounded-l-md border border-neutral-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary'
              )}
            >
              <TableCellsIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewType('kanban')}
              className={classNames(
                viewType === 'kanban'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-neutral-50',
                '-ml-px px-4 py-2 text-sm font-medium rounded-r-md border border-neutral-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary'
              )}
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {viewType === 'list' ? (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-mail
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefone
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{lead.nome}</div>
                            <div className="text-sm text-gray-500">{lead.canal_origem}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.telefone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {statusMap[lead.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleLeadChat(lead)}
                              className="text-primary hover:text-primary-dark"
                            >
                              Conversar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {(Object.keys(statusMap) as Lead['status'][]).map((status) => (
                <KanbanColumn
                  key={status}
                  title={statusMap[status]}
                  status={status}
                  leads={leadsByStatus[status] || []}
                  onLeadDrop={handleLeadDrop}
                  onLeadChat={handleLeadChat}
                />
              ))}
            </div>
          </DndProvider>
        )}
      </div>
    </div>
  );
} 