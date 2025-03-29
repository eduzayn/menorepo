import React from 'react';
import { Card } from '../card/card';
import { Badge } from '../badge';
import { Button } from '../button';
import { BookOpen, Users, Clock, Edit, Trash2 } from 'lucide-react';

export interface CourseCardProps {
  /**
   * ID único do curso
   */
  id: string;
  
  /**
   * Título do curso
   */
  title: string;
  
  /**
   * Descrição do curso
   */
  description: string;
  
  /**
   * Status do curso (determina a cor do badge)
   */
  status: 'draft' | 'review' | 'published';
  
  /**
   * Número total de disciplinas no curso
   */
  totalDisciplines?: number;
  
  /**
   * Número total de autores do curso
   */
  totalAuthors?: number;
  
  /**
   * Data da última atualização
   */
  lastUpdate?: Date;
  
  /**
   * Handler para o evento de edição
   */
  onEdit?: (id: string) => void;
  
  /**
   * Handler para o evento de exclusão
   */
  onDelete?: (id: string) => void;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

const statusColors: Record<CourseCardProps['status'], string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  review: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800'
};

const statusLabels: Record<CourseCardProps['status'], string> = {
  draft: 'Rascunho',
  review: 'Em Revisão',
  published: 'Publicado'
};

/**
 * Componente para exibir informações de cursos em formato de card
 *
 * @example
 * ```tsx
 * <CourseCard
 *   id="123"
 *   title="Desenvolvimento Web Fullstack"
 *   description="Curso completo de desenvolvimento web com React e Node.js"
 *   status="published"
 *   totalDisciplines={12}
 *   totalAuthors={3}
 *   lastUpdate={new Date()}
 *   onEdit={(id) => console.log('Editar', id)}
 *   onDelete={(id) => console.log('Excluir', id)}
 * />
 * ```
 */
export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  status,
  totalDisciplines,
  totalAuthors,
  lastUpdate,
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Badge className={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {totalDisciplines !== undefined && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{totalDisciplines} disciplinas</span>
              </div>
            )}
            {totalAuthors !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{totalAuthors} autores</span>
              </div>
            )}
            {lastUpdate && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  Atualizado {lastUpdate.toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(id)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard; 