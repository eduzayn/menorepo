import { useState } from 'react';
import { Conversa } from '../types/comunicacao';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ConversationList } from '../components/chat/ConversationList';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '@edunexia/ui-components';

const TIPO_MENSAGEM = {
  TEXTO: 'texto',
  IMAGEM: 'imagem',
  ARQUIVO: 'arquivo',
  VIDEO: 'video',
  AUDIO: 'audio',
  LOCALIZACAO: 'localizacao'
} as const;

export function ConversasPage() {
  const { user } = useAuth();
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const { 
    conversa,
    mensagens,
    loading,
    enviarMensagem,
    marcarComoLida,
    indicarDigitando,
    error,
    usuarioDigitando
  } = useChat({ conversaId: conversaSelecionada?.id });

  const handleSelecionarConversa = (id: string) => {
    // TODO: Buscar conversa pelo ID
    // Por enquanto, vamos apenas simular
    const conversa: Conversa = {
      id,
      titulo: `Conversa ${id}`,
      status: 'ativo',
      canal: 'chat',
      participantes: [],
      criado_at: new Date().toISOString(),
      atualizado_at: new Date().toISOString(),
      nao_lidas: 0
    };
    setConversaSelecionada(conversa);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Faça login para acessar o chat</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      <div className="w-80 border-r border-gray-200">
        <ConversationList
          conversas={[]}
          selectedId={conversaSelecionada?.id}
          onSelect={handleSelecionarConversa}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        {conversaSelecionada ? (
          <>
            <ChatHeader
              conversa={conversaSelecionada}
              onBack={() => setConversaSelecionada(null)}
            />
            
            <div className="flex-1 overflow-y-auto p-4">
              <ChatWindow conversaId={conversaSelecionada.id} />
              
              {usuarioDigitando && (
                <div className="mt-2">
                  <TypingIndicator usuarioNome={usuarioDigitando} />
                </div>
              )}
              
              {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {error.message}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem('mensagem') as HTMLInputElement;
                  if (input.value.trim()) {
                    enviarMensagem(input.value, TIPO_MENSAGEM.TEXTO);
                    input.value = '';
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  name="mensagem"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite sua mensagem..."
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      indicarDigitando(true);
                    }
                  }}
                  onBlur={() => indicarDigitando(false)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Enviar
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione uma conversa para começar
          </div>
        )}
      </div>
    </div>
  );
} 