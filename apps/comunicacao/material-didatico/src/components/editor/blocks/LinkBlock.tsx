import { useState, ChangeEvent } from 'react'
import { LinkBlock as LinkBlockType } from '@/types/editor'
import { Button, Input, Textarea, Select } from '@edunexia/ui-components'
import { Trash2, Save, Edit2, ExternalLink } from 'lucide-react'

interface LinkBlockProps {
  block: LinkBlockType
  onUpdate: (block: LinkBlockType) => void
  onDelete: (id: string) => void
}

export function LinkBlock({ block, onUpdate, onDelete }: LinkBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [description, setDescription] = useState(block.description || '')
  const [url, setUrl] = useState(block.url)
  const [linkType, setLinkType] = useState(block.linkType)

  const handleSave = () => {
    onUpdate({
      ...block,
      title,
      description,
      url,
      linkType,
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <Input
          placeholder="Título do link"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Descrição do link"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
        <Input
          placeholder="URL do link"
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        />
        <Select
          value={linkType}
          onValueChange={(value: string) => setLinkType(value as typeof linkType)}
        >
          <option value="resource">Recurso</option>
          <option value="reference">Referência</option>
          <option value="tool">Ferramenta</option>
        </Select>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(block.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <span>{url}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
} 