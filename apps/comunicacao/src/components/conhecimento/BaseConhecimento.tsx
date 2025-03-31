import React, { useState, useEffect } from 'react';
import { 
  CategoriaConhecimento, 
  ArtigoConhecimento, 
  useBaseConhecimento 
} from '../../hooks/useBaseConhecimento';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArtigosList } from './ArtigosList';
import { ArtigoDetail } from './ArtigoDetail';
import { FolderIcon, TagIcon, HeartIcon, BookOpenIcon, PlusIcon, SearchIcon } from '@heroicons/react/24/outline';
import { Input } from '../ui/input';

interface BaseConhecimentoProps {
  integradoChat?: boolean;
  onSelecionar?: (artigo: ArtigoConhecimento) => void;
}

export function BaseConhecimento({ integradoChat = false, onSelecionar }: BaseConhecimentoProps) {
  const { 
    categorias, 
    buscarCategorias, 
    isLoading 
  } = useBaseConhecimento();

  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState<string | null>(null);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'artigo'>('lista');
  const [artigoId, setArtigoId] = useState<string | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState<string>('categorias');
  const [termoBusca, setTermoBusca] = useState<string>('');

  // Carregar categorias ao iniciar
  useEffect(() => {
    buscarCategorias();
  }, [buscarCategorias]);

  // Manipular clique em categoria
  const handleCategoriaClick = (categoriaId: string) => {
    setCategoriaAtiva(categoriaId);
    setSubcategoriaAtiva(null);
  };

  // Manipular clique em subcategoria
  const handleSubcategoriaClick = (subcategoriaId: string) => {
    setSubcategoriaAtiva(subcategoriaId);
  };

  // Manipular clique em artigo
  const handleArtigoClick = (artigo: ArtigoConhecimento) => {
    if (integradoChat && onSelecionar) {
      // No modo integrado ao chat, notificar o componente pai
      onSelecionar(artigo);
    } else {
      // Modo padrão: mostrar detalhes do artigo
      setArtigoId(artigo.id);
      setVisualizacao('artigo');
    }
  };

  // Voltar para a lista
  const handleVoltar = () => {
    setVisualizacao('lista');
    setArtigoId(null);
  };

  // Renderizar estado de carregamento para as categorias
  const renderCategorias = () => {
    if (isLoading && categorias.length === 0) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (categorias.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          Nenhuma categoria encontrada
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map(categoria => (
          <Card 
            key={categoria.id}
            className={`cursor-pointer hover:border-blue-200 transition-colors ${
              categoriaAtiva === categoria.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleCategoriaClick(categoria.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-md bg-blue-100 text-blue-700">
                  {categoria.icone ? (
                    <span className="text-xl">{categoria.icone}</span>
                  ) : (
                    <FolderIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{categoria.nome}</h3>
                  {categoria.descricao && (
                    <p className="text-sm text-gray-500">{categoria.descricao}</p>
                  )}
                  <div className="text-sm text-gray-600 mt-1">
                    {categoria.quantidade_artigos} {categoria.quantidade_artigos === 1 ? 'artigo' : 'artigos'}
                  </div>
                </div>
              </div>
              
              {/* Subcategorias */}
              {categoria.subcategorias && categoria.subcategorias.length > 0 && (
                <div className="mt-3 space-y-1 pl-10">
                  {categoria.subcategorias.map(sub => (
                    <div 
                      key={sub.id}
                      className={`text-sm py-1 px-2 rounded cursor-pointer hover:bg-blue-100 ${
                        subcategoriaAtiva === sub.id ? 'bg-blue-100 font-medium' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubcategoriaClick(sub.id);
                      }}
                    >
                      {sub.nome}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Renderiza a interface de artigos baseado na categoria/subcategoria selecionada
  const renderArtigos = () => {
    if (visualizacao === 'artigo' && artigoId) {
      return (
        <ArtigoDetail
          artigoId={artigoId}
          onVoltar={handleVoltar}
        />
      );
    }

    return (
      <ArtigosList
        categoriaId={categoriaAtiva}
        subcategoriaId={subcategoriaAtiva}
        onArtigoClick={handleArtigoClick}
        termoBusca={termoBusca}
      />
    );
  };

  // Renderiza a interface de busca
  const renderBuscaConteudo = () => {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar na base de conhecimento..."
            className="w-full pl-10"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {renderArtigos()}
      </div>
    );
  };

  // Renderiza a interface de artigos favoritos
  const renderFavoritos = () => {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg border-gray-300">
          <div className="text-center">
            <HeartIcon className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Sem favoritos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Explore os artigos e marque-os como favoritos
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="base-conhecimento bg-white p-4 rounded-lg shadow">
      <Tabs defaultValue="categorias" value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="categorias" className="flex items-center space-x-2">
              <FolderIcon className="h-4 w-4" />
              <span>Categorias</span>
            </TabsTrigger>
            <TabsTrigger value="busca" className="flex items-center space-x-2">
              <SearchIcon className="h-4 w-4" />
              <span>Busca</span>
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex items-center space-x-2">
              <HeartIcon className="h-4 w-4" />
              <span>Favoritos</span>
            </TabsTrigger>
          </TabsList>
          
          {!integradoChat && (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              <span>Sugerir Artigo</span>
            </Button>
          )}
        </div>

        <TabsContent value="categorias" className="mt-0">
          {renderCategorias()}
          {(categoriaAtiva || subcategoriaAtiva) && renderArtigos()}
        </TabsContent>
        
        <TabsContent value="busca" className="mt-0">
          {renderBuscaConteudo()}
        </TabsContent>
        
        <TabsContent value="favoritos" className="mt-0">
          {renderFavoritos()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 