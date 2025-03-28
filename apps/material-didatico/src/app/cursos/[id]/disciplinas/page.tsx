import { Card } from '@edunexia/ui-components'
import { Button } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Select } from '@edunexia/ui-components'
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react'
import { courseService } from '@/services/courses'
import { disciplineService } from '@/services/disciplines'
import { DisciplineList } from '@/components/disciplinas/DisciplineList'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

interface DisciplinesPageProps {
  params: {
    id: string
  }
}

export default async function DisciplinesPage({ params }: DisciplinesPageProps) {
  const course = await courseService.getCourse(params.id)
  const disciplines = await disciplineService.listDisciplines(params.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/cursos/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Disciplinas</h1>
            <p className="text-gray-600">{course.title}</p>
          </div>
        </div>
        <Link href={`/cursos/${params.id}/disciplinas/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Disciplina
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Buscar disciplinas..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select className="w-40">
              <option value="all">Todas as Disciplinas</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </Select>
          </div>
        </div>
      </Card>

      <DisciplineList
        disciplines={disciplines}
        onEdit={async (id) => {
          'use server'
          redirect(`/cursos/${params.id}/disciplinas/${id}/edit`)
        }}
        onDelete={async (id) => {
          'use server'
          const response = await disciplineService.deleteDiscipline(id)
          if (!response.success) {
            throw new Error(response.error?.message || 'Erro ao excluir disciplina')
          }
        }}
        onReorder={async (orderedIds) => {
          'use server'
          const response = await disciplineService.reorderDisciplines(params.id, orderedIds)
          if (!response.success) {
            throw new Error(response.error?.message || 'Erro ao reordenar disciplinas')
          }
        }}
      />
    </div>
  )
} 