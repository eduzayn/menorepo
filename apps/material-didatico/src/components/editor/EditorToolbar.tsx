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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Indent,
  Outdent,
  PaintBucket,
  Type,
  FileVideo,
  FileAudio,
  FilePenLine,
} from 'lucide-react'

interface EditorToolbarProps {
  onFormat: (format: string) => void
  onInsert: (type: string) => void
  onAlign?: (align: 'left' | 'center' | 'right') => void
  onHeading?: (level: 1 | 2 | 3 | 'normal') => void
  onList?: (type: 'bullet' | 'ordered' | 'none') => void
  onIndent?: (type: 'increase' | 'decrease') => void
  onColor?: (type: 'text' | 'background', color: string) => void
}

export function EditorToolbar({ 
  onFormat, 
  onInsert,
  onAlign,
  onHeading,
  onList,
  onIndent,
  onColor 
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border p-1">
      {/* Grupo de estilo de texto */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFormat('bold')}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFormat('italic')}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFormat('underline')}
          title="Sublinhado"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Grupo de alinhamento */}
      {onAlign && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAlign('left')}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAlign('center')}
            title="Centralizar"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAlign('right')}
            title="Alinhar à direita"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {onAlign && <div className="mx-1 h-4 w-px bg-border" />}

      {/* Grupo de títulos */}
      {onHeading && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHeading(1)}
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHeading(2)}
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHeading(3)}
            title="Título 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHeading('normal')}
            title="Texto normal"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      )}

      {onHeading && <div className="mx-1 h-4 w-px bg-border" />}

      {/* Grupo de listas */}
      {onList && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onList('bullet')}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onList('ordered')}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      )}

      {onList && <div className="mx-1 h-4 w-px bg-border" />}

      {/* Grupo de indentação */}
      {onIndent && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onIndent('increase')}
            title="Aumentar recuo"
          >
            <Indent className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onIndent('decrease')}
            title="Diminuir recuo"
          >
            <Outdent className="h-4 w-4" />
          </Button>
        </div>
      )}

      {onIndent && <div className="mx-1 h-4 w-px bg-border" />}

      {/* Grupo de inserção */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('image')}
          title="Inserir imagem"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('link')}
          title="Inserir link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('video')}
          title="Inserir vídeo"
        >
          <FileVideo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('audio')}
          title="Inserir áudio"
        >
          <FileAudio className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('code')}
          title="Inserir código"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('quote')}
          title="Inserir citação"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInsert('table')}
          title="Inserir tabela"
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Cor de texto e fundo (se disponível) */}
      {onColor && (
        <>
          <div className="mx-1 h-4 w-px bg-border" />
          <div className="flex items-center gap-1">
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                title="Cor do texto"
              >
                <Type className="h-4 w-4" />
              </Button>
              <div className="absolute hidden group-hover:flex flex-wrap w-48 p-2 bg-white border rounded-md shadow-md z-10 top-full left-0 mt-1">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onColor('text', color)}
                    className="w-6 h-6 m-1 rounded-sm border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                title="Cor de fundo"
              >
                <PaintBucket className="h-4 w-4" />
              </Button>
              <div className="absolute hidden group-hover:flex flex-wrap w-48 p-2 bg-white border rounded-md shadow-md z-10 top-full left-0 mt-1">
                {['#FFFFFF', '#FFEEEE', '#EEFFEE', '#EEEEFF', '#FFFFEE', '#FFEEFF', '#EEFFFF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => onColor('background', color)}
                    className="w-6 h-6 m-1 rounded-sm border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 