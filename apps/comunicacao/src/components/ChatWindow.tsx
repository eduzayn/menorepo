import { useState, useRef, useEffect } from 'react';
import { Conversa, Mensagem } from '../types/comunicacao';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Icons } from './ui/icons';
import { VideoCall } from './chat/VideoCall';
import { Button } from './ui/button';

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
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
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

  // Obtém o ID do participante principal (excluindo o usuário atual)
  const participanteId = conversa.participantes.find(p => p.id !== conversa.usuario_id)?.id || '';

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
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setIsVideoCallActive(true)}
            title="Iniciar chamada de vídeo"
          >
            <Icons.camera className="h-4 w-4 mr-1" />
            <span>Chamada</span>
          </Button>
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

      {/* Chamada de vídeo (modal) */}
      {isVideoCallActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] overflow-hidden relative">
            <button
              onClick={() => setIsVideoCallActive(false)}
              className="absolute top-4 right-4 z-10 bg-gray-700 bg-opacity-50 text-white rounded-full p-1"
              title="Fechar"
            >
              <Icons.x className="h-5 w-5" />
            </button>
            <VideoCall
              conversaId={conversa.id}
              participanteId={participanteId}
              onClose={() => setIsVideoCallActive(false)}
            />
          </div>
        </div>
      )}

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
            <Icons.send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 