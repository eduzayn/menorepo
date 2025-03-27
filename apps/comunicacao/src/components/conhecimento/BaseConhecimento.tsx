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
import { FolderIcon, TagIcon, HeartIcon, BookOpenIcon, PlusIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="space-y-4">
      {!integradoChat && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Base de Conhecimento</h2>
          <div>
            {/* Botão para criar novo artigo - visível apenas para usuários autorizados */}
            <Button variant="outline" className="flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              Novo Artigo
            </Button>
          </div>
        </div>
      )}
      
      {visualizacao === 'lista' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navegação lateral */}
          <div className="md:col-span-1">
            <Tabs defaultValue="categorias" value={abaSelecionada} onValueChange={setAbaSelecionada}>
              <TabsList className="w-full">
                <TabsTrigger value="categorias" className="flex-1">
                  <FolderIcon className="h-4 w-4 mr-1" />
                  Categorias
                </TabsTrigger>
                <TabsTrigger value="favoritos" className="flex-1">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  Favoritos
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                <TabsContent value="categorias">
                  {renderCategorias()}
                </TabsContent>
                
                <TabsContent value="favoritos">
                  <ArtigosList 
                    onArtigoSelected={handleArtigoClick}
                    favoritos
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Lista de artigos */}
          <div className="md:col-span-3">
            {categoriaAtiva ? (
              <ArtigosList 
                categoria={categoriaAtiva}
                subcategoria={subcategoriaAtiva}
                onArtigoSelected={handleArtigoClick}
              />
            ) : abaSelecionada === 'favoritos' ? null : (
              <div className="text-center p-8 border rounded-lg bg-gray-50 flex flex-col items-center justify-center h-64">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Selecione uma categoria</h3>
                <p className="text-gray-500 mt-1">
                  Escolha uma categoria para visualizar os artigos disponíveis
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Visualização de artigo */
        <ArtigoDetail 
          artigoId={artigoId!}
          onVoltar={handleVoltar}
        />
      )}
    </div>
  );
} 