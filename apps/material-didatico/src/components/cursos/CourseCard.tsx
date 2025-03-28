import { Card } from '@edunexia/ui-components'
import { Badge } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { BookOpen, Users, Clock, Edit, Trash2 } from 'lucide-react'

interface CourseCardProps {
  id: string
  title: string
  description: string
  status: 'draft' | 'review' | 'published'
  totalDisciplines: number
  totalAuthors: number
  lastUpdate: Date
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800',
  review: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800'
}

const statusLabels = {
  draft: 'Rascunho',
  review: 'Em Revisão',
  published: 'Publicado'
}

export function CourseCard({
  id,
  title,
  description,
  status,
  totalDisciplines,
  totalAuthors,
  lastUpdate,
  onEdit,
  onDelete
}: CourseCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge className={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{totalDisciplines} disciplinas</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{totalAuthors} autores</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Atualizado {lastUpdate.toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
} 