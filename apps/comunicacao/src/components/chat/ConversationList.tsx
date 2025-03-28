import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, Input } from '../ui';
import type { Conversa } from '../../types/comunicacao';

interface ConversationListProps {
  conversas: Conversa[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversas, selectedId, onSelect }: ConversationListProps) {
  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Conversas</h2>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <Input
          type="text"
          placeholder="Buscar conversa..."
          className="w-full"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversas.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma conversa encontrada
          </div>
        ) : (
          <div className="divide-y">
            {conversas.map((conversa) => (
              <button
                key={conversa.id}
                onClick={() => onSelect(conversa.id)}
                className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                  selectedId === conversa.id ? 'bg-accent/50' : ''
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
                      <p className="text-sm font-medium truncate">
                        {conversa.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(conversa.atualizado_at), 'HH:mm', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversa.ultima_mensagem_at ? 'Nova mensagem' : 'Nenhuma mensagem'}
                      </p>
                      {conversa.nao_lidas > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
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
    </Card>
  );
} 