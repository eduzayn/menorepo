// Status
export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  production: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
} as const

export const STATUS_LABELS = {
  draft: 'Rascunho',
  production: 'Em produção',
  review: 'Em revisão',
  published: 'Publicado',
} as const

// Editor
export const BLOCK_TYPES = {
  text: 'text',
  video: 'video',
  quiz: 'quiz',
  activity: 'activity',
} as const

export const BLOCK_LABELS = {
  text: 'Texto',
  video: 'Vídeo',
  quiz: 'Quiz',
  activity: 'Atividade',
} as const

// Dashboard
export const DASHBOARD_STATS = [
  {
    title: 'Cursos',
    value: '12',
    description: 'Total de cursos criados',
  },
  {
    title: 'Disciplinas',
    value: '48',
    description: 'Total de disciplinas',
  },
  {
    title: 'Templates',
    value: '8',
    description: 'Templates disponíveis',
  },
  {
    title: 'Autores',
    value: '24',
    description: 'Autores ativos',
  },
] as const

// Cursos
export const COURSE_TYPES = {
  regular: 'regular',
  workshop: 'workshop',
  certification: 'certification',
} as const

export const COURSE_LABELS = {
  regular: 'Regular',
  workshop: 'Workshop',
  certification: 'Certificação',
} as const

// Disciplinas
export const DISCIPLINE_TYPES = {
  theoretical: 'theoretical',
  practical: 'practical',
  hybrid: 'hybrid',
} as const

export const DISCIPLINE_LABELS = {
  theoretical: 'Teórica',
  practical: 'Prática',
  hybrid: 'Híbrida',
} as const

// Templates
export const TEMPLATE_TYPES = {
  aula: 'aula',
  modulo: 'modulo',
  curso: 'curso',
} as const

export const TEMPLATE_LABELS = {
  aula: 'Aula',
  modulo: 'Módulo',
  curso: 'Curso',
} as const

// Shared
export const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
} as const

export const BUTTON_SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

export const BUTTON_LABELS = {
  save: 'Salvar',
  cancel: 'Cancelar',
  edit: 'Editar',
  delete: 'Excluir',
  preview: 'Visualizar',
  export: 'Exportar',
} as const 