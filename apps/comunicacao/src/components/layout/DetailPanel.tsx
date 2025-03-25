import { XMarkIcon, PhoneIcon, EnvelopeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useComunicacao } from '@/contexts/ComunicacaoContext';
import { formatarData } from '@/utils/data';

interface DetailPanelProps {
  onClose?: () => void;
  data?: {
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    lastContact?: string;
  };
}

export default function DetailPanel({ onClose, data }: DetailPanelProps) {
  const { conversaAtual, mensagens } = useComunicacao();

  const ultimasInteracoes = mensagens
    .slice(-5)
    .reverse()
    .map(msg => ({
      tipo: msg.tipo,
      conteudo: msg.conteudo,
      data: msg.criado_at,
    }));

  return (
    <div className="h-full flex flex-col bg-neutral-lightest">
      {/* Header */}
      <div className="p-4 border-b border-primary-light flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Detalhes do Contato</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-dark hover:text-gray-900"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Dados do Contato */}
      <div className="p-4 border-b border-primary-light">
        <div className="space-y-3">
          {data ? (
            <>
              <div>
                <label className="text-sm text-neutral-dark">Nome</label>
                <p className="text-gray-900">{data.name || 'Não informado'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-neutral-dark" />
                <p className="text-gray-900">{data.email || 'Não informado'}</p>
              </div>
              {data.phone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-neutral-dark" />
                  <p className="text-gray-900">{data.phone}</p>
                </div>
              )}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.status === 'ATIVO' ? 'bg-green-100 text-green-800' :
                  data.status === 'ARQUIVADO' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.status}
                </span>
              </div>
            </>
          ) : (
            <p className="text-neutral-dark text-center py-4">
              Selecione um contato para ver os detalhes
            </p>
          )}
        </div>
      </div>

      {/* Histórico de Interações */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-neutral-dark mb-4">Últimas Interações</h3>
        <div className="space-y-4">
          {ultimasInteracoes.length > 0 ? (
            ultimasInteracoes.map((interacao, index) => (
              <div key={index} className="flex items-start space-x-3">
                <ChatBubbleLeftIcon className="h-5 w-5 text-neutral-dark mt-1" />
                <div>
                  <p className="text-sm text-gray-900">{interacao.conteudo}</p>
                  <p className="text-xs text-neutral-dark mt-1">
                    {formatarData(interacao.data)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-dark text-center py-4">
              Nenhuma interação registrada
            </p>
          )}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="p-4 border-t border-primary-light">
        <h3 className="text-sm font-medium text-neutral-dark mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            Email
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-accent-mint text-gray-900 rounded-md hover:bg-green-400 transition-colors">
            <PhoneIcon className="h-4 w-4 mr-2" />
            Ligar
          </button>
        </div>
      </div>
    </div>
  );
} 