import React from 'react';
import { Card } from '../card/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ChatMessageProps {
  /**
   * Conteúdo da mensagem
   */
  content: string;
  
  /**
   * Tipo da mensagem
   */
  type?: 'TEXT' | 'IMAGE' | 'FILE';
  
  /**
   * Data e hora da mensagem
   */
  timestamp: Date;
  
  /**
   * Indica se a mensagem é do próprio usuário
   */
  isOwn?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente para exibir mensagens em interfaces de chat
 * 
 * @example
 * ```tsx
 * <ChatMessage
 *   content="Olá, como posso ajudar?"
 *   timestamp={new Date()}
 *   isOwn={false}
 * />
 * ```
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  type = 'TEXT', 
  timestamp, 
  isOwn = false,
  className = ''
}) => {
  const renderContent = () => {
    switch (type) {
      case 'IMAGE':
        return (
          <img
            src={content}
            alt="Imagem"
            className="max-w-xs rounded-lg"
          />
        );
      case 'FILE':
        return (
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Baixar arquivo
          </a>
        );
      default:
        return <p>{content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${className}`}>
      <Card
        className={`max-w-sm p-4 ${
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        {renderContent()}
        <div
          className={`text-xs mt-1 ${
            isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}
        >
          {format(timestamp, "HH:mm", {
            locale: ptBR,
          })}
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage; 