import { XMarkIcon } from '@heroicons/react/24/outline';

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
      
      {/* Dados do Lead/Aluno */}
      <div className="p-4 border-b border-primary-light">
        <div className="space-y-3">
          {data ? (
            <>
              <div>
                <label className="text-sm text-neutral-dark">Nome</label>
                <p className="text-gray-900">{data.name || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-dark">Email</label>
                <p className="text-gray-900">{data.email || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-dark">Telefone</label>
                <p className="text-gray-900">{data.phone || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-dark">Status</label>
                <p className="text-gray-900">{data.status || 'Não definido'}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-dark">Último Contato</label>
                <p className="text-gray-900">{data.lastContact || 'Nunca'}</p>
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
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-light">
        <h3 className="text-sm font-medium text-neutral-dark mb-4">Histórico de Interações</h3>
        <div className="space-y-4">
          {/* Placeholder para histórico */}
          <p className="text-neutral-dark text-center py-4">
            Nenhuma interação registrada
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="p-4 border-t border-primary-light bg-neutral-lightest">
        <h3 className="text-sm font-medium text-neutral-dark mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
            Enviar Mensagem
          </button>
          <button className="px-3 py-2 bg-accent-mint text-gray-900 rounded-md hover:bg-green-400 transition-colors">
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
} 