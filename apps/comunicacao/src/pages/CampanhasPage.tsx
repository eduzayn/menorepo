import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { getCampanhas, criarCampanha } from '../services/comunicacao';
import type { Campanha, InsertCampanha, ComunicacaoTipoCampanha } from '../types/comunicacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CampanhasPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [formData, setFormData] = useState<{
    titulo: string;
    descricao: string;
    tipo: ComunicacaoTipoCampanha;
    conteudo: string;
    data_inicio: string;
  }>({
    titulo: '',
    descricao: '',
    tipo: 'marketing',
    conteudo: '',
    data_inicio: new Date().toISOString().split('T')[0],
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchCampanhas();
  }, []);

  const fetchCampanhas = async () => {
    try {
      setIsLoading(true);
      const data = await getCampanhas();
      setCampanhas(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const novaCampanha: InsertCampanha = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        status: 'ATIVO',
        data_inicio: formData.data_inicio
      };
      
      await criarCampanha(novaCampanha);
      setIsCreating(false);
      resetForm();
      fetchCampanhas();
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'marketing',
      conteudo: '',
      data_inicio: new Date().toISOString().split('T')[0],
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>;
      case 'FINALIZADO':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Finalizado</span>;
      case 'ARQUIVADO':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Arquivado</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">Campanhas</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isCreating ? (
          <div className="max-w-3xl mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Nome da Campanha
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="titulo"
                    id="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ex: Campanha de Matrícula 2024"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <div className="mt-1">
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={3}
                    value={formData.descricao}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Descreva o objetivo da campanha"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="marketing">Marketing</option>
                  <option value="notificacao">Notificação</option>
                  <option value="lembrete">Lembrete</option>
                  <option value="pesquisa">Pesquisa</option>
                </select>
              </div>

              <div>
                <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700">
                  Conteúdo
                </label>
                <div className="mt-1">
                  <textarea
                    id="conteudo"
                    name="conteudo"
                    rows={5}
                    value={formData.conteudo}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Digite o conteúdo da mensagem"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
                  Data de Início
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="data_inicio"
                    id="data_inicio"
                    value={formData.data_inicio}
                    onChange={handleChange}
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    resetForm();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Criar Campanha
                </button>
              </div>
            </form>
          </div>
        ) : (
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
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data de Início
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td className="px-6 py-4" colSpan={5}>
                            <div className="text-center text-sm text-gray-500">
                              Carregando campanhas...
                            </div>
                          </td>
                        </tr>
                      ) : campanhas.length === 0 ? (
                        <tr>
                          <td className="px-6 py-4" colSpan={5}>
                            <div className="text-center text-sm text-gray-500">
                              Nenhuma campanha encontrada.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        campanhas.map((campanha) => (
                          <tr key={campanha.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-1">
                                  <div className="text-sm font-medium text-gray-900">{campanha.titulo}</div>
                                  <div className="text-sm text-gray-500">{campanha.descricao.substring(0, 40)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{campanha.tipo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(campanha.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(campanha.data_inicio)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-3 justify-end">
                                <button className="text-indigo-600 hover:text-indigo-900" title="Editar">
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button className="text-green-600 hover:text-green-900" title="Enviar">
                                  <PaperAirplaneIcon className="h-5 w-5" />
                                </button>
                                <button className="text-red-600 hover:text-red-900" title="Excluir">
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 