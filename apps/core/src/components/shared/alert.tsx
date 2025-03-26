import React from 'react';

/**
 * Tipos de alerta disponíveis
 */
export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * Props do componente de alerta
 */
interface AlertProps {
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
}

/**
 * Componente de alerta padronizado
 */
export function Alert({
  type,
  title,
  message,
  dismissible = true,
  onDismiss,
  className = ''
}: AlertProps) {
  // Mapeamento de tipos para classes
  const typeClasses = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  };
  
  // Mapeamento de tipos para ícones
  const typeIcons = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-triangle',
    error: 'exclamation-circle'
  };
  
  // Criar classe base
  const baseClass = `alert ${typeClasses[type]} ${className}`;
  
  return (
    <div className={baseClass} role="alert">
      <div className="alert-content">
        <div className="alert-icon">
          <i className={`icon-${typeIcons[type]}`} aria-hidden="true" />
        </div>
        
        <div className="alert-message">
          {title && <h4 className="alert-title">{title}</h4>}
          <p className="alert-text">{message}</p>
        </div>
      </div>
      
      {dismissible && onDismiss && (
        <button
          type="button"
          className="alert-close"
          aria-label="Fechar"
          onClick={onDismiss}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
} 