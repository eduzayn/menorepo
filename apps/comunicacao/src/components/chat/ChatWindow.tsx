import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatKnowledgeBase } from './ChatKnowledgeBase';
import { Book } from 'lucide-react';
import { Button } from '../ui/button';
import type { Conversa, Mensagem, ComunicacaoTipoMensagem } from '../../types/comunicacao';

interface ChatWindowProps {
  conversa: Conversa;
  mensagens: Mensagem[];
  onEnviarMensagem: (texto: string, metadados?: any) => Promise<void>;
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
  const [mostrarBaseConhecimento, setMostrarBaseConhecimento] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  useEffect(() => {
    if (conversa.nao_lidas > 0) {
      onMarcarComoLida();
    }
  }, [conversa.nao_lidas, onMarcarComoLida]);

  const handleEnviarMensagem = async (conteudo: string, tipo: ComunicacaoTipoMensagem = 'TEXTO', metadados?: any) => {
    try {
      setLoading(true);
      await onEnviarMensagem(conteudo, metadados);
    } finally {
      setLoading(false);
    }
  };

  const toggleBaseConhecimento = () => {
    setMostrarBaseConhecimento(!mostrarBaseConhecimento);
  };

  return (
    <div className="flex h-full">
      <Card className="flex flex-col h-full flex-1">
        <ChatHeader 
          conversa={conversa} 
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBaseConhecimento}
              className="flex items-center gap-1"
              title="Base de Conhecimento"
            >
              <Book className="h-4 w-4" />
              <span className="hidden md:inline">Base de Conhecimento</span>
            </Button>
          }
        />
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

      {/* Painel lateral da base de conhecimento */}
      {mostrarBaseConhecimento && (
        <div className="w-96 h-full border-l">
          <ChatKnowledgeBase 
            conversaId={conversa.id} 
            onClose={toggleBaseConhecimento} 
          />
        </div>
      )}
    </div>
  );
} 