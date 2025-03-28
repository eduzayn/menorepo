import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, Send, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAtribuicaoAutomatica } from '../../hooks/useAtribuicaoAutomatica';

interface ChatWidgetProps {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  logoUrl?: string;
  position?: 'bottom-right' | 'bottom-left';
  greeting?: string;
  departamentoId?: string;
  autoFocus?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: Date;
}

const defaultGreeting = 'Olá! Como posso ajudar você hoje?';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  title = 'Atendimento Edunéxia',
  subtitle = 'Estamos online e prontos para ajudar',
  primaryColor = '#2563EB',
  logoUrl = '/logo.svg',
  position = 'bottom-right',
  greeting = defaultGreeting,
  departamentoId,
  autoFocus = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversaId, setConversaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState<{ id: string; name?: string; email?: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [hasAgent, setHasAgent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { processarMensagem, identificarDepartamento } = useAtribuicaoAutomatica();

  // Inicializa o widget
  useEffect(() => {
    // Gerar um ID único para o visitante se não existir
    const getOrCreateVisitorId = () => {
      let visitorId = localStorage.getItem('edunexia_visitor_id');
      if (!visitorId) {
        visitorId = `visitor_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('edunexia_visitor_id', visitorId);
      }
      return visitorId;
    };

    const visitorId = getOrCreateVisitorId();
    setVisitorInfo({ id: visitorId });

    // Carrega mensagens anteriores se houver um ID de conversa armazenado
    const savedConversaId = localStorage.getItem('edunexia_conversa_id');
    if (savedConversaId) {
      setConversaId(savedConversaId);
      carregarMensagensAnteriores(savedConversaId);
    } else {
      // Adiciona mensagem de boas-vindas
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [greeting]);

  // Scroll para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto focus no input quando abrir o chat
  useEffect(() => {
    if (isOpen && !isMinimized && autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, autoFocus]);

  // Escutar mensagens em tempo real quando houver um ID de conversa
  useEffect(() => {
    if (!conversaId) return;

    const subscription = supabase
      .channel(`conversa:${conversaId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `conversa_id=eq.${conversaId}`
        },
        (payload) => {
          const novaMensagem = payload.new as any;
          // Ignore mensagens enviadas pelo próprio usuário
          if (novaMensagem.remetente_id === visitorInfo?.id) return;
          
          // Verifique se a mensagem é de um agente humano
          if (novaMensagem.remetente_id !== 'system' && novaMensagem.remetente_id !== 'bot') {
            setHasAgent(true);
          }
          
          setMessages(prev => [
            ...prev,
            {
              id: novaMensagem.id,
              sender: novaMensagem.remetente_id === 'bot' ? 'bot' : 'agent',
              text: novaMensagem.conteudo,
              timestamp: new Date(novaMensagem.data_envio || novaMensagem.criado_at),
            }
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversaId, visitorInfo?.id]);

  // Carregar mensagens anteriores de uma conversa
  const carregarMensagensAnteriores = async (conversaId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversaId)
        .order('criado_at', { ascending: true });

      if (error) throw error;

      // Verificar se há mensagens de um agente
      const hasAgentMessage = data.some(msg => 
        msg.remetente_id !== 'system' && 
        msg.remetente_id !== 'bot' && 
        msg.remetente_id !== visitorInfo?.id
      );
      
      setHasAgent(hasAgentMessage);
      
      setMessages(
        data.map(msg => ({
          id: msg.id,
          sender: msg.remetente_id === visitorInfo?.id 
            ? 'user' 
            : msg.remetente_id === 'bot' 
              ? 'bot' 
              : 'agent',
          text: msg.conteudo,
          timestamp: new Date(msg.data_envio || msg.criado_at),
        }))
      );
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova conversa
  const criarNovaConversa = async () => {
    try {
      const { data, error } = await supabase
        .from('conversas')
        .insert([
          {
            origem: 'WIDGET',
            participante_id: visitorInfo?.id,
            participante_tipo: 'VISITANTE',
            participante_dados: {
              name: visitorInfo?.name || 'Visitante',
              email: visitorInfo?.email,
              url: window.location.href,
              userAgent: navigator.userAgent,
            },
            status: 'ATIVA',
            iniciado_em: new Date().toISOString(),
            departamento_id: departamentoId || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const novaConversaId = data.id;
      setConversaId(novaConversaId);
      localStorage.setItem('edunexia_conversa_id', novaConversaId);

      return novaConversaId;
    } catch (err) {
      console.error('Erro ao criar conversa:', err);
      return null;
    }
  };

  // Enviar mensagem para o bot/atendente
  const enviarMensagem = async () => {
    if (!newMessage.trim()) return;

    const mensagemTexto = newMessage.trim();
    setNewMessage('');
    
    // Adicionar mensagem do usuário à lista
    const novaMensagem: Message = {
      id: `local_${Date.now()}`,
      sender: 'user',
      text: mensagemTexto,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, novaMensagem]);

    try {
      // Criar conversa se não existir
      const currentConversaId = conversaId || await criarNovaConversa();
      if (!currentConversaId) return;

      // Indicar que está digitando
      setIsTyping(true);

      // Salvar mensagem no Supabase
      const { data, error } = await supabase
        .from('mensagens')
        .insert([
          {
            conversa_id: currentConversaId,
            remetente_id: visitorInfo?.id,
            conteudo: mensagemTexto,
            tipo: 'TEXTO',
            data_envio: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Se ainda não tiver um atendente humano, tratar com resposta automática
      if (!hasAgent) {
        // Verificar se há um departamento específico
        const departamento = departamentoId || identificarDepartamento(mensagemTexto);
        
        // Processar a mensagem para atribuição automática
        await processarMensagem(currentConversaId, mensagemTexto);
        
        // Enviar uma resposta automática inicial
        setTimeout(async () => {
          if (departamento) {
            await supabase
              .from('mensagens')
              .insert([
                {
                  conversa_id: currentConversaId,
                  remetente_id: 'bot',
                  conteudo: 'Estamos encaminhando você para um atendente especializado...',
                  tipo: 'TEXTO',
                  data_envio: new Date().toISOString(),
                },
              ]);
          } else {
            await supabase
              .from('mensagens')
              .insert([
                {
                  conversa_id: currentConversaId,
                  remetente_id: 'bot',
                  conteudo: 'Obrigado pelo contato! Um atendente irá responder em breve.',
                  tipo: 'TEXTO',
                  data_envio: new Date().toISOString(),
                },
              ]);
          }
          setIsTyping(false);
        }, 1000);
      } else {
        setIsTyping(false);
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setIsTyping(false);
    }
  };

  // Lidar com o enter no campo de mensagem
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  // Definir informações do visitante
  const setVisitorData = (name?: string, email?: string) => {
    if (name || email) {
      const updatedInfo = { 
        id: visitorInfo?.id || '', 
        name, 
        email 
      };
      setVisitorInfo(updatedInfo);
      
      // Atualizar dados do participante na conversa se houver
      if (conversaId) {
        supabase
          .from('conversas')
          .update({
            participante_dados: {
              ...updatedInfo,
              url: window.location.href,
              userAgent: navigator.userAgent,
            },
          })
          .eq('id', conversaId)
          .then(({ error }) => {
            if (error) console.error('Erro ao atualizar dados do visitante:', error);
          });
      }
    }
  };

  // Toggle abrir/fechar o widget
  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Toggle minimizar/maximizar
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div 
      className={`fixed ${position === 'bottom-right' ? 'right-5' : 'left-5'} bottom-5 z-50 flex flex-col items-end`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Botão do chat */}
      <button
        onClick={toggleWidget}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg focus:outline-none transition-transform hover:scale-105"
        style={{ backgroundColor: primaryColor }}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Janela do chat */}
      {isOpen && (
        <div 
          className="bg-white rounded-lg shadow-xl mb-2 overflow-hidden flex flex-col transition-all"
          style={{ 
            width: '350px',
            height: isMinimized ? '72px' : '500px',
            maxHeight: '80vh',
            border: '1px solid #e5e7eb'
          }}
        >
          {/* Cabeçalho */}
          <div 
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 mr-3 rounded" />
              )}
              <div>
                <h3 className="font-medium text-white">{title}</h3>
                <p className="text-xs text-white opacity-80">{subtitle}</p>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/10 rounded focus:outline-none"
                aria-label={isMinimized ? 'Expandir chat' : 'Minimizar chat'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={toggleWidget}
                className="p-1 hover:bg-white/10 rounded ml-1 focus:outline-none"
                aria-label="Fechar chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Lista de mensagens */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={message.id || index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : message.sender === 'bot'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <span className="text-xs opacity-70 block mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Formulário de envio */}
              <div className="p-3 border-t">
                <div className="flex">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={enviarMensagem}
                    disabled={!newMessage.trim() || isLoading}
                    className="px-3 py-2 rounded-r-md focus:outline-none transition-colors disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
                {!visitorInfo?.name && !messages.some(m => m.sender === 'user') && (
                  <div className="text-xs text-gray-500 mt-2">
                    Para um atendimento personalizado, informe seu nome e email.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 