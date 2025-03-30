import { useState, useCallback, useRef } from 'react'
import { EditorState, Content, BlockType } from '@/types/editor'
import { AIService } from '@/services/ai'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@edunexia/ui-components'
import { Plus, Wand2, Save, Undo, Redo, FileBox, Layers } from 'lucide-react'
import { EditorToolbar } from './EditorToolbar'
import { BlockSelector } from './BlockSelector'
import { TextBlock } from './blocks/TextBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { QuizBlock } from './blocks/QuizBlock'
import { ActivityBlock } from './blocks/ActivityBlock'
import { SimulationBlock } from './blocks/SimulationBlock'
import { LinkBlock } from './blocks/LinkBlock'
import { TemplateSelector } from './TemplateSelector'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface EditorProps {
  initialContent?: Content
  onSave?: (content: Content) => void
}

export function Editor({ initialContent, onSave }: EditorProps) {
  const [state, setState] = useState<EditorState>({
    content: initialContent || {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      objectives: [],
      blocks: [],
    },
    selectedBlockId: null,
    isEditing: false,
    aiSuggestions: [],
    isLoading: false,
    error: null,
  })

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [undoStack, setUndoStack] = useState<Content[]>([])
  const [redoStack, setRedoStack] = useState<Content[]>([])

  const aiService = AIService.getInstance()

  // Salva o estado atual para desfazer
  const saveHistory = useCallback((newContent: Content) => {
    setUndoStack(prev => [...prev, state.content])
    setRedoStack([])
  }, [state.content])

  const handleAddBlock = useCallback((type: BlockType) => {
    saveHistory(state.content)
    
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      order: state.content.blocks.length,
    }

    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: [...prev.content.blocks, newBlock],
      },
    }))
  }, [state.content.blocks.length, saveHistory])

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<Content['blocks'][0]>) => {
    saveHistory(state.content)
    
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: prev.content.blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      },
    }))
  }, [saveHistory])

  const handleDeleteBlock = useCallback((blockId: string) => {
    saveHistory(state.content)
    
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: prev.content.blocks.filter(block => block.id !== blockId),
      },
    }))
  }, [saveHistory])

  const handleGenerateAISuggestion = useCallback(async (type: 'content' | 'summary' | 'objectives' | 'activity' | 'correction') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      let suggestion
      switch (type) {
        case 'content':
          suggestion = await aiService.generateContentSuggestion('Gere um conteúdo educacional')
          break
        case 'summary':
          suggestion = await aiService.generateSummary(state.content.blocks.map(b => b.content).join('\n'))
          break
        case 'objectives':
          suggestion = await aiService.generateObjectives(state.content.blocks.map(b => b.content).join('\n'))
          break
        case 'activity':
          suggestion = await aiService.generateActivity(state.content.blocks.map(b => b.content).join('\n'))
          break
        case 'correction':
          suggestion = await aiService.correctContent(state.content.blocks.map(b => b.content).join('\n'))
          break
      }

      setState(prev => ({
        ...prev,
        aiSuggestions: [...prev.aiSuggestions, suggestion],
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao gerar sugestão',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.content.blocks, aiService])

  const handleSave = useCallback(() => {
    onSave?.(state.content)
  }, [state.content, onSave])

  // Lida com a função desfazer
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    
    const prevContent = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setRedoStack(prev => [...prev, state.content])
    
    setState(prev => ({
      ...prev,
      content: prevContent
    }))
  }, [undoStack, state.content])

  // Lida com a função refazer
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    
    const nextContent = redoStack[redoStack.length - 1]
    setRedoStack(prev => prev.slice(0, -1))
    setUndoStack(prev => [...prev, state.content])
    
    setState(prev => ({
      ...prev,
      content: nextContent
    }))
  }, [redoStack, state.content])

  // Lida com a seleção de um template
  const handleSelectTemplate = useCallback((templateContent: Content) => {
    saveHistory(state.content)
    
    setState(prev => ({
      ...prev,
      content: templateContent
    }))
    
    setIsTemplateDialogOpen(false)
  }, [saveHistory])

  // Gerencia o arrastar e soltar
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return
    
    // Se soltou no mesmo lugar, não faz nada
    if (result.destination.index === result.source.index) return
    
    saveHistory(state.content)
    
    // Reordena os blocos
    const reorderedBlocks = Array.from(state.content.blocks)
    const [movedBlock] = reorderedBlocks.splice(result.source.index, 1)
    reorderedBlocks.splice(result.destination.index, 0, movedBlock)
    
    // Atualiza as ordens
    const updatedBlocks = reorderedBlocks.map((block, index) => ({
      ...block,
      order: index
    }))
    
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: updatedBlocks
      }
    }))
  }, [state.content, saveHistory])

  // Renderização de um bloco baseado em seu tipo
  const renderBlock = useCallback((block, index) => {
    const isSelected = state.selectedBlockId === block.id
    
    const baseProps = {
      key: block.id,
      block,
      onUpdate: handleUpdateBlock,
      onDelete: handleDeleteBlock,
    }
    
    let BlockComponent
    
    switch (block.type) {
      case BlockType.TEXT:
        BlockComponent = TextBlock
        break
      case BlockType.VIDEO:
        BlockComponent = VideoBlock
        break
      case BlockType.QUIZ:
        BlockComponent = QuizBlock
        break
      case BlockType.ACTIVITY:
        BlockComponent = ActivityBlock
        break
      case BlockType.SIMULATION:
        BlockComponent = SimulationBlock
        break
      case BlockType.LINK:
        BlockComponent = LinkBlock
        break
      default:
        return null
    }
    
    return (
      <Draggable draggableId={block.id} index={index} key={block.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-4 ${snapshot.isDragging ? 'opacity-70' : ''}`}
          >
            <BlockComponent
              {...baseProps}
              dragHandleProps={provided.dragHandleProps}
              isSelected={isSelected}
            />
          </div>
        )}
      </Draggable>
    )
  }, [state.selectedBlockId, handleUpdateBlock, handleDeleteBlock])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleGenerateAISuggestion('content')} title="Gerar conteúdo com IA">
            <Wand2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleUndo} 
            disabled={undoStack.length === 0}
            title="Desfazer"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={redoStack.length === 0}
            onClick={handleRedo}
            title="Refazer"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsTemplateDialogOpen(true)}
            className="gap-2"
            title="Usar template"
          >
            <FileBox className="h-4 w-4" />
            Templates
          </Button>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r p-4">
          <BlockSelector onSelect={handleAddBlock} />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="editor-blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {state.content.blocks.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
                      <div>
                        <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="mb-4 text-gray-500">Comece adicionando um bloco ou usando um template</p>
                        <div className="flex gap-2 justify-center">
                          <Button onClick={() => handleAddBlock(BlockType.TEXT)} variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Adicionar Bloco
                          </Button>
                          <Button onClick={() => setIsTemplateDialogOpen(true)} variant="outline" className="gap-2">
                            <FileBox className="h-4 w-4" />
                            Usar Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    state.content.blocks.map((block, index) => renderBlock(block, index))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {state.error && (
        <div className="border-t bg-destructive/10 p-4 text-destructive">
          {state.error}
        </div>
      )}
      
      {/* Dialog para seleção de templates */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Selecionar Template</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden h-full">
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 