import { useState, useCallback } from 'react'
import { EditorState, Content, BlockType } from '@/types/editor'
import { AIService } from '@/services/ai'
import { Button } from '@edunexia/ui-components'
import { Plus, Wand2, Save, Undo, Redo } from 'lucide-react'
import { EditorToolbar } from './EditorToolbar'
import { BlockSelector } from './BlockSelector'
import { TextBlock } from './blocks/TextBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { QuizBlock } from './blocks/QuizBlock'
import { ActivityBlock } from './blocks/ActivityBlock'
import { SimulationBlock } from './blocks/SimulationBlock'
import { LinkBlock } from './blocks/LinkBlock'

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

  const aiService = AIService.getInstance()

  const handleAddBlock = useCallback((type: BlockType) => {
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
  }, [state.content.blocks.length])

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<Content['blocks'][0]>) => {
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: prev.content.blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      },
    }))
  }, [])

  const handleDeleteBlock = useCallback((blockId: string) => {
    setState(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: prev.content.blocks.filter(block => block.id !== blockId),
      },
    }))
  }, [])

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
  }, [state.content.blocks])

  const handleSave = useCallback(() => {
    onSave?.(state.content)
  }, [state.content, onSave])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleGenerateAISuggestion('content')}>
            <Wand2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Redo className="h-4 w-4" />
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
          {state.content.blocks.map((block) => {
            switch (block.type) {
              case BlockType.TEXT:
                return (
                  <TextBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                )
              case BlockType.VIDEO:
                return (
                  <VideoBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                )
              case BlockType.QUIZ:
                return (
                  <QuizBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                )
              case BlockType.ACTIVITY:
                return (
                  <ActivityBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                )
              case BlockType.SIMULATION:
                return (
                  <SimulationBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                )
              case BlockType.LINK:
                return (
                  <LinkBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                  />
                )
              default:
                return null
            }
          })}

          {state.content.blocks.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <Button variant="outline" onClick={() => handleAddBlock(BlockType.TEXT)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Bloco
              </Button>
            </div>
          )}
        </div>
      </div>

      {state.error && (
        <div className="border-t bg-destructive/10 p-4 text-destructive">
          {state.error}
        </div>
      )}
    </div>
  )
} 