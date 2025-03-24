import { useState, useRef, useEffect } from 'react';
import { Conversa, Mensagem } from '../types/comunicacao';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PaperAirplaneIcon } from '@heroicons/react/outline';

interface ChatWindowProps {
  conversa: Conversa;
  mensagens: Mensagem[];
  onEnviarMensagem: (texto: string) => void;
  onMarcarComoLida: () => void;
  onIndicarDigitando: (digitando: boolean) => void;
}

export function ChatWindow({
  conversa,
  mensagens,
  onEnviarMensagem,
  onMarcarComoLida,
  onIndicarDigitando
}: ChatWindowProps) {
  const [texto, setTexto] = useState('');
  const mensagensRef = useRef<HTMLDivElement>(null);

  // Rolar para a última mensagem
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Marcar mensagens como lidas quando a conversa for selecionada
  useEffect(() => {
    onMarcarComoLida();
  }, [conversa.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (texto.trim()) {
      onEnviarMensagem(texto.trim());
      setTexto('');
    }
  };

  // Encontrar o participante que está digitando
  const participanteDigitando = conversa.digitando
    ? conversa.participantes.find(p => p.id === conversa.digitando)
    : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{conversa.titulo}</h2>
          <p className="text-sm text-gray-500">
            {conversa.participantes.length} participantes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              conversa.status === 'ATIVO'
                ? 'bg-green-100 text-green-800'
                : conversa.status === 'ARQUIVADO'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {conversa.status}
          </span>
        </div>
      </div>

      {/* Mensagens */}
      <div
        ref={mensagensRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`flex ${
              mensagem.remetente_id === conversa.usuario_id
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                mensagem.remetente_id === conversa.usuario_id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{mensagem.conteudo}</p>
              <p className="text-xs mt-1 opacity-75">
                {formatDistanceToNow(new Date(mensagem.criado_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            </div>
          </div>
        ))}
        {participanteDigitando && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-gray-500">
                  {participanteDigitando.nome} está digitando...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              onIndicarDigitando(!!e.target.value.trim());
            }}
            onBlur={() => onIndicarDigitando(false)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite sua mensagem..."
          />
          <button
            type="submit"
            disabled={!texto.trim()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 