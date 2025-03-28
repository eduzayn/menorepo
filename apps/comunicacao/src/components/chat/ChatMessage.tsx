import { Card } from '../ui';
import type { Mensagem } from '../../types/comunicacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatMessageProps {
  mensagem: Mensagem;
  isOwn?: boolean;
}

export function ChatMessage({ mensagem, isOwn = false }: ChatMessageProps) {
  const renderConteudo = () => {
    switch (mensagem.tipo) {
      case 'IMAGEM':
        return (
          <img
            src={mensagem.conteudo}
            alt="Imagem"
            className="max-w-xs rounded-lg"
          />
        );
      case 'ARQUIVO':
        return (
          <a
            href={mensagem.conteudo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Baixar arquivo
          </a>
        );
      default:
        return <p>{mensagem.conteudo}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <Card
        className={`max-w-sm p-4 ${
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        {renderConteudo()}
        <div
          className={`text-xs mt-1 ${
            isOwn ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          {format(new Date(mensagem.criado_at), "HH:mm", {
            locale: ptBR,
          })}
        </div>
      </Card>
    </div>
  );
} 