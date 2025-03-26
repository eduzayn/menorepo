import { Card } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { ArrowLeft } from 'lucide-react'
import { courseService } from '@/services/courses'
import { disciplineService } from '@/services/disciplines'
import { DisciplineForm } from '@/components/disciplinas/DisciplineForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface NewDisciplinePageProps {
  params: {
    courseId: string
  }
}

export default async function NewDisciplinePage({ params }: NewDisciplinePageProps) {
  const course = await courseService.getCourse(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/cursos/${params.courseId}/disciplinas`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nova Disciplina</h1>
          <p className="text-gray-600">{course.title}</p>
        </div>
      </div>

      <Card className="p-6">
        <DisciplineForm
          initialData={{
            title: '',
            description: '',
            duration: '',
            status: 'active',
            objectives: '',
            prerequisites: ''
          }}
          onSubmit={async (data) => {
            'use server'
            const response = await disciplineService.createDiscipline({
              ...data,
              courseId: params.courseId,
              order: 0
            })
            if (!response.success) {
              throw new Error(response.error?.message || 'Erro ao criar disciplina')
            }
            return response.data
          }}
          onCancel={() => {}}
        />
      </Card>
    </div>
  )
} 