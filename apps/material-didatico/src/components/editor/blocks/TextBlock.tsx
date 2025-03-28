import { useState, useCallback } from 'react'
import { TextBlock as TextBlockType } from '@/types/editor'
import { Button } from '@edunexia/ui-components'
import { EditorToolbar } from '../EditorToolbar'
import { Trash2, Wand2 } from 'lucide-react'
import { AIService } from '@/services/ai'

interface TextBlockProps {
  block: TextBlockType
  onUpdate: (blockId: string, updates: Partial<TextBlockType>) => void
  onDelete: (blockId: string) => void
}

export function TextBlock({ block, onUpdate, onDelete }: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(block.content || '')
  const aiService = AIService.getInstance()

  const handleFormat = useCallback((format: string) => {
    // Implementar formatação de texto
    console.log('Format:', format)
  }, [])

  const handleInsert = useCallback((type: string) => {
    // Implementar inserção de elementos
    console.log('Insert:', type)
  }, [])

  const handleGenerateAISuggestion = useCallback(async () => {
    try {
      const suggestion = await aiService.generateContentSuggestion(
        `Melhore o seguinte texto: ${content}`
      )
      setContent(suggestion.content)
      onUpdate(block.id, { content: suggestion.content })
    } catch (error) {
      console.error('Erro ao gerar sugestão:', error)
    }
  }, [content, block.id, onUpdate])

  return (
    <div className="group relative rounded-lg border p-4">
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGenerateAISuggestion}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <EditorToolbar onFormat={handleFormat} onInsert={handleInsert} />

      <div
        className="prose prose-sm max-w-none"
        contentEditable
        suppressContentEditableWarning
        onBlur={() => {
          setIsEditing(false)
          onUpdate(block.id, { content })
        }}
        onFocus={() => setIsEditing(true)}
        onInput={(e) => setContent(e.currentTarget.textContent || '')}
      >
        {content}
      </div>
    </div>
  )
} 