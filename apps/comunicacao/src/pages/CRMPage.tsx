import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from '../mock-components';
import { Button } from '../components/ui/button';
import { NovoLeadForm } from '../components/crm/NovoLeadForm';
import { useLeads } from '../hooks/useLeads';
import { toast } from 'sonner';
import type { Lead } from '../types/comunicacao';

export default function CRMPage() {
  const router = useRouter();
  const [showNovoLeadModal, setShowNovoLeadModal] = useState(false);
  const { createLead } = useLeads();

  const handleNovoLead = () => {
    setShowNovoLeadModal(true);
  };

  const handleCloseModal = () => {
    setShowNovoLeadModal(false);
  };

  const handleCreateLead = async (leadData: Partial<Lead>) => {
    try {
      await createLead(leadData);
      setShowNovoLeadModal(false);
      toast.success('Lead criado com sucesso!');
      router.push('/leads');
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM</h1>
        <Button onClick={handleNovoLead}>Novo Lead</Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Leads Ativos</h3>
          <p className="text-3xl font-bold">124</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Convertidos esta semana</h3>
          <p className="text-3xl font-bold">18</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Taxa de Conversão</h3>
          <p className="text-3xl font-bold">12,4%</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Leads Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Maria Silva</td>
                <td className="px-6 py-4 whitespace-nowrap">maria.silva@exemplo.com</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Qualificado</span></td>
                <td className="px-6 py-4 whitespace-nowrap">Site</td>
                <td className="px-6 py-4 whitespace-nowrap">10/05/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-right"><Button size="sm" variant="outline">Ver</Button></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">João Carlos</td>
                <td className="px-6 py-4 whitespace-nowrap">joao.carlos@exemplo.com</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Em Contato</span></td>
                <td className="px-6 py-4 whitespace-nowrap">WhatsApp</td>
                <td className="px-6 py-4 whitespace-nowrap">12/05/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-right"><Button size="sm" variant="outline">Ver</Button></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ana Beatriz</td>
                <td className="px-6 py-4 whitespace-nowrap">ana.beatriz@exemplo.com</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Novo</span></td>
                <td className="px-6 py-4 whitespace-nowrap">Facebook</td>
                <td className="px-6 py-4 whitespace-nowrap">14/05/2023</td>
                <td className="px-6 py-4 whitespace-nowrap text-right"><Button size="sm" variant="outline">Ver</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal para adicionar novo lead */}
      {showNovoLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Lead</h2>
            <NovoLeadForm onSubmit={handleCreateLead} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
} 