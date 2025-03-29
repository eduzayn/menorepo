import React from 'react';
import { cn } from '../../lib/utils';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X 
} from 'lucide-react';

/**
 * Tipos de alerta disponíveis
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * Props do componente de alerta
 */
export interface AlertProps {
  /** Tipo do alerta */
  type: AlertType;
  
  /** Título do alerta (opcional) */
  title?: string;
  
  /** Mensagem do alerta */
  message: string;
  
  /** Se o alerta pode ser fechado (opcional) */
  dismissible?: boolean;
  
  /** Função chamada quando o alerta é fechado (opcional) */
  onDismiss?: () => void;
  
  /** Classes adicionais */
  className?: string;
  
  /** Ícone personalizado */
  icon?: React.ReactNode;
}

/**
 * Componente de alerta padronizado
 * 
 * @example
 * ```tsx
 * <Alert 
 *   type="success" 
 *   title="Operação realizada" 
 *   message="Seus dados foram salvos com sucesso!"
 *   onDismiss={() => setShowAlert(false)}
 * />
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  dismissible = true,
  onDismiss,
  className,
  icon
}) => {
  // Mapeamento de tipos para classes
  const typeStyles = {
    info: {
      container: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600" />
    },
    success: {
      container: 'bg-green-50 text-green-800 border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    warning: {
      container: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
    },
    error: {
      container: 'bg-red-50 text-red-800 border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />
    }
  };
  
  return (
    <div 
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        typeStyles[type].container,
        className
      )}
      role="alert"
    >
      <div className="shrink-0">
        {icon || typeStyles[type].icon}
      </div>
      
      <div className="flex-1 text-sm">
        {title && <h5 className="mb-1 font-medium">{title}</h5>}
        <p>{message}</p>
      </div>
      
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'shrink-0 rounded-lg p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2',
            type === 'info' && 'focus:ring-blue-500',
            type === 'success' && 'focus:ring-green-500',
            type === 'warning' && 'focus:ring-amber-500',
            type === 'error' && 'focus:ring-red-500'
          )}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert; 