import { useState, useEffect } from 'react';
import { Conversa } from '../types/comunicacao';
import { getConversas, getConversa } from '../services/comunicacao';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Card, Button, Spinner } from '@edunexia/ui-components';

export function ConversasPage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversas();
  }, []);

  const loadConversas = async () => {
    try {
      setLoading(true);
      const data = await getConversas();
      setConversas(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarConversa = async (conversa: Conversa) => {
    try {
      const conversaCompleta = await getConversa(conversa.id);
      if (conversaCompleta) {
        setConversaSelecionada(conversaCompleta);
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Card className="w-64 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Conversas</h2>
        <div className="space-y-2">
          {conversas.map((conversa) => (
            <Button
              key={conversa.id}
              variant={conversaSelecionada?.id === conversa.id ? 'primary' : 'secondary'}
              className="w-full text-left"
              onClick={() => handleSelecionarConversa(conversa)}
            >
              {conversa.titulo}
            </Button>
          ))}
        </div>
      </Card>
      <div className="flex-1">
        {conversaSelecionada ? (
          <ChatWindow conversaId={conversaSelecionada.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione uma conversa para começar
          </div>
        )}
      </div>
    </div>
  );
} 