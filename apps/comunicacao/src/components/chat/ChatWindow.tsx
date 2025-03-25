import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import type { Conversa, Mensagem, ComunicacaoTipoMensagem } from '../../types/comunicacao';

interface ChatWindowProps {
  conversa: Conversa;
  mensagens: Mensagem[];
  onEnviarMensagem: (texto: string) => Promise<void>;
  onMarcarComoLida: () => Promise<void>;
  onIndicarDigitando: (digitando: boolean) => Promise<void>;
}

export function ChatWindow({
  conversa,
  mensagens,
  onEnviarMensagem,
  onMarcarComoLida,
  onIndicarDigitando
}: ChatWindowProps) {
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  useEffect(() => {
    if (conversa.nao_lidas > 0) {
      onMarcarComoLida();
    }
  }, [conversa.nao_lidas, onMarcarComoLida]);

  const handleEnviarMensagem = async (conteudo: string, tipo: ComunicacaoTipoMensagem) => {
    try {
      setLoading(true);
      await onEnviarMensagem(conteudo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <ChatHeader conversa={conversa} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => (
          <ChatMessage
            key={mensagem.id}
            mensagem={mensagem}
            isOwn={mensagem.remetente_id === conversa.usuario_id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <ChatInput onEnviar={handleEnviarMensagem} />
      </div>
    </Card>
  );
} 