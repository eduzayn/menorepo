import { ChevronLeftIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState, ReactNode } from 'react';
import type { Conversa } from '../../types/comunicacao';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { VideoCall } from './VideoCall';

interface ChatHeaderProps {
  conversa: Conversa;
  onBack?: () => void;
  onOptions?: () => void;
  actions?: ReactNode;
}

export function ChatHeader({ conversa, onBack, onOptions, actions }: ChatHeaderProps) {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  
  // Supomos que o primeiro participante que não é o usuário é o alvo da chamada
  const participanteId = conversa.participantes.find(p => p.id !== conversa.usuario_id)?.id;

  return (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-2">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{conversa.titulo}</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${conversa.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>{conversa.status === 'ATIVO' ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        
        {/* Ações customizadas */}
        {actions}
        
        {/* Botão de videochamada */}
        {participanteId && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsVideoCallActive(true)}
            className="text-blue-600"
            title="Iniciar videochamada"
          >
            <Icons.phone className="h-5 w-5" />
          </Button>
        )}
        
        {onOptions && (
          <Button variant="ghost" size="icon" onClick={onOptions}>
            <EllipsisVerticalIcon className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Modal de videochamada */}
      {isVideoCallActive && participanteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl h-[80vh]">
            <VideoCall 
              conversaId={conversa.id} 
              participanteId={participanteId} 
              onClose={() => setIsVideoCallActive(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
} 