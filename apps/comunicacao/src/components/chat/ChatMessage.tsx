import { Mensagem } from '../../types/comunicacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@edunexia/ui-components';

interface ChatMessageProps {
  mensagem: Mensagem;
  isOwn: boolean;
}

export function ChatMessage({ mensagem, isOwn }: ChatMessageProps) {
  const renderConteudo = () => {
    switch (mensagem.tipo) {
      case 'imagem':
        return (
          <img
            src={mensagem.conteudo}
            alt="Imagem"
            className="max-w-sm rounded-lg"
            loading="lazy"
          />
        );
      case 'arquivo':
        return (
          <a
            href={mensagem.conteudo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Baixar arquivo
          </a>
        );
      default:
        return <p className="whitespace-pre-wrap">{mensagem.conteudo}</p>;
    }
  };

  return (
    <div
      className={`flex ${
        isOwn ? 'justify-end' : 'justify-start'
      }`}
    >
      <Card
        className={`max-w-[70%] ${
          isOwn
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="text-sm">{renderConteudo()}</div>
        <div
          className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
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