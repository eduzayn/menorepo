import React, { useState, useEffect } from 'react';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { RespostasRapidas } from '../components/RespostasRapidas';
import type { Conversa, Mensagem } from '../types/comunicacao';

// Exemplo de conversa para desenvolvimento
const exemploConversa: Conversa = {
  id: '1',
  titulo: 'Maria Silva',
  status: 'ATIVO',
  canal: 'CHAT',
  participante_id: '123',
  participante_tipo: 'LEAD',
  participantes: [
    {
      id: '123',
      nome: 'Maria Silva',
      email: 'maria@example.com',
      tipo: 'LEAD',
      online: true,
    }
  ],
  nao_lidas: 0,
  criado_at: new Date().toISOString(),
  atualizado_at: new Date().toISOString(),
  usuario_id: 'user-123'
};

// Exemplo de mensagens para desenvolvimento
const exemploMensagens: Mensagem[] = [
  {
    id: 'm1',
    conversa_id: '1',
    remetente_id: '123',
    conteudo: 'Olá, gostaria de informações sobre o curso de inglês',
    tipo: 'TEXTO',
    lida: true,
    criado_at: new Date().toISOString(),
    atualizado_at: new Date().toISOString()
  },
  {
    id: 'm2',
    conversa_id: '1',
    remetente_id: 'user-123',
    conteudo: 'Olá Maria! Claro, posso te ajudar com informações sobre o curso de inglês.',
    tipo: 'TEXTO',
    lida: true,
    criado_at: new Date().toISOString(),
    atualizado_at: new Date().toISOString()
  }
];

export default function ConversasPage() {
  const [conversas, setConversas] = useState<Conversa[]>([exemploConversa]);
  const [selectedConversa, setSelectedConversa] = useState<Conversa | null>(null);
  const [mensagens] = useState<Mensagem[]>(exemploMensagens);
  
  // Verifica o localStorage ao carregar a página para ver se veio de um redirecionamento do LeadsPage
  useEffect(() => {
    const leadId = localStorage.getItem('selected_lead_id');
    const leadName = localStorage.getItem('selected_lead_name');
    
    if (leadId && leadName) {
      // Cria ou recupera uma conversa com o lead selecionado
      const leadConversa = conversas.find(c => 
        c.participantes.some(p => p.id === leadId)
      );
      
      if (leadConversa) {
        // Se já existir uma conversa com este lead, seleciona-a
        setSelectedConversa(leadConversa);
      } else {
        // Caso contrário, cria uma nova conversa
        const novaConversa: Conversa = {
          id: `new-${Date.now()}`,
          titulo: leadName,
          status: 'ATIVO',
          canal: 'CHAT',
          participante_id: leadId,
          participante_tipo: 'LEAD',
          participantes: [
            {
              id: leadId,
              nome: leadName,
              email: '', // Na implementação real, viria do banco
              tipo: 'LEAD',
              online: false
            }
          ],
          nao_lidas: 0,
          criado_at: new Date().toISOString(),
          atualizado_at: new Date().toISOString(),
          usuario_id: 'user-123' // Na implementação real, viria da sessão
        };
        
        // Adiciona a nova conversa à lista e seleciona-a
        setConversas(prevConversas => [...prevConversas, novaConversa]);
        setSelectedConversa(novaConversa);
        
        // Limpa os dados para não recriar a conversa em futuros carregamentos da página
        localStorage.removeItem('selected_lead_id');
        localStorage.removeItem('selected_lead_name');
      }
    }
  }, [conversas]);
  
  const handleSelectConversa = (id: string) => {
    const conversa = conversas.find(c => c.id === id);
    setSelectedConversa(conversa || null);
  };

  const handleEnviarMensagem = async (texto: string, metadados?: any) => {
    console.log('Enviando mensagem:', texto, metadados);
    // Implementação real chamaria um serviço para enviar mensagem
  };

  const handleMarcarComoLida = async () => {
    console.log('Marcando como lida');
    // Implementação real chamaria um serviço para marcar mensagens como lidas
  };

  const handleIndicarDigitando = async (digitando: boolean) => {
    console.log('Indicando digitando:', digitando);
    // Implementação real enviaria evento de digitação
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/3 border-r">
        <ConversationList 
          conversas={conversas} 
          selectedId={selectedConversa?.id} 
          onSelect={handleSelectConversa}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        {selectedConversa ? (
          <ChatWindow 
            conversa={selectedConversa}
            mensagens={mensagens}
            onEnviarMensagem={handleEnviarMensagem}
            onMarcarComoLida={handleMarcarComoLida}
            onIndicarDigitando={handleIndicarDigitando}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
} 