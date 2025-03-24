import { useState, useEffect, useRef } from 'react';
import { Mensagem } from '../../types/comunicacao';
import { getMensagens, enviarMensagem } from '../../services/comunicacao';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card } from '@edunexia/ui-components';

interface ChatWindowProps {
  conversaId: string;
}

export function ChatWindow({ conversaId }: ChatWindowProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMensagens();
  }, [conversaId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const loadMensagens = async () => {
    try {
      setLoading(true);
      const data = await getMensagens(conversaId);
      setMensagens(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarMensagem = async (conteudo: string, tipo: 'texto' | 'imagem' | 'arquivo' = 'texto') => {
    try {
      const novaMensagem = await enviarMensagem(conversaId, conteudo, tipo);
      if (novaMensagem) {
        setMensagens(prev => [...prev, novaMensagem]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => (
          <ChatMessage
            key={mensagem.id}
            mensagem={mensagem}
            isOwn={mensagem.remetente_id === 'current-user-id'} // TODO: Substituir pelo ID real do usuário
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