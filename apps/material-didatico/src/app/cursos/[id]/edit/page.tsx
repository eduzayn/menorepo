import { Card } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { ArrowLeft } from 'lucide-react'
import { courseService } from '@/services/courses'
import { CourseForm } from '@/components/cursos/CourseForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface EditCoursePageProps {
  params: {
    id: string
  }
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const course = await courseService.getCourse(params.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/cursos/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Curso</h1>
      </div>

      <Card className="p-6">
        <CourseForm
          initialData={{
            title: course.title,
            description: course.description,
            status: course.status,
            category: course.category,
            level: course.level,
            duration: course.duration,
            prerequisites: course.prerequisites,
            objectives: course.objectives
          }}
          onSubmit={async (data) => {
            'use server'
            const response = await courseService.updateCourse(params.id, data)
            if (!response.success) {
              throw new Error(response.error?.message || 'Erro ao atualizar curso')
            }
            return response.data
          }}
          onCancel={() => {}}
        />
      </Card>
    </div>
  )
} 