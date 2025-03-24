import { useState } from 'react';
import type { Conversa } from '../types/comunicacao';

export default function ConversasPage() {
  const [selectedConversa, setSelectedConversa] = useState<Conversa | null>(null);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Lista de Conversas */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Conversas</h2>
          <div className="mt-4 space-y-2">
            {/* Lista de conversas será adicionada aqui */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                Nenhuma conversa encontrada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversa ? (
          <>
            {/* Cabeçalho do Chat */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedConversa.titulo}
              </h3>
            </div>

            {/* Mensagens */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Mensagens serão adicionadas aqui */}
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-gray-500">
                  Nenhuma mensagem encontrada.
                </p>
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Enviar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Selecione uma conversa para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 