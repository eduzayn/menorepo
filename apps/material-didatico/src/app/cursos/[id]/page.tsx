import { Card } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { Badge } from '@edunexia/ui-components'
import { ArrowLeft, Edit, Trash2, BookOpen, Users, Clock } from 'lucide-react'
import { courseService } from '@/services/courses'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface CoursePageProps {
  params: {
    id: string
  }
}

async function deleteCourse(id: string) {
  'use server'
  const response = await courseService.deleteCourse(id)
  if (!response.success) {
    throw new Error(response.error?.message || 'Erro ao excluir curso')
  }
  redirect('/cursos')
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await courseService.getCourse(params.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cursos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/cursos/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <form action={deleteCourse.bind(null, params.id)}>
            <Button type="submit" variant="danger">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Descrição</h2>
            <p className="text-gray-600">{course.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Objetivos</h2>
            <p className="text-gray-600">{course.objectives}</p>
          </Card>

          {course.prerequisites && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Pré-requisitos</h2>
              <p className="text-gray-600">{course.prerequisites}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                  {course.status === 'published' ? 'Publicado' : 
                   course.status === 'review' ? 'Em Revisão' : 'Rascunho'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{course.category}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{course.totalAuthors} autores</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Última atualização: {course.lastUpdate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Disciplinas</h2>
            <p className="text-gray-600">
              Este curso possui {course.totalDisciplines} disciplinas.
            </p>
            <Link href={`/cursos/${params.id}/disciplinas`}>
              <Button className="mt-4 w-full">
                Gerenciar Disciplinas
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
} 