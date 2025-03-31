import React, { useEffect } from 'react';
import { 
  ArtigoConhecimento, 
  useBaseConhecimento 
} from '../../hooks/useBaseConhecimento';
import { Button } from '../ui/button';
import { 
  ChevronLeftIcon, 
  PrinterIcon, 
  HeartIcon, 
  ShareIcon,
  TagIcon, 
  ClockIcon, 
  UserIcon, 
  BookOpenIcon 
} from '@heroicons/react/24/outline';

interface ArtigoDetailProps {
  artigoId: string;
  onVoltar: () => void;
}

export function ArtigoDetail({ artigoId, onVoltar }: ArtigoDetailProps) {
  const { 
    artigo, 
    buscarArtigo, 
    isLoading,
    error,
    registrarVisualizacao 
  } = useBaseConhecimento();

  // Carregar o artigo quando o ID mudar
  useEffect(() => {
    if (artigoId) {
      buscarArtigo(artigoId);
      // Registrar visualização
      registrarVisualizacao(artigoId);
    }
  }, [artigoId, buscarArtigo, registrarVisualizacao]);

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Se ocorreu um erro
  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <h3 className="text-lg font-medium text-red-600">Erro ao carregar artigo</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <Button onClick={onVoltar} className="mt-4">Voltar</Button>
      </div>
    );
  }

  // Se não encontrou o artigo
  if (!artigo) {
    return (
      <div className="text-center py-8 px-4">
        <h3 className="text-lg font-medium">Artigo não encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">O artigo solicitado não existe ou foi removido</p>
        <Button onClick={onVoltar} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="artigo-detail">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onVoltar} 
          className="flex items-center space-x-1 text-gray-600"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <PrinterIcon className="h-4 w-4" />
            <span>Imprimir</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <HeartIcon className="h-4 w-4" />
            <span>Favoritar</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <ShareIcon className="h-4 w-4" />
            <span>Compartilhar</span>
          </Button>
        </div>
      </div>
      
      {/* Título e metadados */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{artigo.titulo}</h1>
        
        <div className="flex items-center mt-3 text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{artigo.data_atualizacao || artigo.data_criacao}</span>
          </div>
          
          {artigo.autor && (
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{artigo.autor}</span>
            </div>
          )}
          
          {artigo.visualizacoes !== undefined && (
            <div className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              <span>{artigo.visualizacoes} {artigo.visualizacoes === 1 ? 'visualização' : 'visualizações'}</span>
            </div>
          )}
        </div>
        
        {artigo.tags && artigo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {artigo.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Conteúdo do artigo */}
      <div className="prose max-w-none">
        {artigo.resumo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 italic">{artigo.resumo}</p>
          </div>
        )}
        
        <div 
          className="artigo-content" 
          dangerouslySetInnerHTML={{ __html: artigo.conteudo }} 
        />
      </div>

      {/* Artigos relacionados */}
      {artigo.artigos_relacionados && artigo.artigos_relacionados.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Artigos relacionados</h3>
          <ul className="space-y-2">
            {artigo.artigos_relacionados.map(relacionado => (
              <li key={relacionado.id}>
                <a 
                  href="#" 
                  className="text-blue-600 hover:underline flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    buscarArtigo(relacionado.id);
                  }}
                >
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  {relacionado.titulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Avaliação do artigo */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium mb-2">Este artigo foi útil?</h3>
        <div className="flex space-x-2">
          <Button variant="outline">👍 Sim</Button>
          <Button variant="outline">👎 Não</Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Ajude-nos a melhorar nossa base de conhecimento com seu feedback
        </p>
      </div>
    </div>
  );
} 