import { Button } from '@edunexia/ui-components'
import {
  Bold,
  Italic,
  Underline,
  Image,
  Link as LinkIcon,
  Code,
  Quote,
  Table,
} from 'lucide-react'

interface EditorToolbarProps {
  onFormat: (format: string) => void
  onInsert: (type: string) => void
}

export function EditorToolbar({ onFormat, onInsert }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormat('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormat('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onFormat('underline')}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('image')}
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('link')}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('code')}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('quote')}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsert('table')}
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  )
} 