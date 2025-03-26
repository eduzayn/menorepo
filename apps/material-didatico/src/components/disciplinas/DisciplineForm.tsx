import { Card } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Textarea } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { Select } from '@edunexia/ui-components'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const disciplineSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  duration: z.string().min(1, 'Informe a duração da disciplina'),
  status: z.enum(['active', 'inactive']),
  objectives: z.string().min(10, 'Descreva os objetivos da disciplina'),
  prerequisites: z.string().optional()
})

type DisciplineFormData = z.infer<typeof disciplineSchema>

interface DisciplineFormProps {
  initialData?: DisciplineFormData
  onSubmit: (data: DisciplineFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function DisciplineForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: DisciplineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DisciplineFormData>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: initialData
  })

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Input
            label="Título da Disciplina"
            {...register('title')}
            error={errors.title?.message}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Input
              label="Duração"
              {...register('duration')}
              error={errors.duration?.message}
              placeholder="Ex: 40 horas"
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Status"
              {...register('status')}
              error={errors.status?.message}
            >
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Textarea
            label="Objetivos"
            {...register('objectives')}
            error={errors.objectives?.message}
            placeholder="Descreva os objetivos de aprendizagem"
          />
        </div>

        <div className="space-y-2">
          <Textarea
            label="Pré-requisitos"
            {...register('prerequisites')}
            error={errors.prerequisites?.message}
            placeholder="Liste os pré-requisitos da disciplina (opcional)"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Disciplina'}
          </Button>
        </div>
      </form>
    </Card>
  )
} 