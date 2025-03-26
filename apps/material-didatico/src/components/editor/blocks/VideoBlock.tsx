import { useState, useCallback } from 'react'
import { VideoBlock as VideoBlockType } from '@/types/editor'
import { Button } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Textarea } from '@edunexia/ui-components'
import { Trash2 } from 'lucide-react'

interface VideoBlockProps {
  block: VideoBlockType
  onUpdate: (blockId: string, updates: Partial<VideoBlockType>) => void
  onDelete: (blockId: string) => void
}

export function VideoBlock({ block, onUpdate, onDelete }: VideoBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [url, setUrl] = useState(block.url || '')
  const [title, setTitle] = useState(block.title || '')
  const [description, setDescription] = useState(block.description || '')

  const handleSave = useCallback(() => {
    setIsEditing(false)
    onUpdate(block.id, {
      url,
      title,
      description,
    })
  }, [block.id, url, title, description, onUpdate])

  const getVideoEmbedUrl = useCallback((url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/([0-9]+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }, [])

  if (isEditing) {
    return (
      <div className="rounded-lg border p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">URL do Vídeo</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole a URL do YouTube ou Vimeo"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do vídeo"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para o vídeo"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-lg border p-4">
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {title && (
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
      )}

      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          src={getVideoEmbedUrl(url)}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
} 