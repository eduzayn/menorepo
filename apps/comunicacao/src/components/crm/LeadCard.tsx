import { 
  PhoneIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import type { Lead } from '@/types/comunicacao';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useComunicacao } from '@/contexts/ComunicacaoContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
}

export function LeadCard({ lead, onEdit, onView }: LeadCardProps) {
  const { iniciarConversa, loading } = useComunicacao();

  const handleChatClick = async () => {
    try {
      await iniciarConversa({
        participante_id: lead.id,
        participante_tipo: 'LEAD',
        titulo: `Conversa com ${lead.nome}`,
        canal: 'CHAT'
      });
      toast.success('Conversa iniciada com sucesso!');
    } catch (error) {
      toast.error('Erro ao iniciar conversa');
      console.error('Erro ao iniciar conversa:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">{lead.nome}</h3>
            <span 
              className={cn(
                "h-2 w-2 rounded-full",
                lead.online ? "bg-green-500" : "bg-neutral-300"
              )}
              title={lead.online ? "Online" : "Offline"}
            />
          </div>
          <p className="text-xs text-neutral-500">{lead.canal_origem}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView?.(lead)}
            className="text-neutral-400 hover:text-primary transition-colors"
            title="Ver detalhes"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleChatClick}
            disabled={loading}
            className={cn(
              "text-neutral-400 hover:text-primary transition-colors",
              loading && "opacity-50 cursor-not-allowed"
            )}
            title="Iniciar conversa"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Informações de Contato */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-neutral-600">
          <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-neutral-600">
          <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{lead.telefone}</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center text-neutral-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            {formatDistanceToNow(new Date(lead.ultima_interacao), {
              locale: ptBR,
              addSuffix: true
            })}
          </span>
        </div>
        <div className="flex items-center">
          <div 
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              lead.engajamento >= 75 ? "bg-green-100 text-green-800" :
              lead.engajamento >= 50 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}
          >
            {lead.engajamento}% engajamento
          </div>
        </div>
      </div>

      {/* Observações (se houver) */}
      {lead.observacoes && (
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-600 line-clamp-2">
            {lead.observacoes}
          </p>
        </div>
      )}
    </div>
  );
} 