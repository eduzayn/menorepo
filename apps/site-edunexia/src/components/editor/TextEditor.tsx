import { useState, useEffect } from 'react';

interface TextEditorProps {
  initialValue: any;
  onChange: (content: any) => void;
  readOnly?: boolean;
}

interface EditorBlock {
  type: 'paragraph' | 'heading' | 'image';
  content: string;
  url?: string;
  alt?: string;
  caption?: string;
}

export const TextEditor = ({ initialValue, onChange, readOnly = false }: TextEditorProps) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);

  // Inicializar com o valor inicial
  useEffect(() => {
    if (initialValue) {
      if (Array.isArray(initialValue.blocks)) {
        setBlocks(initialValue.blocks);
      } else if (typeof initialValue === 'object' && initialValue !== null) {
        // Tentar converter para formato de blocos
        setBlocks([{ type: 'paragraph', content: JSON.stringify(initialValue) }]);
      } else {
        // Iniciar com um bloco vazio
        setBlocks([{ type: 'paragraph', content: '' }]);
      }
    } else {
      // Iniciar com um bloco vazio
      setBlocks([{ type: 'paragraph', content: '' }]);
    }
  }, [initialValue]);

  // Atualizar o conteúdo quando os blocos mudarem
  useEffect(() => {
    onChange({ blocks });
  }, [blocks, onChange]);

  // Atualizar o conteúdo de um bloco
  const updateBlock = (index: number, field: string, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    setBlocks(newBlocks);
  };

  // Adicionar um novo bloco
  const addBlock = (type: 'paragraph' | 'heading' | 'image' = 'paragraph') => {
    const newBlock: EditorBlock = { type, content: '' };
    if (type === 'image') {
      newBlock.url = '';
      newBlock.alt = '';
      newBlock.caption = '';
    }
    setBlocks([...blocks, newBlock]);
  };

  // Remover um bloco
  const removeBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    
    // Garantir que sempre haja pelo menos um bloco
    if (newBlocks.length === 0) {
      newBlocks.push({ type: 'paragraph', content: '' });
    }
    
    setBlocks(newBlocks);
  };

  // Mover um bloco para cima ou para baixo
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === blocks.length - 1)) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Trocar posição
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    setBlocks(newBlocks);
  };

  // Renderizar blocos baseado no tipo
  const renderBlockEditor = (block: EditorBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div className="mb-4">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, 'content', e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu texto aqui..."
              rows={3}
              disabled={readOnly}
            />
          </div>
        );
      
      case 'heading':
        return (
          <div className="mb-4">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(index, 'content', e.target.value)}
              className="w-full p-3 font-bold text-xl border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Título"
              disabled={readOnly}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="mb-4 space-y-2">
            <input
              type="url"
              value={block.url || ''}
              onChange={(e) => updateBlock(index, 'url', e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="URL da imagem"
              disabled={readOnly}
            />
            
            <input
              type="text"
              value={block.alt || ''}
              onChange={(e) => updateBlock(index, 'alt', e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Texto alternativo"
              disabled={readOnly}
            />
            
            <input
              type="text"
              value={block.caption || ''}
              onChange={(e) => updateBlock(index, 'caption', e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Legenda"
              disabled={readOnly}
            />
            
            {block.url && (
              <div className="mt-2">
                <img 
                  src={block.url} 
                  alt={block.alt || ''} 
                  className="max-h-40 rounded-md object-contain"
                />
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="mb-4">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, 'content', e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu texto aqui..."
              rows={3}
              disabled={readOnly}
            />
          </div>
        );
    }
  };

  // Renderizar o bloco para visualização (modo de leitura)
  const renderBlockPreview = (block: EditorBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div key={index} className="mb-4">
            <p className="text-gray-700">{block.content || 'Parágrafo vazio...'}</p>
          </div>
        );
      
      case 'heading':
        return (
          <div key={index} className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{block.content || 'Título vazio...'}</h2>
          </div>
        );
      
      case 'image':
        return (
          <div key={index} className="mb-4">
            {block.url ? (
              <figure>
                <img 
                  src={block.url} 
                  alt={block.alt || ''} 
                  className="max-w-full rounded-md"
                />
                {block.caption && (
                  <figcaption className="text-sm text-gray-500 mt-2">{block.caption}</figcaption>
                )}
              </figure>
            ) : (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-400">
                Imagem não definida
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div key={index} className="mb-4">
            <p className="text-gray-700">{block.content || 'Conteúdo vazio...'}</p>
          </div>
        );
    }
  };

  return (
    <div>
      {readOnly ? (
        // Modo de visualização
        <div className="prose max-w-none">
          {blocks.map((block, index) => (
            renderBlockPreview(block, index)
          ))}
        </div>
      ) : (
        // Modo de edição
        <div>
          {blocks.map((block, index) => (
            <div key={index} className="relative border border-gray-200 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-2">
                  <select
                    value={block.type}
                    onChange={(e) => updateBlock(index, 'type', e.target.value as 'paragraph' | 'heading' | 'image')}
                    className="text-sm border rounded-md"
                  >
                    <option value="paragraph">Parágrafo</option>
                    <option value="heading">Título</option>
                    <option value="image">Imagem</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    disabled={blocks.length <= 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-red-500"
                    title="Remover bloco"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {renderBlockEditor(block, index)}
            </div>
          ))}
          
          <div className="my-4 flex justify-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => addBlock('paragraph')}
                className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                + Parágrafo
              </button>
              <button
                type="button"
                onClick={() => addBlock('heading')}
                className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                + Título
              </button>
              <button
                type="button"
                onClick={() => addBlock('image')}
                className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                + Imagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 