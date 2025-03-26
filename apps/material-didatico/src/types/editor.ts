import { z } from 'zod'

// Tipos base
export type BlockType = 'text' | 'video' | 'quiz' | 'activity' | 'simulation' | 'link'

export const BaseBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number(),
  metadata: z.record(z.unknown()).optional(),
})

// Tipos específicos de blocos
export const TextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('text'),
  content: z.string(),
  format: z.object({
    bold: z.boolean().optional(),
    italic: z.boolean().optional(),
    underline: z.boolean().optional(),
    alignment: z.enum(['left', 'center', 'right']).optional(),
  }).optional(),
})

export const VideoBlockSchema = BaseBlockSchema.extend({
  type: z.literal('video'),
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
})

export const QuizBlockSchema = BaseBlockSchema.extend({
  type: z.literal('quiz'),
  title: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    options: z.array(z.string()),
    correctOption: z.number(),
  })),
})

export const ActivityBlockSchema = BaseBlockSchema.extend({
  type: z.literal('activity'),
  title: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string(),
  resources: z.array(z.string()),
  duration: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
})

export const SimulationBlockSchema = BaseBlockSchema.extend({
  type: z.literal('simulation'),
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url(),
  simulationType: z.enum(['interactive', 'visualization', 'experiment']),
  instructions: z.string(),
  parameters: z.record(z.string()),
})

export const LinkBlockSchema = BaseBlockSchema.extend({
  type: z.literal('link'),
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().url(),
  linkType: z.enum(['resource', 'reference', 'tool']),
})

// Schema completo do conteúdo
export const ContentSchema = z.object({
  blocks: z.array(z.discriminatedUnion('type', [
    TextBlockSchema,
    VideoBlockSchema,
    QuizBlockSchema,
    ActivityBlockSchema,
    SimulationBlockSchema,
    LinkBlockSchema,
  ])),
  metadata: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
})

// Tipos exportados
export type BaseBlock = z.infer<typeof BaseBlockSchema>
export type TextBlock = z.infer<typeof TextBlockSchema>
export type VideoBlock = z.infer<typeof VideoBlockSchema>
export type QuizBlock = z.infer<typeof QuizBlockSchema>
export type ActivityBlock = z.infer<typeof ActivityBlockSchema>
export type SimulationBlock = z.infer<typeof SimulationBlockSchema>
export type LinkBlock = z.infer<typeof LinkBlockSchema>
export type Content = z.infer<typeof ContentSchema>

// Tipos para sugestões de IA
export interface AISuggestion {
  content: string
  confidence: number
  type: 'text' | 'summary' | 'objectives' | 'activity' | 'correction'
}

// Interface para o estado do editor
export interface EditorState {
  content: Content
  selectedBlock: string | null
  isEditing: boolean
  aiSuggestions: AISuggestion[]
  isLoading: boolean
  error: string | null
} 