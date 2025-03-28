import React, { useEffect, useState } from 'react';
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  PrinterIcon,
  ShareIcon,
  PencilIcon,
  ClockIcon,
  EyeIcon,
  TagIcon
} from 'lucide-react';
import { HeartIcon as HeartSolidIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { ArtigoConhecimento, useBaseConhecimento } from '../../hooks/useBaseConhecimento';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface ArtigoDetailProps {
  artigoId: string;
  onVoltar: () => void;
}

export function ArtigoDetail({ artigoId, onVoltar }: ArtigoDetailProps) {
  const { 
    buscarArtigoPorId, 
    marcarFavorito, 
    registrarVisualizacao,
    isLoading 
  } = useBaseConhecimento();
  
  const [artigo, setArtigo] = useState<ArtigoConhecimento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar artigo
  useEffect(() => {
    const carregarArtigo = async () => {
      setCarregando(true);
      try {
        const artigoData = await buscarArtigoPorId(artigoId);
        setArtigo(artigoData);
        
        // Registrar visualização (com pequeno delay para garantir que a interface carregue primeiro)
        setTimeout(() => {
          registrarVisualizacao(artigoId);
        }, 2000);
      } catch (erro) {
        console.error('Erro ao carregar artigo:', erro);
        setError(erro as Error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarArtigo();
  }, [artigoId, buscarArtigoPorId, registrarVisualizacao]);

  // Manipular favorito
  const handleFavorito = async () => {
    if (!artigo) return;
    
    try {
      await marcarFavorito(artigo.id);
      // Atualizar artigo local com o novo estado de favorito
      setArtigo(prev => prev ? { ...prev, favorito: !prev.favorito } : null);
    } catch (erro) {
      console.error('Erro ao marcar favorito:', erro);
    }
  };

  // Imprimir artigo
  const handleImprimir = () => {
    window.print();
  };

  // Compartilhar artigo
  const handleCompartilhar = async () => {
    if (!artigo) return;
    
    try {
      // Verificar se a API Web Share está disponível
      if (navigator.share) {
        await navigator.share({
          title: artigo.titulo,
          text: artigo.resumo || 'Confira este artigo da base de conhecimento',
          url: window.location.href,
        });
      } else {
        // Fallback: copiar URL para clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (erro) {
      console.error('Erro ao compartilhar:', erro);
    }
  };

  // Formatar data relativa
  const formatarDataRelativa = (data: string) => {
    return formatDistanceToNow(new Date(data), { 
      addSuffix: true,
      locale: ptBR
    });
  };

  // Renderizar estado de carregamento
  if (carregando) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onVoltar} className="flex items-center space-x-1">
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex flex-wrap gap-2 my-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="space-y-4 mt-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-20 w-3/4" />
        </div>
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onVoltar} className="flex items-center space-x-1">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div className="p-8 border rounded-lg bg-red-50 text-red-600">
          <p className="text-center font-medium">Não foi possível carregar o artigo</p>
          <p className="text-center mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // Renderizar artigo não encontrado
  if (!artigo) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onVoltar} className="flex items-center space-x-1">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        <div className="p-8 border rounded-lg bg-gray-50">
          <p className="text-center text-gray-500">Artigo não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onVoltar} className="flex items-center space-x-1">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={artigo.favorito ? 'text-red-500' : ''} 
            onClick={handleFavorito}
            title={artigo.favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {artigo.favorito ? <HeartSolidIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleImprimir}
            title="Imprimir artigo"
          >
            <PrinterIcon className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCompartilhar}
            title="Compartilhar artigo"
          >
            <ShareIcon className="h-5 w-5" />
          </Button>
          
          {/* Botão de editar (apenas para usuários com permissão) */}
          <Button 
            variant="ghost" 
            size="icon"
            title="Editar artigo"
          >
            <PencilIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Título e metadados */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{artigo.titulo}</h1>
        
        {artigo.resumo && (
          <p className="text-gray-600 text-lg mb-4">{artigo.resumo}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Atualizado {formatarDataRelativa(artigo.data_atualizacao)}</span>
          </div>
          
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            <span>{artigo.visualizacoes} visualizações</span>
          </div>
        </div>
        
        {/* Tags */}
        {artigo.tags && artigo.tags.length > 0 && (
          <div className="flex items-center mt-4">
            <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {artigo.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Conteúdo */}
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown>{artigo.conteudo}</ReactMarkdown>
      </div>
      
      {/* Rodapé - avaliação do artigo */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-600 mb-3">Este artigo foi útil?</p>
        <div className="flex justify-center space-x-2">
          <Button variant="outline">👍 Sim</Button>
          <Button variant="outline">👎 Não</Button>
        </div>
      </div>
    </div>
  );
} 