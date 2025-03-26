import { BlockType } from '@/types/editor'
import { Button } from '@edunexia/ui-components'
import {
  Type,
  Video,
  HelpCircle,
  Activity,
  Cpu,
  Link,
} from 'lucide-react'

interface BlockSelectorProps {
  onSelect: (type: BlockType) => void
}

const blockTypes = [
  {
    type: 'text' as BlockType,
    label: 'Texto',
    icon: Type,
    description: 'Adicionar um bloco de texto formatado',
  },
  {
    type: 'video' as BlockType,
    label: 'Vídeo',
    icon: Video,
    description: 'Incorporar um vídeo do YouTube ou Vimeo',
  },
  {
    type: 'quiz' as BlockType,
    label: 'Quiz',
    icon: HelpCircle,
    description: 'Criar um quiz com múltipla escolha',
  },
  {
    type: 'activity' as BlockType,
    label: 'Atividade',
    icon: Activity,
    description: 'Adicionar uma atividade prática',
  },
  {
    type: 'simulation' as BlockType,
    label: 'Simulação',
    icon: Cpu,
    description: 'Incorporar uma simulação interativa',
  },
  {
    type: 'link' as BlockType,
    label: 'Link',
    icon: Link,
    description: 'Adicionar um link para recurso externo',
  },
]

export function BlockSelector({ onSelect }: BlockSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {blockTypes.map((block) => (
        <Button
          key={block.type}
          variant="outline"
          className="flex h-auto flex-col items-start gap-2 p-4 text-left"
          onClick={() => onSelect(block.type)}
        >
          <block.icon className="h-6 w-6" />
          <div>
            <h3 className="font-medium">{block.label}</h3>
            <p className="text-sm text-muted-foreground">
              {block.description}
            </p>
          </div>
        </Button>
      ))}
    </div>
  )
} 