import React, { useState } from 'react';
import { Content, Block } from '@/types/editor';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

// Componente placeholder para renderizar blocos (será expandido posteriormente)
const BlockRenderer = ({ block }: { block: Block }) => {
  return (
    <div className="p-4 mb-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">{block.title}</h3>
      <div className="prose">{block.content}</div>
    </div>
  );
};

interface ContentEditorProps {
  content: Content;
  onChange: (content: Content) => void;
  disciplineId?: string;
}

export function ContentEditor({ content, onChange, disciplineId }: ContentEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Adicionar um novo bloco vazio
  const addBlock = () => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: 'text',
      title: 'Novo bloco',
      content: '',
      order: content.blocks.length,
      metadata: {}
    };

    const updatedContent = {
      ...content,
      blocks: [...content.blocks, newBlock]
    };

    onChange(updatedContent);
    setSelectedBlockId(newBlock.id);
  };

  // Atualizar um bloco existente
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const updatedBlocks = content.blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    );

    onChange({
      ...content,
      blocks: updatedBlocks
    });
  };

  // Remover um bloco
  const removeBlock = (blockId: string) => {
    const updatedBlocks = content.blocks.filter(block => block.id !== blockId);
    
    // Reordenar blocos após remoção
    const reorderedBlocks = updatedBlocks.map((block, index) => ({
      ...block,
      order: index
    }));

    onChange({
      ...content,
      blocks: reorderedBlocks
    });
  };

  return (
    <div className="space-y-4">
      {/* Metadados do conteúdo */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={content.metadata.title || ''}
            onChange={(e) => {
              onChange({
                ...content,
                metadata: {
                  ...content.metadata,
                  title: e.target.value
                }
              });
            }}
            className="w-full p-2 border rounded"
            placeholder="Título do material"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={content.metadata.description || ''}
            onChange={(e) => {
              onChange({
                ...content,
                metadata: {
                  ...content.metadata,
                  description: e.target.value
                }
              });
            }}
            className="w-full p-2 border rounded"
            placeholder="Descrição ou resumo do material"
            rows={3}
          />
        </div>
      </div>

      {/* Lista de blocos */}
      <div className="space-y-4">
        {content.blocks.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed rounded-lg">
            <p className="mb-4 text-gray-500">Este material não possui conteúdo ainda.</p>
            <Button onClick={addBlock} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar bloco
            </Button>
          </div>
        ) : (
          <>
            {content.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
            
            <div className="pt-4">
              <Button onClick={addBlock} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar bloco
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 