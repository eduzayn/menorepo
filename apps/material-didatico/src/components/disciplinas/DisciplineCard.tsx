import { Card } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { Badge } from '@edunexia/ui-components'
import { Edit, Trash2, Clock, GripVertical } from 'lucide-react'
import type { Discipline } from '@/services/disciplines'

interface DisciplineCardProps extends Discipline {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDragging?: boolean
  dragHandleProps?: any
}

export function DisciplineCard({
  id,
  title,
  description,
  duration,
  status,
  lastUpdate,
  onEdit,
  onDelete,
  isDragging,
  dragHandleProps
}: DisciplineCardProps) {
  return (
    <Card className={`p-6 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <div {...dragHandleProps} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <h3 className="text-lg font-semibold flex-1">{title}</h3>
          <Badge variant={status === 'active' ? 'success' : 'secondary'}>
            {status === 'active' ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>

        <p className="text-gray-600">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{duration}</span>
            <span className="text-sm text-gray-400 ml-2">
              Atualizado em {lastUpdate.toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
} 