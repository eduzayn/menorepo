import { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { DetailsPanel } from '../components/chat/DetailsPanel';
import { useConversas } from '../hooks/useConversas';
import { useChat } from '../hooks/useChat';
import { Conversa, Mensagem, Lead, Aluno, Interacao } from '../types/comunicacao';

interface ConversationListProps {
  conversas: Conversa[];
  conversaSelecionada: Conversa | null;
  onSelecionarConversa: (conversa: Conversa) => void;
  loading: boolean;
}

interface ChatWindowProps {
  conversa: Conversa;
  mensagens: Mensagem[];
  onEnviarMensagem: (texto: string) => Promise<void>;
  onMarcarComoLida: () => Promise<void>;
  onIndicarDigitando: (digitando: boolean) => Promise<void>;
  loading: boolean;
}

export function ConversasPage() {
  const { conversas, loading: loadingConversas } = useConversas();
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loadingMensagens, setLoadingMensagens] = useState(false);
  const [participante, setParticipante] = useState<Lead | Aluno | null>(null);
  const [historicoInteracoes, setHistoricoInteracoes] = useState<Interacao[]>([]);

  const {
    enviarMensagem,
    marcarComoLida,
    indicarDigitando,
    carregarMensagens,
    carregarParticipante,
    carregarHistoricoInteracoes,
  } = useChat();

  const handleSelecionarConversa = async (conversa: Conversa) => {
    setConversaSelecionada(conversa);
    setLoadingMensagens(true);
    setMensagens([]);

    try {
      const [mensagensData, participanteData, historicoData] = await Promise.all([
        carregarMensagens(conversa.id),
        carregarParticipante(conversa.participante_id, conversa.participante_tipo),
        carregarHistoricoInteracoes(conversa.participante_id, conversa.participante_tipo),
      ]);

      setMensagens(mensagensData);
      setParticipante(participanteData);
      setHistoricoInteracoes(historicoData);
    } catch (error) {
      console.error('Erro ao carregar dados da conversa:', error);
    } finally {
      setLoadingMensagens(false);
    }
  };

  const handleEnviarMensagem = async (texto: string) => {
    if (!conversaSelecionada) return;

    try {
      const novaMensagem = await enviarMensagem(conversaSelecionada.id, texto);
      setMensagens((prev: Mensagem[]) => [...prev, novaMensagem]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleAcaoRapida = async (acao: string) => {
    if (!participante || !conversaSelecionada) return;

    switch (acao) {
      case 'matricular':
        // Implementar lógica de matrícula
        break;
      case 'enviar_mensagem':
        // Implementar lógica de envio de mensagem
        break;
      case 'agendar_contato':
        // Implementar lógica de agendamento
        break;
      default:
        break;
    }
  };

  return (
    <MainLayout
      showDetails={!!participante}
      detailsProps={
        participante
          ? {
              lead: participante.tipo === 'LEAD' ? participante : undefined,
              aluno: participante.tipo === 'ALUNO' ? participante : undefined,
              historicoInteracoes,
              onAcaoRapida: handleAcaoRapida,
            }
          : undefined
      }
    >
      <div className="flex h-full">
        {/* Lista de Conversas */}
        <div className="w-80 border-r border-gray-200">
          <ConversationList
            conversas={conversas}
            conversaSelecionada={conversaSelecionada}
            onSelecionarConversa={handleSelecionarConversa}
            loading={loadingConversas}
          />
        </div>

        {/* Área de Chat */}
        <div className="flex-1">
          {conversaSelecionada ? (
            <ChatWindow
              conversa={conversaSelecionada}
              mensagens={mensagens}
              onEnviarMensagem={handleEnviarMensagem}
              onMarcarComoLida={() => marcarComoLida(conversaSelecionada.id)}
              onIndicarDigitando={(digitando) =>
                indicarDigitando(conversaSelecionada.id, digitando)
              }
              loading={loadingMensagens}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Selecione uma conversa para começar
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 