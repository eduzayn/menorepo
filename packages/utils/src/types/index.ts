import { ReactNode } from 'react'

// Tipos comuns
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// Editor
export interface EditorBlock {
  id: string
  type: 'text' | 'video' | 'quiz' | 'activity'
  content: any
}

export interface EditorToolbarProps extends BaseProps {
  onSave?: () => void
  onPreview?: () => void
  onExport?: () => void
}

export interface BlockSelectorProps extends BaseProps {
  onSelect: (type: EditorBlock['type']) => void
}

// Dashboard
export interface Stat {
  title: string
  value: string | number
  description: string
  icon: ReactNode
}

export interface Activity {
  id: string
  type: 'create' | 'edit' | 'delete' | 'publish'
  target: string
  author: string
  date: Date
}

// Cursos
export interface Course {
  id: string
  nome: string
  descricao: string
  disciplinas: number
  autores: number
  status: 'draft' | 'production' | 'review' | 'published'
  createdAt: Date
  updatedAt: Date
}

export interface CourseFormProps extends BaseProps {
  initialData?: Course
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void
}

// Disciplinas
export interface Discipline {
  id: string
  nome: string
  descricao: string
  cursoId: string
  modulos: Module[]
  status: 'draft' | 'production' | 'review' | 'published'
}

export interface Module {
  id: string
  nome: string
  descricao: string
  ordem: number
  aulas: string[]
}

export interface DisciplineFormProps extends BaseProps {
  cursoId: string
  initialData?: Discipline
  onSubmit: (data: Omit<Discipline, 'id'>) => void
}

// Templates
export interface Template {
  id: string
  nome: string
  descricao: string
  tipo: 'aula' | 'modulo' | 'curso'
  conteudo: any
  createdAt: Date
  updatedAt: Date
}

export interface TemplateFormProps extends BaseProps {
  initialData?: Template
  onSubmit: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void
}

// Shared
export interface StatusBadgeProps extends BaseProps {
  status: Course['status'] | Discipline['status']
}

export interface AuthorAvatarProps extends BaseProps {
  nome: string
  avatar?: string
  role?: string
}

export interface ActionButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
}

export interface ConfirmationDialogProps extends BaseProps {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
} 