import { useState } from 'react';
// Comentando importações que estão causando problemas
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { TableCellsIcon, ViewColumnsIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
// Comentando importação do KanbanColumn que depende de react-dnd
// import { KanbanColumn } from '../components/crm/KanbanColumn';
import type { Lead, LeadStatus } from '../types/comunicacao';
import { classNames } from '../lib/utils';
import { useLeads } from '../hooks/useLeads';

// Atualizando o statusMap para corresponder exatamente ao tipo LeadStatus
const statusMap = {
  'NOVO': 'Novos Leads',
  'EM_CONTATO': 'Em Contato',
  'QUALIFICADO': 'Qualificados',
  'CONVERTIDO': 'Convertidos',
  'PERDIDO': 'Perdidos'
} as const;

// Componente temporário para substituir o KanbanColumn
const TempKanbanColumn = ({ 
  title, 
  status, 
  leads = [], 
  onLeadDrop, 
  onLeadView 
}: { 
  title: string; 
  status: LeadStatus; 
  leads: Lead[]; 
  onLeadDrop: (id: string, status: LeadStatus) => void; 
  onLeadView: (lead: Lead) => void; 
}) => (
  <div className="min-w-[300px] bg-gray-50 rounded-lg p-3">
    <h3 className="font-medium mb-3">{title} ({leads.length})</h3>
    <div className="space-y-2">
      {leads.map(lead => (
        <div key={lead.id} className="bg-white p-3 rounded shadow-sm">
          <p className="font-medium">{lead.nome}</p>
          <p className="text-sm text-gray-500">{lead.email}</p>
          <div className="mt-2 flex justify-end">
            <button 
              onClick={() => onLeadView(lead)} 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Conversar
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function LeadsPage() {
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const { leads = [], isLoading, error, updateLeadStatus } = useLeads();
  const navigate = useNavigate();
  const [isNovoLeadModalOpen, setIsNovoLeadModalOpen] = useState(false);

  // Agrupando leads por status para o kanban
  const leadsByStatus: Record<LeadStatus, Lead[]> = {
    'NOVO': [],
    'EM_CONTATO': [],
    'QUALIFICADO': [],
    'CONVERTIDO': [],
    'PERDIDO': []
  };
  
  // Preencheria com dados reais se estivessem disponíveis
  leads.forEach(lead => {
    if (leadsByStatus[lead.status]) {
      leadsByStatus[lead.status].push(lead);
    }
  });

  const handleLeadDrop = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
    }
  };

  const handleLeadView = (lead: Lead) => {
    // Armazena o ID do lead em localStorage para a página de conversas acessar
    localStorage.setItem('selected_lead_id', lead.id);
    localStorage.setItem('selected_lead_name', lead.nome);
    
    // Navega para a página de conversas
    navigate('/conversas');
    
    // Também poderia criar uma nova conversa via API e depois navegar diretamente
    // para a página de conversa específica
    console.log('Iniciando chat com:', lead.nome);
  };

  // Função para abrir o modal de novo lead
  const handleOpenNovoLeadModal = () => {
    setIsNovoLeadModalOpen(true);
  };

  // Função para fechar o modal de novo lead
  const handleCloseNovoLeadModal = () => {
    setIsNovoLeadModalOpen(false);
  };

  // Função para criar um novo lead
  const handleCreateLead = (data: any) => {
    // Implementação real chamaria a API para criar um lead
    console.log('Criando novo lead:', data);
    setIsNovoLeadModalOpen(false);
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

          <Link
            to="/leads/kanban"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ViewColumnsIcon className="h-5 w-5 mr-2" />
            Kanban Completo
          </Link>

          <button
            type="button"
            onClick={handleOpenNovoLeadModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 flex-1 overflow-hidden">
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
                              {statusMap[lead.status] || lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleLeadView(lead)}
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
          // Substituindo o DndProvider por uma div simples
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {(Object.keys(statusMap) as Array<LeadStatus>).map((status) => (
              <TempKanbanColumn
                key={status}
                title={statusMap[status]}
                status={status}
                leads={leadsByStatus[status] || []}
                onLeadDrop={handleLeadDrop}
                onLeadView={handleLeadView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Novo Lead */}
      {isNovoLeadModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Novo Lead</h3>
              <button onClick={handleCloseNovoLeadModal} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                canal_origem: formData.get('canal_origem')
              };
              handleCreateLead(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                  <input type="text" name="nome" id="nome" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                  <input type="email" name="email" id="email" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input type="tel" name="telefone" id="telefone" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="canal_origem" className="block text-sm font-medium text-gray-700">Canal de Origem</label>
                  <select name="canal_origem" id="canal_origem" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="">Selecione um canal</option>
                    <option value="site">Site</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="indicacao">Indicação</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseNovoLeadModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 