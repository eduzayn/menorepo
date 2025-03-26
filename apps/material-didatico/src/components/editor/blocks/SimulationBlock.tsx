import { useState, ChangeEvent } from 'react'
import { SimulationBlock as SimulationBlockType } from '@/types/editor'
import { Button, Input, Textarea, Select } from '@edunexia/ui-components'
import { Trash2, Save, Edit2 } from 'lucide-react'

interface SimulationBlockProps {
  block: SimulationBlockType
  onUpdate: (block: SimulationBlockType) => void
  onDelete: (id: string) => void
}

export function SimulationBlock({ block, onUpdate, onDelete }: SimulationBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [description, setDescription] = useState(block.description || '')
  const [url, setUrl] = useState(block.url)
  const [simulationType, setSimulationType] = useState(block.simulationType)
  const [instructions, setInstructions] = useState(block.instructions)
  const [parameters, setParameters] = useState(block.parameters)

  const handleSave = () => {
    onUpdate({
      ...block,
      title,
      description,
      url,
      simulationType,
      instructions,
      parameters,
    })
    setIsEditing(false)
  }

  const handleAddParameter = () => {
    setParameters({
      ...parameters,
      [`param${Object.keys(parameters).length + 1}`]: '',
    })
  }

  const handleRemoveParameter = (key: string) => {
    const newParameters = { ...parameters }
    delete newParameters[key]
    setParameters(newParameters)
  }

  const handleUpdateParameter = (key: string, value: string) => {
    setParameters({
      ...parameters,
      [key]: value,
    })
  }

  if (isEditing) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <Input
          placeholder="Título da simulação"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Descrição da simulação"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
        <Input
          placeholder="URL da simulação"
          value={url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        />
        <Select
          value={simulationType}
          onValueChange={(value: string) => setSimulationType(value as typeof simulationType)}
        >
          <option value="interactive">Interativa</option>
          <option value="visualization">Visualização</option>
          <option value="experiment">Experimento</option>
        </Select>
        <Textarea
          placeholder="Instruções para a simulação"
          value={instructions}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
        />
        <div className="space-y-2">
          <h4 className="font-medium">Parâmetros</h4>
          {Object.entries(parameters).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <Input
                placeholder="Nome do parâmetro"
                value={key}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newParameters = { ...parameters }
                  delete newParameters[key]
                  newParameters[e.target.value] = value
                  setParameters(newParameters)
                }}
              />
              <Input
                placeholder="Valor do parâmetro"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateParameter(key, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveParameter(key)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddParameter}>Adicionar Parâmetro</Button>
        </div>
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
      <div className="aspect-video">
        <iframe
          src={url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div>
        <h4 className="font-medium">Instruções</h4>
        <p className="text-sm">{instructions}</p>
      </div>
      {Object.keys(parameters).length > 0 && (
        <div>
          <h4 className="font-medium">Parâmetros</h4>
          <ul className="list-disc list-inside text-sm">
            {Object.entries(parameters).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 