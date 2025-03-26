import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import type { ActionResponse } from '@/types/actions'

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

export type CourseFormData = z.infer<typeof courseSchema>

export interface Course extends CourseFormData {
  id: string
  totalDisciplines: number
  totalAuthors: number
  lastUpdate: Date
}

class CourseService {
  private static instance: CourseService
  private courses: Course[] = []

  private constructor() {}

  static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService()
    }
    return CourseService.instance
  }

  async listCourses(): Promise<Course[]> {
    // TODO: Implementar integração com API
    return this.courses
  }

  async getCourse(id: string): Promise<Course | null> {
    // TODO: Implementar integração com API
    return this.courses.find(course => course.id === id) || null
  }

  async createCourse(data: CourseFormData): Promise<ActionResponse<Course>> {
    try {
      // TODO: Implementar integração com API
      const newCourse: Course = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        totalDisciplines: 0,
        totalAuthors: 0,
        lastUpdate: new Date()
      }
      this.courses.push(newCourse)
      return { success: true, data: newCourse }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao criar curso')
      }
    }
  }

  async updateCourse(id: string, data: CourseFormData): Promise<ActionResponse<Course>> {
    try {
      // TODO: Implementar integração com API
      const index = this.courses.findIndex(course => course.id === id)
      if (index === -1) {
        return {
          success: false,
          error: new Error('Curso não encontrado')
        }
      }

      const updatedCourse: Course = {
        ...this.courses[index],
        ...data,
        lastUpdate: new Date()
      }
      this.courses[index] = updatedCourse
      return { success: true, data: updatedCourse }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao atualizar curso')
      }
    }
  }

  async deleteCourse(id: string): Promise<ActionResponse<void>> {
    try {
      // TODO: Implementar integração com API
      const index = this.courses.findIndex(course => course.id === id)
      if (index === -1) {
        return {
          success: false,
          error: new Error('Curso não encontrado')
        }
      }

      this.courses.splice(index, 1)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao excluir curso')
      }
    }
  }
}

export const courseService = CourseService.getInstance() 