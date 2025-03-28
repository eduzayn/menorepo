import React, { useState, useEffect } from 'react';
import { gerarRespostaAutomatica, sugerirRespostas, RecomendacaoResposta } from '../../services/ia';
import { Mensagem } from '../../types/comunicacao';
import { User } from '../../types/user';
import { Icons } from '../ui/icons';

interface IAAssistenteProps {
  conversaId: string;
  mensagens: Mensagem[];
  onSendMessage: (texto: string) => void;
  onSelectSuggestion: (texto: string) => void;
  usuario: User;
}

export function IAAssistente({
  conversaId,
  mensagens,
  onSendMessage,
  onSelectSuggestion,
  usuario
}: IAAssistenteProps) {
  const [iaAtiva, setIaAtiva] = useState(false);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ultimaRecomendacao, setUltimaRecomendacao] = useState<RecomendacaoResposta | null>(null);
  const [modoAutomatico, setModoAutomatico] = useState(false);

  // Processar novas mensagens para gerar sugestões
  useEffect(() => {
    if (!iaAtiva || mensagens.length === 0) return;
    
    const ultimaMensagem = mensagens[mensagens.length - 1];
    
    // Apenas processar mensagens que não são do usuário atual
    if (ultimaMensagem.remetente_id === usuario.id) return;
    
    // Gerar sugestões baseadas na última mensagem
    const gerarSugestoes = async () => {
      setLoading(true);
      try {
        const sugestoesIA = await sugerirRespostas(ultimaMensagem.conteudo);
        setSugestoes(sugestoesIA);
        
        // Se modo automático estiver ativado, gerar resposta automática
        if (modoAutomatico) {
          const recomendacao = await gerarRespostaAutomatica(
            conversaId,
            ultimaMensagem.conteudo
          );
          setUltimaRecomendacao(recomendacao);
          
          // Se confiança for alta e não requer humano, enviar automaticamente
          if (recomendacao.confianca > 80 && !recomendacao.requer_humano) {
            // Pequeno delay para simular processamento
            setTimeout(() => {
              onSendMessage(recomendacao.mensagem);
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Erro ao gerar sugestões:', error);
      } finally {
        setLoading(false);
      }
    };
    
    gerarSugestoes();
  }, [iaAtiva, mensagens, conversaId, usuario.id, modoAutomatico, onSendMessage]);

  const handleSelecionarSugestao = (sugestao: string) => {
    onSelectSuggestion(sugestao);
    // Limpar sugestões após selecionar
    setSugestoes([]);
  };

  const toggleIA = () => {
    setIaAtiva(!iaAtiva);
    if (!iaAtiva && mensagens.length > 0) {
      // Ao ativar, gerar sugestões baseadas na última mensagem
      const ultimaMensagem = mensagens[mensagens.length - 1];
      if (ultimaMensagem.remetente_id !== usuario.id) {
        sugerirRespostas(ultimaMensagem.conteudo).then(setSugestoes);
      }
    } else {
      // Limpar sugestões ao desativar
      setSugestoes([]);
    }
  };

  const toggleModoAutomatico = () => {
    setModoAutomatico(!modoAutomatico);
  };

  if (!iaAtiva) {
    return (
      <div className="mt-4 flex justify-end">
        <button
          onClick={toggleIA}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Icons.bell className="h-4 w-4 mr-2" />
          Ativar Assistente IA
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Icons.smile className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Assistente IA</h3>
          {loading && (
            <span className="ml-2 inline-block h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleModoAutomatico}
            className={`px-2 py-1 text-xs rounded-md ${
              modoAutomatico
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
            title={modoAutomatico ? "Modo automático ativado" : "Modo automático desativado"}
          >
            {modoAutomatico ? "Auto: ON" : "Auto: OFF"}
          </button>
          <button
            onClick={toggleIA}
            className="text-gray-500 hover:text-gray-700"
            title="Desativar assistente"
          >
            <Icons.x className="h-4 w-4" />
          </button>
        </div>
      </div>

      {ultimaRecomendacao && ultimaRecomendacao.requer_humano && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icons.bell className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-yellow-700">
                Esta mensagem provavelmente requer atenção humana. 
                Confiança: {ultimaRecomendacao.confianca}%
              </p>
            </div>
          </div>
        </div>
      )}

      {sugestoes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Sugestões de resposta:</p>
          {sugestoes.map((sugestao, index) => (
            <button
              key={index}
              onClick={() => handleSelecionarSugestao(sugestao)}
              className="block w-full text-left p-2 text-sm border border-gray-200 rounded-md hover:bg-white hover:border-indigo-300 transition-colors"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}

      {!sugestoes.length && !loading && (
        <p className="text-xs text-gray-500">
          Nenhuma sugestão disponível no momento. O assistente irá analisar a próxima mensagem recebida.
        </p>
      )}
    </div>
  );
} 