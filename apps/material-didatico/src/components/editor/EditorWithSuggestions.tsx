import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/router';
import { ContentEditor } from './ContentEditor';
import { SuggestionPanel } from '@/components/ai/SuggestionPanel';
import { AISuggestion } from '@/ai/suggestion-engine';
import { Block, Content } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { PanelRightOpenIcon, Sparkles } from 'lucide-react';

interface EditorWithSuggestionsProps {
  initialContent: Content;
  onSave: (content: Content) => Promise<void>;
  onPublish?: (content: Content) => Promise<void>;
  disciplineId?: string;
}

export function EditorWithSuggestions({
  initialContent,
  onSave,
  onPublish,
  disciplineId
}: EditorWithSuggestionsProps) {
  const [content, setContent] = useState<Content>(initialContent);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const router = useRouter();
  
  // Handle content changes
  const handleContentChange = (updatedContent: Content) => {
    setContent(updatedContent);
  };
  
  // Handle saving content
  const handleSave = async () => {
    try {
      await onSave(content);
      toast({
        title: 'Conteúdo salvo',
        description: 'Seu material didático foi salvo com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o material didático.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle publishing content
  const handlePublish = async () => {
    if (!onPublish) return;
    
    try {
      await onPublish(content);
      toast({
        title: 'Conteúdo publicado',
        description: 'Seu material didático foi publicado com sucesso.',
      });
      
      // Redirecionar para a lista de materiais após publicação
      router.push('/material-didatico/disciplinas');
    } catch (error) {
      console.error('Erro ao publicar conteúdo:', error);
      toast({
        title: 'Erro ao publicar',
        description: 'Não foi possível publicar o material didático.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    // Criar um novo bloco com base na sugestão
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: suggestion.blockType,
      title: suggestion.title,
      content: suggestion.preview,
      order: content.blocks.length,
      metadata: {
        source: 'ai-suggestion',
        confidence: suggestion.confidence,
        reasoning: suggestion.reasoning
      }
    };
    
    // Adicionar o bloco ao conteúdo
    const updatedContent: Content = {
      ...content,
      blocks: [...content.blocks, newBlock]
    };
    
    setContent(updatedContent);
    
    toast({
      title: 'Sugestão aplicada',
      description: `Bloco "${suggestion.title}" adicionado ao conteúdo.`,
    });
  };
  
  // Alternar visibilidade do painel de sugestões
  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };
  
  return (
    <div className="flex flex-row w-full h-full">
      {/* Editor principal */}
      <div className={`flex-grow transition-all ${showSuggestions ? 'pr-4' : ''}`}>
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {content.metadata.title || 'Novo Material Didático'}
          </h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSuggestions}
              className="flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
              {showSuggestions ? 'Ocultar Sugestões' : 'Mostrar Sugestões'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleSave}>
              Salvar
            </Button>
            
            {onPublish && (
              <Button variant="default" size="sm" onClick={handlePublish}>
                Publicar
              </Button>
            )}
          </div>
        </div>
        
        <ContentEditor 
          content={content} 
          onChange={handleContentChange}
          disciplineId={disciplineId}
        />
      </div>
      
      {/* Painel de sugestões */}
      <div className={`transition-all duration-300 ${showSuggestions ? 'w-80' : 'w-0 opacity-0'}`}>
        {showSuggestions && (
          <div className="sticky top-4">
            <SuggestionPanel
              title={content.metadata.title}
              description={content.metadata.description}
              currentBlocks={content.blocks.map(block => ({
                type: block.type,
                content: block.content,
                title: block.title
              }))}
              topic={content.metadata.topic}
              educationLevel={content.metadata.education_level}
              onSuggestionSelect={handleSuggestionSelect}
              isMinimized={false}
              onToggleMinimize={toggleSuggestions}
            />
          </div>
        )}
      </div>
    </div>
  );
} 