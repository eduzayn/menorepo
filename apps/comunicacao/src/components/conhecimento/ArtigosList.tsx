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
import { Card, CardContent } from '../ui/card';
import { BookOpenIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

interface ArtigosListProps {
  categoriaId: string | null;
  subcategoriaId: string | null;
  termoBusca?: string;
  onArtigoClick: (artigo: ArtigoConhecimento) => void;
}

export function ArtigosList({ 
  categoriaId, 
  subcategoriaId, 
  termoBusca = '', 
  onArtigoClick 
}: ArtigosListProps) {
  const { 
    artigos, 
    buscarArtigos, 
    isLoading 
  } = useBaseConhecimento();
  
  const [filteredArtigos, setFilteredArtigos] = useState<ArtigoConhecimento[]>([]);

  // Buscar artigos quando a categoria ou subcategoria mudar
  useEffect(() => {
    if (categoriaId) {
      buscarArtigos(categoriaId, subcategoriaId);
    } else if (termoBusca) {
      buscarArtigos(null, null, termoBusca);
    }
  }, [categoriaId, subcategoriaId, termoBusca, buscarArtigos]);

  // Filtrar artigos localmente com base no termo de busca
  useEffect(() => {
    if (!termoBusca) {
      setFilteredArtigos(artigos);
      return;
    }
    
    const termoLowerCase = termoBusca.toLowerCase();
    const filtered = artigos.filter(artigo => 
      artigo.titulo.toLowerCase().includes(termoLowerCase) || 
      artigo.conteudo.toLowerCase().includes(termoLowerCase) ||
      (artigo.tags && artigo.tags.some(tag => tag.toLowerCase().includes(termoLowerCase)))
    );
    
    setFilteredArtigos(filtered);
  }, [artigos, termoBusca]);

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Nenhum artigo encontrado
  if (filteredArtigos.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum artigo encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          {termoBusca 
            ? `Não encontramos resultados para "${termoBusca}"`
            : 'Tente selecionar outra categoria ou faça uma busca'
          }
        </p>
      </div>
    );
  }

  // Renderiza a lista de artigos
  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium text-lg mb-2">
        {termoBusca 
          ? `Resultados para "${termoBusca}" (${filteredArtigos.length})`
          : `Artigos (${filteredArtigos.length})`
        }
      </h3>
      
      {filteredArtigos.map(artigo => (
        <Card 
          key={artigo.id}
          className="cursor-pointer hover:border-blue-200 transition-colors"
          onClick={() => onArtigoClick(artigo)}
        >
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-700">{artigo.titulo}</h4>
            
            {artigo.resumo && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{artigo.resumo}</p>
            )}
            
            <div className="flex items-center mt-3 text-xs text-gray-500 space-x-4">
              <div className="flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                <span>{artigo.data_atualizacao || artigo.data_criacao}</span>
              </div>
              
              {artigo.autor && (
                <div className="flex items-center">
                  <UserIcon className="h-3 w-3 mr-1" />
                  <span>{artigo.autor}</span>
                </div>
              )}
              
              {artigo.visualizacoes !== undefined && (
                <div className="flex items-center">
                  <BookOpenIcon className="h-3 w-3 mr-1" />
                  <span>{artigo.visualizacoes} {artigo.visualizacoes === 1 ? 'visualização' : 'visualizações'}</span>
                </div>
              )}
            </div>
            
            {artigo.tags && artigo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {artigo.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <TagIcon className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 