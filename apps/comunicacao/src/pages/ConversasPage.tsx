import { useState } from 'react';
import { useConversas } from '../hooks/useConversas';
import { useChat } from '../hooks/useChat';
import { ChatWindow } from '../components/ChatWindow';
import { ConversationList } from '../components/ConversationList';
import { SearchInput } from '../components/SearchInput';
import { Pagination } from '../components/Pagination';
import { ComunicacaoStatus } from '../types/comunicacao';

export function ConversasPage() {
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState<ComunicacaoStatus | undefined>();
  const [pagina, setPagina] = useState(1);

  const {
    conversas,
    conversaSelecionada,
    loading,
    error,
    totalPaginas,
    total,
    buscarConversas,
    selecionarConversa,
    mudarPagina
  } = useConversas({
    busca,
    status,
    porPagina: 10,
    ordenarPor: 'ultima_mensagem_at',
    ordem: 'desc'
  });

  const {
    mensagens,
    enviarMensagem,
    marcarComoLida,
    indicarDigitando
  } = useChat({ conversaId: conversaSelecionada?.id });

  // Buscar conversas
  const handleBusca = async (termo: string) => {
    setBusca(termo);
    setPagina(1);
    await buscarConversas({ busca: termo });
  };

  // Filtrar por status
  const handleStatusChange = async (novoStatus: ComunicacaoStatus | undefined) => {
    setStatus(novoStatus);
    setPagina(1);
    await buscarConversas({ status: novoStatus });
  };

  // Selecionar conversa
  const handleConversaSelect = async (id: string) => {
    await selecionarConversa(id);
  };

  // Mudar página
  const handlePageChange = async (novaPagina: number) => {
    setPagina(novaPagina);
    await mudarPagina(novaPagina);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Erro ao carregar conversas: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Lista de Conversas */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <SearchInput
            value={busca}
            onChange={handleBusca}
            placeholder="Buscar conversas..."
          />
        </div>
        <div className="p-4 border-b">
          <select
            value={status || ''}
            onChange={(e) => handleStatusChange(e.target.value as ComunicacaoStatus || undefined)}
            className="w-full p-2 border rounded"
          >
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="ARQUIVADO">Arquivado</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
        <ConversationList
          conversas={conversas}
          conversaSelecionada={conversaSelecionada}
          onSelect={handleConversaSelect}
          loading={loading}
        />
        <div className="p-4 border-t">
          <Pagination
            pagina={pagina}
            totalPaginas={totalPaginas}
            total={total}
            onChange={handlePageChange}
          />
        </div>
      </div>

      {/* Área do Chat */}
      <div className="flex-1 flex flex-col">
        {conversaSelecionada ? (
          <ChatWindow
            conversa={conversaSelecionada}
            mensagens={mensagens}
            onEnviarMensagem={enviarMensagem}
            onMarcarComoLida={marcarComoLida}
            onIndicarDigitando={indicarDigitando}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecione uma conversa para começar
          </div>
        )}
      </div>
    </div>
  );
} 