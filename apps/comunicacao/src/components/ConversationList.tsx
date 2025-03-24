import { Conversa } from '../types/comunicacao';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationListProps {
  conversas: Conversa[];
  conversaSelecionada: Conversa | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function ConversationList({
  conversas,
  conversaSelecionada,
  onSelect,
  loading
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (conversas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Nenhuma conversa encontrada
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversas.map((conversa) => (
        <button
          key={conversa.id}
          onClick={() => onSelect(conversa.id)}
          className={`w-full p-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
            conversaSelecionada?.id === conversa.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {conversa.titulo}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {conversa.ultima_mensagem || 'Nenhuma mensagem'}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <p className="text-xs text-gray-500">
                {conversa.ultima_mensagem_at
                  ? formatDistanceToNow(new Date(conversa.ultima_mensagem_at), {
                      addSuffix: true,
                      locale: ptBR
                    })
                  : ''}
              </p>
              {conversa.nao_lidas > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                  {conversa.nao_lidas}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                conversa.status === 'ATIVO'
                  ? 'bg-green-100 text-green-800'
                  : conversa.status === 'ARQUIVADO'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {conversa.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
} 