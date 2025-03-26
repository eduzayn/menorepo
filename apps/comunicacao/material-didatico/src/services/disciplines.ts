import { z } from 'zod'
import type { ActionResponse } from '@/types/actions'

const disciplineSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  duration: z.string().min(1, 'Informe a duração da disciplina'),
  status: z.enum(['active', 'inactive']),
  courseId: z.string().min(1, 'O curso é obrigatório'),
  order: z.number().min(0, 'A ordem deve ser um número positivo'),
  objectives: z.string().min(10, 'Descreva os objetivos da disciplina'),
  prerequisites: z.string().optional()
})

export type DisciplineFormData = z.infer<typeof disciplineSchema>

export interface Discipline extends DisciplineFormData {
  id: string
  lastUpdate: Date
}

class DisciplineService {
  private static instance: DisciplineService
  private disciplines: Discipline[] = []

  private constructor() {}

  static getInstance(): DisciplineService {
    if (!DisciplineService.instance) {
      DisciplineService.instance = new DisciplineService()
    }
    return DisciplineService.instance
  }

  async listDisciplines(courseId: string): Promise<Discipline[]> {
    // TODO: Implementar integração com API
    return this.disciplines.filter(discipline => discipline.courseId === courseId)
  }

  async getDiscipline(id: string): Promise<Discipline | null> {
    // TODO: Implementar integração com API
    return this.disciplines.find(discipline => discipline.id === id) || null
  }

  async createDiscipline(data: DisciplineFormData): Promise<ActionResponse<Discipline>> {
    try {
      // TODO: Implementar integração com API
      const newDiscipline: Discipline = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdate: new Date()
      }
      this.disciplines.push(newDiscipline)
      return { success: true, data: newDiscipline }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao criar disciplina')
      }
    }
  }

  async updateDiscipline(id: string, data: DisciplineFormData): Promise<ActionResponse<Discipline>> {
    try {
      // TODO: Implementar integração com API
      const index = this.disciplines.findIndex(discipline => discipline.id === id)
      if (index === -1) {
        return {
          success: false,
          error: new Error('Disciplina não encontrada')
        }
      }

      const updatedDiscipline: Discipline = {
        ...this.disciplines[index],
        ...data,
        lastUpdate: new Date()
      }
      this.disciplines[index] = updatedDiscipline
      return { success: true, data: updatedDiscipline }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao atualizar disciplina')
      }
    }
  }

  async deleteDiscipline(id: string): Promise<ActionResponse<void>> {
    try {
      // TODO: Implementar integração com API
      const index = this.disciplines.findIndex(discipline => discipline.id === id)
      if (index === -1) {
        return {
          success: false,
          error: new Error('Disciplina não encontrada')
        }
      }

      this.disciplines.splice(index, 1)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao excluir disciplina')
      }
    }
  }

  async reorderDisciplines(courseId: string, orderedIds: string[]): Promise<ActionResponse<void>> {
    try {
      // TODO: Implementar integração com API
      const disciplines = this.disciplines.filter(discipline => discipline.courseId === courseId)
      const orderedDisciplines = orderedIds.map((id, index) => {
        const discipline = disciplines.find(d => d.id === id)
        if (!discipline) {
          throw new Error(`Disciplina ${id} não encontrada`)
        }
        return {
          ...discipline,
          order: index
        }
      })

      orderedDisciplines.forEach(discipline => {
        const index = this.disciplines.findIndex(d => d.id === discipline.id)
        if (index !== -1) {
          this.disciplines[index] = discipline
        }
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Erro ao reordenar disciplinas')
      }
    }
  }
}

export const disciplineService = DisciplineService.getInstance() 