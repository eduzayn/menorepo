import { ChevronLeftIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { Conversa } from '../../types/comunicacao';

interface ChatHeaderProps {
  conversa: Conversa;
  onBack?: () => void;
  onOptions?: () => void;
}

export function ChatHeader({ conversa, onBack, onOptions }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{conversa.titulo}</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${conversa.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>{conversa.status === 'ATIVO' ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 