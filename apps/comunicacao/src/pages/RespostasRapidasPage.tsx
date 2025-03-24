import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { RespostaRapida } from '../types/comunicacao';

export default function RespostasRapidasPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">Respostas Rápidas</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nova Resposta Rápida
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isCreating ? (
          <div className="max-w-3xl mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="titulo"
                    id="titulo"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ex: Saudação Inicial"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="categoria"
                    id="categoria"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ex: Atendimento"
                  />
                </div>
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
                    placeholder="Digite o conteúdo da resposta rápida"
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
                  Criar Resposta Rápida
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Lista de respostas rápidas será adicionada aqui */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Nenhuma resposta rápida encontrada
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Crie uma nova resposta rápida para começar
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 