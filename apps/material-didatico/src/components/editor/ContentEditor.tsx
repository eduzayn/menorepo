import React, { useState } from 'react';
import { Content, Block, BlockType } from '@/types/editor';
import { Button } from '../../components/ui/button';
import { Plus, MoveVertical, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Componente placeholder para renderizar blocos (será expandido posteriormente)
const BlockRenderer = ({ 
  block, 
  onRemove, 
  onUpdate, 
  isSelected, 
  dragHandleProps 
}: { 
  block: Block, 
  onRemove: (id: string) => void,
  onUpdate: (id: string, updates: Partial<Block>) => void,
  isSelected: boolean,
  dragHandleProps?: any
}) => {
  return (
    <div className={`p-4 mb-4 border rounded-lg ${isSelected ? 'border-blue-500 shadow-sm' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {dragHandleProps && (
            <div {...dragHandleProps} className="cursor-grab mr-2 text-gray-400 hover:text-gray-600">
              <GripVertical size={18} />
            </div>
          )}
          <h3 className="text-lg font-medium">{block.title}</h3>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onRemove(block.id)}>
            Remover
          </Button>
        </div>
      </div>
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
  const addBlock = (type: BlockType = 'text') => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
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

  // Gerenciar o arrastar e soltar
  const handleDragEnd = (result: DropResult) => {
    // Ignorar se soltar fora de uma área válida
    if (!result.destination) return;
    
    // Ignorar se soltou na mesma posição
    if (result.destination.index === result.source.index) return;
    
    // Criar uma cópia dos blocos atuais
    const reorderedBlocks = Array.from(content.blocks);
    
    // Remover o bloco arrastado da posição original
    const [movedBlock] = reorderedBlocks.splice(result.source.index, 1);
    
    // Inserir o bloco na nova posição
    reorderedBlocks.splice(result.destination.index, 0, movedBlock);
    
    // Atualizar as ordens dos blocos
    const updatedBlocks = reorderedBlocks.map((block, index) => ({
      ...block,
      order: index
    }));
    
    // Atualizar o conteúdo com os blocos reordenados
    onChange({
      ...content,
      blocks: updatedBlocks
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
            <Button onClick={() => addBlock()} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar bloco
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="content-blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {content.blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'opacity-70' : ''}
                        >
                          <BlockRenderer
                            key={block.id}
                            block={block}
                            onRemove={removeBlock}
                            onUpdate={updateBlock}
                            isSelected={selectedBlockId === block.id}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            
            <div className="pt-4 flex space-x-2">
              <Button onClick={() => addBlock('text')} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Texto
              </Button>
              <Button onClick={() => addBlock('video')} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Vídeo
              </Button>
              <Button onClick={() => addBlock('quiz')} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Quiz
              </Button>
              <Button onClick={() => addBlock('activity')} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Atividade
              </Button>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
} 