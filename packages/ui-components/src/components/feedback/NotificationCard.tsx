import React from 'react';
import { cn } from '../../lib/utils';
import { X, Bell, Check, Info, AlertTriangle } from 'lucide-react';

type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'default';

export interface NotificationCardProps {
  /**
   * Título da notificação
   */
  title: string;
  /**
   * Conteúdo da notificação
   */
  content?: string;
  /**
   * Tipo da notificação que determina o esquema de cores
   */
  type?: NotificationType;
  /**
   * Se deve mostrar o ícone de fechar
   */
  showClose?: boolean;
  /**
   * Data da notificação
   */
  date?: Date | string;
  /**
   * Função chamada quando o usuário clica no botão fechar
   */
  onClose?: () => void;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Classes CSS para o título
   */
  titleClassName?: string;
  /**
   * Classes CSS para o conteúdo
   */
  contentClassName?: string;
  /**
   * Se a notificação não foi lida
   */
  unread?: boolean;
}

/**
 * Componente de notificação para exibir mensagens ao usuário
 */
export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  content,
  type = 'default',
  showClose = true,
  date,
  onClose,
  className,
  titleClassName,
  contentClassName,
  unread = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Formatação condicional de data
  const formattedDate = () => {
    if (!date) return null;
    
    let dateObj: Date;
    
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Se for hoje, mostrar apenas a hora
    const today = new Date();
    if (dateObj.toDateString() === today.toDateString()) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Se for este ano, mostrar dia e mês
    if (dateObj.getFullYear() === today.getFullYear()) {
      return dateObj.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
    
    // Caso contrário, mostrar data completa
    return dateObj.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-sm',
        {
          'bg-green-50 border-green-200': type === 'success',
          'bg-blue-50 border-blue-200': type === 'info',
          'bg-amber-50 border-amber-200': type === 'warning',
          'bg-red-50 border-red-200': type === 'error',
          'bg-white border-gray-200': type === 'default',
          'border-l-4': unread,
          'border-l-green-500': unread && type === 'success',
          'border-l-blue-500': unread && type === 'info',
          'border-l-amber-500': unread && type === 'warning',
          'border-l-red-500': unread && type === 'error',
          'border-l-primary': unread && type === 'default',
        },
        className
      )}
    >
      <div className="shrink-0">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 
            className={cn(
              'text-sm font-medium',
              { 'font-semibold': unread },
              titleClassName
            )}
          >
            {title}
          </h4>
          
          {date && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formattedDate()}
            </span>
          )}
        </div>
        
        {content && (
          <p className={cn('mt-1 text-sm text-gray-600', contentClassName)}>
            {content}
          </p>
        )}
      </div>
      
      {showClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default NotificationCard; 