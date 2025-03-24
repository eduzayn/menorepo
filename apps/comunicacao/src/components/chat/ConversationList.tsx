import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@edunexia/ui-components';
import type { Conversa } from '../../types/comunicacao';

interface ConversationListProps {
  conversas: Conversa[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversas, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="h-full flex flex-col bg-neutral-lightest border-r border-primary-light">
      {/* Header */}
      <div className="p-4 border-b border-primary-light">
        <h2 className="text-lg font-medium text-gray-900">Conversas</h2>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-primary-light">
        <input
          type="text"
          placeholder="Buscar conversa..."
          className="w-full px-3 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversas.length === 0 ? (
          <div className="p-4 text-center text-neutral-dark">
            Nenhuma conversa encontrada
          </div>
        ) : (
          <div className="divide-y divide-primary-light">
            {conversas.map((conversa) => (
              <button
                key={conversa.id}
                onClick={() => onSelect(conversa.id)}
                className={`w-full p-4 text-left hover:bg-neutral-light transition-colors ${
                  selectedId === conversa.id ? 'bg-primary-light' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${conversa.titulo}`}
                      alt={conversa.titulo}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversa.titulo}
                      </p>
                      <p className="text-xs text-neutral-dark">
                        {format(new Date(conversa.atualizado_at), 'HH:mm', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-neutral-dark truncate">
                        {conversa.ultima_mensagem_at ? 'Nova mensagem' : 'Nenhuma mensagem'}
                      </p>
                      {conversa.nao_lidas > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                          {conversa.nao_lidas}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 