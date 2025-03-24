import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Campanha } from '../types/comunicacao';

export default function CampanhasPage() {
  const [isCreating, setIsCreating] = useState(false);

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
            <form className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome da Campanha
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="nome"
                    id="nome"
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
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Digite o conteúdo da mensagem"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
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
                      {/* Lista de campanhas será adicionada aqui */}
                      <tr>
                        <td className="px-6 py-4" colSpan={5}>
                          <div className="text-center text-sm text-gray-500">
                            Nenhuma campanha encontrada.
                          </div>
                        </td>
                      </tr>
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