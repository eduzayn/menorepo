import { z } from 'zod'

/**
 * Tipos de blocos suportados pelo editor de material didático
 */
export type BlockType = 'text' | 'video' | 'quiz' | 'activity' | 'simulation' | 'link' | 'image' | 'file';

/**
 * Interface básica de um bloco de conteúdo
 */
export interface Block {
  id: string;
  type: BlockType;
  title?: string;
  content: string;
  order: number;
  metadata?: Record<string, any>;
}

/**
 * Interface para metadados do conteúdo
 */
export interface ContentMetadata {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  co_authors?: string[];
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  education_level?: string;
  learning_objectives?: string[];
  estimated_duration?: number; // em minutos
  cover_image?: string;
  discipline_id?: string;
  topic?: string;
}

/**
 * Interface para conteúdo completo
 */
export interface Content {
  metadata: ContentMetadata;
  blocks: Block[];
}

/**
 * Interface para histórico de versões
 */
export interface ContentVersion {
  id: string;
  content_id: string;
  version: number;
  created_at: string;
  created_by: string;
  changes: string;
  snapshot: Content;
}

/**
 * Interface para operações de edição
 */
export interface EditOperation {
  type: 'add' | 'update' | 'delete' | 'move';
  blockId?: string;
  blockType?: BlockType;
  data?: Partial<Block>;
  oldIndex?: number;
  newIndex?: number;
}

/**
 * Tipo para eventos de edição
 */
export type EditorEventType = 
  | 'block:add'
  | 'block:update'
  | 'block:delete'
  | 'block:move'
  | 'content:save'
  | 'content:publish'
  | 'content:revert';

/**
 * Interface para eventos do editor
 */
export interface EditorEvent {
  type: EditorEventType;
  timestamp: number;
  userId: string;
  operation?: EditOperation;
  metadata?: Record<string, any>;
}

// Tipos base
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
  id: z.string(),
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
    disciplineId: z.string().optional(),
    courseId: z.string().optional(),
  }),
  version: z.object({
    number: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    author: z.string(),
    history: z.array(z.object({
      version: z.string(),
      date: z.date(),
      author: z.string(),
      changeDescription: z.string().optional(),
    })).optional(),
  }),
  permissions: z.object({
    owner: z.string(),
    coAuthors: z.array(z.object({
      id: z.string(),
      name: z.string(),
      role: z.enum(['editor', 'reviewer', 'viewer']),
      email: z.string().email().optional(),
    })).optional(),
    isPublic: z.boolean().default(false),
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
  type: 'text' | 'summary' | 'objectives' | 'activity' | 'correction' | 'block'
  blockType?: BlockType
}

// Interface para o estado do editor
export interface EditorState {
  content: Content
  selectedBlock: string | null
  isEditing: boolean
  aiSuggestions: AISuggestion[]
  isLoading: boolean
  error: string | null
  showVersionHistory: boolean
  showPermissionsDialog: boolean
}

// Tipos para exportação
export type ExportFormat = 'pdf' | 'html' | 'scorm'

export interface ExportOptions {
  format: ExportFormat
  includeInteractive: boolean
  targetAudience: 'students' | 'teachers' | 'both'
  customStyles?: Record<string, string>
}

// Permissões de usuário
export type UserRole = 'owner' | 'editor' | 'reviewer' | 'viewer'

export interface UserPermission {
  userId: string
  role: UserRole
  canEdit: boolean
  canExport: boolean
  canShare: boolean
  canDelete: boolean
} 