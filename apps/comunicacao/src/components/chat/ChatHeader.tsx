import { ChevronLeftIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { Conversa } from '../../types/comunicacao';

interface ChatHeaderProps {
  conversa: Conversa;
  onBack?: () => void;
  onOptions?: () => void;
}

export function ChatHeader({ conversa, onBack, onOptions }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-neutral-lightest border-b border-primary-light">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 text-neutral-dark hover:text-gray-900 lg:hidden"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${conversa.titulo}`}
              alt={conversa.titulo}
              className="h-10 w-10 rounded-full"
            />
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {conversa.titulo}
            </h2>
            <p className="text-sm text-neutral-dark">
              {conversa.status === 'ativo' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {onOptions && (
        <button
          onClick={onOptions}
          className="p-2 text-neutral-dark hover:text-gray-900 rounded-full hover:bg-neutral-light"
        >
          <EllipsisVerticalIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
} 