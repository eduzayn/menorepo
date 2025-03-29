import { Button } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Select } from '@edunexia/ui-components'
import { Card } from '@edunexia/ui-components'
import { CourseCard } from '@edunexia/ui-components'
import { Plus, Search, Filter } from 'lucide-react'
import { CourseForm } from '@/components/cursos/CourseForm'
import { courseService, type Course, type CourseFormData } from '@/services/courses'
import { useState, useEffect } from 'react'

type CourseStatus = 'draft' | 'review' | 'published'

export default function CursosPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.listCourses()
      setCourses(data)
    } catch (err) {
      setError('Erro ao carregar cursos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = async (data: CourseFormData) => {
    try {
      const response = await courseService.createCourse(data)
      if (response.success && response.data) {
        setCourses(prev => [...prev, response.data])
        setShowForm(false)
      } else {
        setError(response.error?.message || 'Erro ao criar curso')
      }
    } catch (err) {
      setError('Erro ao criar curso')
      console.error(err)
    }
  }

  const handleEditCourse = async (id: string) => {
    // TODO: Implementar edição do curso
    console.log('Editar curso:', id)
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await courseService.deleteCourse(id)
      if (response.success) {
        setCourses(prev => prev.filter(course => course.id !== id))
      } else {
        setError(response.error?.message || 'Erro ao excluir curso')
      }
    } catch (err) {
      setError('Erro ao excluir curso')
      console.error(err)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      {showForm ? (
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as CourseStatus | 'all')}
                  className="w-40"
                >
                  <option value="all">Todos os Status</option>
                  <option value="draft">Rascunho</option>
                  <option value="review">Em Revisão</option>
                  <option value="published">Publicado</option>
                </Select>
              </div>
            </div>
          </Card>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
} 