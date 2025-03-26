import { Card } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Textarea } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { Select } from '@edunexia/ui-components'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const courseSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  status: z.enum(['draft', 'review', 'published']),
  category: z.string().min(1, 'Selecione uma categoria'),
  level: z.enum(['basic', 'intermediate', 'advanced']),
  duration: z.string().min(1, 'Informe a duração do curso'),
  prerequisites: z.string().optional(),
  objectives: z.string().min(10, 'Descreva os objetivos do curso')
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  initialData?: CourseFormData
  onSubmit: (data: CourseFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CourseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData
  })

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Input
            label="Título do Curso"
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
          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'draft', label: 'Rascunho' },
              { value: 'review', label: 'Em Revisão' },
              { value: 'published', label: 'Publicado' }
            ]}
          />

          <Select
            label="Nível"
            {...register('level')}
            error={errors.level?.message}
            options={[
              { value: 'basic', label: 'Básico' },
              { value: 'intermediate', label: 'Intermediário' },
              { value: 'advanced', label: 'Avançado' }
            ]}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Categoria"
            {...register('category')}
            error={errors.category?.message}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Duração"
            {...register('duration')}
            error={errors.duration?.message}
            placeholder="Ex: 40 horas"
          />
        </div>

        <div className="space-y-2">
          <Textarea
            label="Pré-requisitos"
            {...register('prerequisites')}
            error={errors.prerequisites?.message}
            placeholder="Liste os pré-requisitos do curso"
          />
        </div>

        <div className="space-y-2">
          <Textarea
            label="Objetivos"
            {...register('objectives')}
            error={errors.objectives?.message}
            placeholder="Descreva os objetivos de aprendizagem"
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
            {isLoading ? 'Salvando...' : 'Salvar Curso'}
          </Button>
        </div>
      </form>
    </Card>
  )
} 