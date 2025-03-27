/**
 * Widget de Chat Edunéxia
 * Este script inicializa e renderiza o widget de chat em sites externos.
 * 
 * @version 1.0.0
 */

(function() {
  // Namespace global para o widget
  window.EdunexiaChatWidget = window.EdunexiaChatWidget || {};
  
  // Configurações padrão
  const defaultConfig = {
    title: 'Atendimento Edunéxia',
    subtitle: 'Estamos online e prontos para ajudar',
    primaryColor: '#2563EB',
    logoUrl: '/logo.svg',
    position: 'bottom-right',
    greeting: 'Olá! Como posso ajudar você hoje?',
    departamentoId: '',
    autoFocus: true
  };
  
  // Estado interno do widget
  let state = {
    isOpen: false,
    isMinimized: false,
    messages: [],
    newMessage: '',
    conversaId: null,
    visitorInfo: null,
    isLoading: false,
    hasAgent: false,
    isTyping: false
  };
  
  // Referência ao container do widget
  let widgetContainer = null;
  
  // Referência do script do Supabase
  let supabaseScript = null;
  let supabase = null;
  
  // Função para inicializar o widget
  const init = (config = {}) => {
    // Mesclar configurações padrão com as fornecidas
    const mergedConfig = { ...defaultConfig, ...config };
    
    // Criar identificador único para o visitante
    initVisitorId();
    
    // Carregar o script do Supabase
    loadSupabaseScript(() => {
      // Inicializar o Supabase
      initSupabase();
      
      // Criar container do widget
      createWidgetContainer(mergedConfig);
      
      // Renderizar o widget
      render(mergedConfig);
      
      // Carregar conversa anterior se houver
      const savedConversaId = localStorage.getItem('edunexia_conversa_id');
      if (savedConversaId) {
        state.conversaId = savedConversaId;
        loadPreviousMessages(savedConversaId);
      } else {
        // Adicionar mensagem de boas-vindas
        state.messages = [{
          id: 'welcome',
          sender: 'bot',
          text: mergedConfig.greeting,
          timestamp: new Date()
        }];
        render(mergedConfig);
      }
    });
  };
  
  // Inicializar ID do visitante
  const initVisitorId = () => {
    let visitorId = localStorage.getItem('edunexia_visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('edunexia_visitor_id', visitorId);
    }
    state.visitorInfo = { id: visitorId };
  };
  
  // Carregar script do Supabase
  const loadSupabaseScript = (callback) => {
    if (window.supabase) {
      callback();
      return;
    }
    
    supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    supabaseScript.async = true;
    supabaseScript.onload = callback;
    document.head.appendChild(supabaseScript);
  };
  
  // Inicializar Supabase
  const initSupabase = () => {
    // Credenciais públicas (anon key)
    const SUPABASE_URL = 'https://supabase.edunexia.com.br';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdW5leGlhIiwicm9sZSI6ImFub24ifQ.example';
    
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  };
  
  // Criar o container do widget
  const createWidgetContainer = (config) => {
    // Remover container anterior se existir
    if (widgetContainer) {
      document.body.removeChild(widgetContainer);
    }
    
    // Criar novo container
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'edunexia-chat-widget';
    document.body.appendChild(widgetContainer);
    
    // Adicionar estilos globais
    addStyles();
  };
  
  // Adicionar estilos globais
  const addStyles = () => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #edunexia-chat-widget {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        position: fixed;
        bottom: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        box-sizing: border-box;
      }
      
      #edunexia-chat-widget * {
        box-sizing: border-box;
      }
      
      #edunexia-chat-widget.right {
        right: 20px;
      }
      
      #edunexia-chat-widget.left {
        left: 20px;
      }
      
      .edunexia-chat-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: none;
        transition: transform 0.2s;
      }
      
      .edunexia-chat-button:hover {
        transform: scale(1.05);
      }
      
      .edunexia-chat-window {
        width: 350px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        max-height: 80vh;
        border: 1px solid #e5e7eb;
      }
      
      .edunexia-chat-header {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .edunexia-header-info {
        display: flex;
        align-items: center;
      }
      
      .edunexia-header-logo {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        border-radius: 4px;
      }
      
      .edunexia-header-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: white;
      }
      
      .edunexia-header-subtitle {
        margin: 0;
        font-size: 12px;
        opacity: 0.8;
        color: white;
      }
      
      .edunexia-header-actions {
        display: flex;
      }
      
      .edunexia-header-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        margin-left: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      
      .edunexia-header-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .edunexia-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: #f9fafb;
        max-height: 320px;
      }
      
      .edunexia-message-container {
        margin-bottom: 12px;
        display: flex;
      }
      
      .edunexia-message-container.user {
        justify-content: flex-end;
      }
      
      .edunexia-message-container.bot,
      .edunexia-message-container.agent {
        justify-content: flex-start;
      }
      
      .edunexia-message {
        padding: 8px 12px;
        border-radius: 8px;
        max-width: 80%;
        word-break: break-word;
      }
      
      .edunexia-message-container.user .edunexia-message {
        background-color: #2563EB;
        color: white;
      }
      
      .edunexia-message-container.bot .edunexia-message {
        background-color: #e5e7eb;
        color: #111827;
      }
      
      .edunexia-message-container.agent .edunexia-message {
        background-color: #10B981;
        color: white;
      }
      
      .edunexia-message-time {
        font-size: 10px;
        opacity: 0.7;
        margin-top: 4px;
        display: block;
      }
      
      .edunexia-chat-input {
        display: flex;
        padding: 12px;
        border-top: 1px solid #e5e7eb;
      }
      
      .edunexia-input-field {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-right: none;
        border-radius: 4px 0 0 4px;
        outline: none;
        font-size: 14px;
      }
      
      .edunexia-input-field:focus {
        border-color: #2563EB;
        box-shadow: 0 0 0 1px #2563EB;
      }
      
      .edunexia-send-button {
        padding: 8px 12px;
        background-color: #2563EB;
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .edunexia-send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .edunexia-typing-indicator {
        display: flex;
        padding: 8px 12px;
        background-color: #e5e7eb;
        border-radius: 8px;
        width: fit-content;
      }
      
      .edunexia-typing-dot {
        width: 8px;
        height: 8px;
        background-color: #6b7280;
        border-radius: 50%;
        margin: 0 2px;
        animation: edunexia-bounce 1.4s infinite ease-in-out both;
      }
      
      .edunexia-typing-dot:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      .edunexia-typing-dot:nth-child(2) {
        animation-delay: -0.16s;
      }
      
      @keyframes edunexia-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      .edunexia-loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-left-color: #2563EB;
        border-radius: 50%;
        animation: edunexia-spin 1s linear infinite;
      }
      
      @keyframes edunexia-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleEl);
  };
  
  // Renderizar o widget
  const render = (config) => {
    if (!widgetContainer) return;
    
    // Definir posição do container
    widgetContainer.className = config.position === 'bottom-left' ? 'left' : 'right';
    
    // Gerar HTML do widget
    widgetContainer.innerHTML = `
      <button class="edunexia-chat-button" style="background-color: ${config.primaryColor};">
        ${state.isOpen ? getIconSVG('x') : getIconSVG('message-square')}
      </button>
      
      ${state.isOpen ? `
        <div class="edunexia-chat-window" style="height: ${state.isMinimized ? '72px' : '500px'};">
          <div class="edunexia-chat-header" style="background-color: ${config.primaryColor};">
            <div class="edunexia-header-info">
              ${config.logoUrl ? `<img src="${config.logoUrl}" alt="Logo" class="edunexia-header-logo">` : ''}
              <div>
                <h3 class="edunexia-header-title">${config.title}</h3>
                <p class="edunexia-header-subtitle">${config.subtitle}</p>
              </div>
            </div>
            <div class="edunexia-header-actions">
              <button class="edunexia-header-button edunexia-minimize-button">
                ${state.isMinimized ? getIconSVG('maximize') : getIconSVG('minimize')}
              </button>
              <button class="edunexia-header-button edunexia-close-button">
                ${getIconSVG('x')}
              </button>
            </div>
          </div>
          
          ${!state.isMinimized ? `
            <div class="edunexia-chat-messages">
              ${state.isLoading ? `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                  <div class="edunexia-loading-spinner"></div>
                </div>
              ` : `
                ${state.messages.map((message, index) => `
                  <div class="edunexia-message-container ${message.sender}">
                    <div class="edunexia-message">
                      <span>${escapeHtml(message.text)}</span>
                      <span class="edunexia-message-time">
                        ${formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                `).join('')}
                
                ${state.isTyping ? `
                  <div class="edunexia-message-container bot">
                    <div class="edunexia-typing-indicator">
                      <div class="edunexia-typing-dot"></div>
                      <div class="edunexia-typing-dot"></div>
                      <div class="edunexia-typing-dot"></div>
                    </div>
                  </div>
                ` : ''}
              `}
            </div>
            
            <div class="edunexia-chat-input">
              <input 
                type="text" 
                class="edunexia-input-field" 
                placeholder="Digite sua mensagem..."
                value="${state.newMessage}"
              >
              <button 
                class="edunexia-send-button" 
                ${!state.newMessage.trim() || state.isLoading ? 'disabled' : ''}
                style="background-color: ${config.primaryColor};"
              >
                ${getIconSVG('send')}
              </button>
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
    
    // Adicionar event listeners
    addEventListeners(config);
    
    // Auto-scroll para a última mensagem
    scrollToBottom();
    
    // Auto-focus no campo de mensagem
    if (state.isOpen && !state.isMinimized && config.autoFocus) {
      setTimeout(() => {
        const inputField = widgetContainer.querySelector('.edunexia-input-field');
        if (inputField) inputField.focus();
      }, 100);
    }
  };
  
  // Adicionar event listeners
  const addEventListeners = (config) => {
    // Toggle do widget
    const chatButton = widgetContainer.querySelector('.edunexia-chat-button');
    if (chatButton) {
      chatButton.addEventListener('click', () => {
        state.isOpen = !state.isOpen;
        state.isMinimized = false;
        render(config);
      });
    }
    
    // Toggle minimizar/maximizar
    const minimizeButton = widgetContainer.querySelector('.edunexia-minimize-button');
    if (minimizeButton) {
      minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        state.isMinimized = !state.isMinimized;
        render(config);
      });
    }
    
    // Fechar chat
    const closeButton = widgetContainer.querySelector('.edunexia-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        state.isOpen = false;
        render(config);
      });
    }
    
    // Campo de mensagem
    const inputField = widgetContainer.querySelector('.edunexia-input-field');
    if (inputField) {
      inputField.addEventListener('input', (e) => {
        state.newMessage = e.target.value;
      });
      
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(config);
        }
      });
    }
    
    // Botão de enviar
    const sendButton = widgetContainer.querySelector('.edunexia-send-button');
    if (sendButton) {
      sendButton.addEventListener('click', () => {
        sendMessage(config);
      });
    }
  };
  
  // Enviar mensagem
  const sendMessage = async (config) => {
    if (!state.newMessage.trim() || state.isLoading) return;
    
    const messageText = state.newMessage.trim();
    state.newMessage = '';
    
    // Adicionar mensagem do usuário à lista
    const newMessage = {
      id: `local_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };
    
    state.messages.push(newMessage);
    render(config);
    
    try {
      state.isLoading = true;
      render(config);
      
      // Criar conversa se não existir
      const currentConversaId = state.conversaId || await createConversation(config);
      if (!currentConversaId) {
        state.isLoading = false;
        render(config);
        return;
      }
      
      // Indicar que está digitando
      state.isTyping = true;
      render(config);
      
      // Salvar mensagem no Supabase
      const { data, error } = await supabase
        .from('mensagens')
        .insert([
          {
            conversa_id: currentConversaId,
            remetente_id: state.visitorInfo.id,
            conteudo: messageText,
            tipo: 'TEXTO',
            data_envio: new Date().toISOString()
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      // Se ainda não tiver um atendente humano, tratar com resposta automática
      if (!state.hasAgent) {
        // Enviar uma resposta automática inicial após um pequeno delay
        setTimeout(async () => {
          // Adicionar resposta automática
          const botResponse = {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: 'Obrigado pelo contato! Um atendente irá responder em breve.',
            timestamp: new Date()
          };
          
          state.messages.push(botResponse);
          state.isTyping = false;
          state.isLoading = false;
          render(config);
          
          // Salvar resposta do bot no Supabase
          await supabase
            .from('mensagens')
            .insert([
              {
                conversa_id: currentConversaId,
                remetente_id: 'bot',
                conteudo: botResponse.text,
                tipo: 'TEXTO',
                data_envio: new Date().toISOString()
              }
            ]);
            
          // Inscrever-se para atualizações em tempo real
          subscribeToRealTimeUpdates(currentConversaId, config);
        }, 1000);
      } else {
        state.isTyping = false;
        state.isLoading = false;
        render(config);
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      state.isTyping = false;
      state.isLoading = false;
      render(config);
    }
  };
  
  // Criar nova conversa
  const createConversation = async (config) => {
    try {
      const { data, error } = await supabase
        .from('conversas')
        .insert([
          {
            origem: 'WIDGET',
            participante_id: state.visitorInfo.id,
            participante_tipo: 'VISITANTE',
            participante_dados: {
              name: state.visitorInfo.name || 'Visitante',
              email: state.visitorInfo.email,
              url: window.location.href,
              userAgent: navigator.userAgent
            },
            status: 'ATIVA',
            iniciado_em: new Date().toISOString(),
            departamento_id: config.departamentoId || null
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      const novaConversaId = data.id;
      state.conversaId = novaConversaId;
      localStorage.setItem('edunexia_conversa_id', novaConversaId);
      
      // Inscrever-se para atualizações em tempo real
      subscribeToRealTimeUpdates(novaConversaId, config);
      
      return novaConversaId;
    } catch (err) {
      console.error('Erro ao criar conversa:', err);
      return null;
    }
  };
  
  // Carregar mensagens anteriores
  const loadPreviousMessages = async (conversaId) => {
    state.isLoading = true;
    render(config);
    
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
        msg.remetente_id !== state.visitorInfo.id
      );
      
      state.hasAgent = hasAgentMessage;
      
      state.messages = data.map(msg => ({
        id: msg.id,
        sender: msg.remetente_id === state.visitorInfo.id 
          ? 'user' 
          : msg.remetente_id === 'bot' 
            ? 'bot' 
            : 'agent',
        text: msg.conteudo,
        timestamp: new Date(msg.data_envio || msg.criado_at)
      }));
      
      // Inscrever-se para atualizações em tempo real
      subscribeToRealTimeUpdates(conversaId, config);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      state.isLoading = false;
      render(config);
    }
  };
  
  // Inscrever-se para atualizações em tempo real
  const subscribeToRealTimeUpdates = (conversaId, config) => {
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
          const novaMensagem = payload.new;
          
          // Ignorar mensagens enviadas pelo próprio usuário
          if (novaMensagem.remetente_id === state.visitorInfo.id) return;
          
          // Verificar se a mensagem é de um agente humano
          if (novaMensagem.remetente_id !== 'system' && novaMensagem.remetente_id !== 'bot') {
            state.hasAgent = true;
          }
          
          // Adicionar mensagem à lista
          state.messages.push({
            id: novaMensagem.id,
            sender: novaMensagem.remetente_id === 'bot' ? 'bot' : 'agent',
            text: novaMensagem.conteudo,
            timestamp: new Date(novaMensagem.data_envio || novaMensagem.criado_at)
          });
          
          // Re-renderizar
          render(config);
        }
      )
      .subscribe();
  };
  
  // Utilidades
  
  // Formatar hora
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Escapar HTML
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    const messagesContainer = widgetContainer.querySelector('.edunexia-chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  
  // Obter SVG para ícones
  const getIconSVG = (iconName) => {
    const icons = {
      'message-square': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
      'x': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      'minimize': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="18" x2="21" y2="18"></line></svg>',
      'maximize': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
      'send': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>'
    };
    
    return icons[iconName] || '';
  };
  
  // Exportar funções públicas
  window.EdunexiaChatWidget = {
    init
  };
})(); 