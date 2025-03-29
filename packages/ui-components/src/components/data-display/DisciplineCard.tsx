import React from 'react';
import { Card } from '../card/card';
import { Button } from '../button';
import { Badge } from '../badge';
import { Edit, Trash2, Clock, GripVertical } from 'lucide-react';

export interface DisciplineCardProps {
  /**
   * ID único da disciplina
   */
  id: string;
  
  /**
   * Título da disciplina
   */
  title: string;
  
  /**
   * Descrição da disciplina
   */
  description: string;
  
  /**
   * Duração da disciplina (formato texto, ex: "40 horas")
   */
  duration: string;
  
  /**
   * Status da disciplina
   */
  status: 'active' | 'inactive';
  
  /**
   * Data da última atualização
   */
  lastUpdate: Date;
  
  /**
   * Handler para o evento de edição
   */
  onEdit?: (id: string) => void;
  
  /**
   * Handler para o evento de exclusão
   */
  onDelete?: (id: string) => void;
  
  /**
   * Indica se o card está sendo arrastado (para drag and drop)
   */
  isDragging?: boolean;
  
  /**
   * Props para o manipulador de arrastar (para bibliotecas de drag and drop)
   */
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente para exibir informações de disciplinas em formato de card
 *
 * @example
 * ```tsx
 * <DisciplineCard
 *   id="123"
 *   title="Fundamentos de React"
 *   description="Introdução aos conceitos do React"
 *   duration="20 horas"
 *   status="active"
 *   lastUpdate={new Date()}
 *   onEdit={(id) => console.log('Editar', id)}
 *   onDelete={(id) => console.log('Excluir', id)}
 * />
 * ```
 */
export const DisciplineCard: React.FC<DisciplineCardProps> = ({
  id,
  title,
  description,
  duration,
  status,
  lastUpdate,
  onEdit,
  onDelete,
  isDragging = false,
  dragHandleProps,
  className = ''
}) => {
  return (
    <Card className={`p-6 ${isDragging ? 'opacity-50' : ''} ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <div {...dragHandleProps} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <h3 className="text-lg font-semibold flex-1">{title}</h3>
          <Badge variant={status === 'active' ? 'success' : 'secondary'}>
            {status === 'active' ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>

        <p className="text-gray-600">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{duration}</span>
            <span className="text-sm text-gray-400 ml-2">
              Atualizado em {lastUpdate.toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DisciplineCard; 