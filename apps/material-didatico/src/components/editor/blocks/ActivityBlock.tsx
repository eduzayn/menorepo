import { useState, useCallback } from 'react'
import { ActivityBlock as ActivityBlockType } from '@/types/editor'
import { Button } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Textarea } from '@edunexia/ui-components'
import { Trash2 } from 'lucide-react'

interface ActivityBlockProps {
  block: ActivityBlockType
  onUpdate: (blockId: string, updates: Partial<ActivityBlockType>) => void
  onDelete: (blockId: string) => void
}

export function ActivityBlock({ block, onUpdate, onDelete }: ActivityBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [description, setDescription] = useState(block.description || '')
  const [instructions, setInstructions] = useState(block.instructions || '')
  const [resources, setResources] = useState<string[]>(block.resources || [])
  const [duration, setDuration] = useState(block.duration || '')
  const [difficulty, setDifficulty] = useState(block.difficulty || 'medium')

  const handleSave = useCallback(() => {
    setIsEditing(false)
    onUpdate(block.id, {
      title,
      description,
      instructions,
      resources,
      duration,
      difficulty,
    })
  }, [block.id, title, description, instructions, resources, duration, difficulty, onUpdate])

  const handleAddResource = useCallback(() => {
    setResources([...resources, ''])
  }, [resources])

  const handleRemoveResource = useCallback((index: number) => {
    setResources(resources.filter((_, i) => i !== index))
  }, [resources])

  const handleUpdateResource = useCallback((index: number, value: string) => {
    setResources(
      resources.map((r, i) => (i === index ? value : r))
    )
  }, [resources])

  if (isEditing) {
    return (
      <div className="rounded-lg border p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Digite o título da atividade"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para a atividade"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Instruções</label>
            <Textarea
              value={instructions}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
              placeholder="Digite as instruções para a atividade"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Recursos</label>
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={resource}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleUpdateResource(index, e.target.value)
                    }
                    placeholder="Digite o link do recurso"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResource(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddResource}
              >
                Adicionar Recurso
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Duração</label>
              <Input
                value={duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                placeholder="Ex: 30 minutos"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Dificuldade</label>
              <select
                value={difficulty}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>
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

      {description && (
        <p className="mb-4 text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium">Instruções</h4>
          <p className="whitespace-pre-wrap">{instructions}</p>
        </div>

        {resources.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Recursos</h4>
            <ul className="list-inside list-disc space-y-1">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {duration && (
            <div>
              <span className="font-medium">Duração:</span> {duration}
            </div>
          )}
          <div>
            <span className="font-medium">Dificuldade:</span>{' '}
            <span className="capitalize">{difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 