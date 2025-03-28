import React, { useState } from 'react';
import { X, Search, Book } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BaseConhecimento } from '../conhecimento/BaseConhecimento';
import { ArtigoConhecimento } from '../../hooks/useBaseConhecimento';
import { useChat } from '../../hooks/useChat';

interface ChatKnowledgeBaseProps {
  conversaId: string;
  onClose: () => void;
}

export function ChatKnowledgeBase({ conversaId, onClose }: ChatKnowledgeBaseProps) {
  const { enviarMensagem } = useChat(conversaId);
  const [buscando, setBuscando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');

  // Função para inserir artigo na conversa
  const handleInserirArtigo = (artigo: ArtigoConhecimento) => {
    // Formatar o conteúdo do artigo para compartilhar
    const conteudoFormatado = `
📚 **${artigo.titulo}**

${artigo.resumo}

*Confira o artigo completo em nossa base de conhecimento.*
`;

    // Enviar o conteúdo como mensagem
    enviarMensagem(conteudoFormatado, { 
      tipo: 'ARTIGO_CONHECIMENTO',
      artigo_id: artigo.id
    });
    
    // Fechar o painel
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* Cabeçalho */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium">Base de Conhecimento</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Barra de pesquisa */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 pr-4"
            placeholder="Buscar na base de conhecimento..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-2">
        <BaseConhecimento 
          integradoChat={true} 
          onSelecionar={handleInserirArtigo} 
        />
      </div>
    </div>
  );
} 