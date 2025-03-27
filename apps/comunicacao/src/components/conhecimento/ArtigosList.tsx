import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon, HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { ArtigoConhecimento, useBaseConhecimento } from '../../hooks/useBaseConhecimento';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ArtigosListProps {
  categoria?: string;
  subcategoria?: string | null;
  favoritos?: boolean;
  onArtigoSelected: (artigo: ArtigoConhecimento) => void;
}

export function ArtigosList({ 
  categoria, 
  subcategoria, 
  favoritos = false,
  onArtigoSelected 
}: ArtigosListProps) {
  const { 
    artigos, 
    buscarArtigos,
    buscarArtigosFavoritos,
    marcarFavorito,
    isLoading
  } = useBaseConhecimento();
  
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState<'recentes' | 'relevantes' | 'alfabetica'>('recentes');

  // Carregar artigos ao iniciar ou quando os filtros mudarem
  useEffect(() => {
    if (favoritos) {
      buscarArtigosFavoritos();
    } else if (categoria) {
      buscarArtigos(categoria, subcategoria || undefined, filtro);
    }
  }, [buscarArtigos, buscarArtigosFavoritos, categoria, subcategoria, favoritos, filtro]);

  // Manipular busca
  const handleBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  // Manipular favorito
  const handleFavorito = (e: React.MouseEvent, artigoId: string) => {
    e.stopPropagation();
    marcarFavorito(artigoId);
  };

  // Ordenar artigos
  const artigosOrdenados = [...artigos].sort((a, b) => {
    if (ordenacao === 'recentes') {
      return new Date(b.data_atualizacao).getTime() - new Date(a.data_atualizacao).getTime();
    }
    
    if (ordenacao === 'alfabetica') {
      return a.titulo.localeCompare(b.titulo);
    }
    
    // Relevantes (por visualizações/relevância)
    return b.visualizacoes - a.visualizacoes;
  });

  // Formatação da data relativa
  const formatarDataRelativa = (data: string) => {
    return formatDistanceToNow(new Date(data), { 
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho com filtros */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar artigos..."
            className="pl-9"
            value={filtro}
            onChange={handleBusca}
          />
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <FilterIcon className="h-4 w-4 mr-1" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOrdenacao('recentes')}>
                Mais recentes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenacao('relevantes')}>
                Mais relevantes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenacao('alfabetica')}>
                Ordem alfabética
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Lista de artigos */}
      <div className="space-y-3">
        {isLoading && artigos.length === 0 ? (
          // Estado de carregamento
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : artigosOrdenados.length === 0 ? (
          // Estado vazio
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">
              {filtro ? 'Nenhum resultado encontrado' : 'Nenhum artigo disponível'}
            </p>
          </div>
        ) : (
          // Lista de artigos
          artigosOrdenados.map(artigo => (
            <div 
              key={artigo.id}
              onClick={() => onArtigoSelected(artigo)}
              className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{artigo.titulo}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{artigo.resumo}</p>
                  
                  {/* Metadados */}
                  <div className="flex items-center mt-3 text-xs text-gray-500 space-x-4">
                    <div>Atualizado {formatarDataRelativa(artigo.data_atualizacao)}</div>
                    <div>{artigo.visualizacoes} visualizações</div>
                  </div>
                  
                  {/* Tags */}
                  {artigo.tags && artigo.tags.length > 0 && (
                    <div className="flex flex-wrap mt-3 gap-2">
                      {artigo.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Ações rápidas */}
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={(e) => handleFavorito(e, artigo.id)}
                    className={`p-1.5 rounded-full hover:bg-gray-100 ${artigo.favorito ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    {artigo.favorito ? (
                      <HeartSolidIcon className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 