import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert, AlertType } from '../components/feedback/Alert';
import { cn } from '../lib/utils';

/**
 * Interface para um objeto de alerta
 */
export interface AlertItem {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Interface do contexto de alerta
 */
export interface AlertContextType {
  /** Lista de alertas ativos */
  alerts: AlertItem[];
  
  /** Adiciona um novo alerta */
  addAlert: (alert: Omit<AlertItem, 'id'>) => string;
  
  /** Remove um alerta pelo ID */
  removeAlert: (id: string) => void;
  
  /** Remove todos os alertas */
  clearAlerts: () => void;
}

// Criar contexto com valor inicial undefined
const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * Props do provedor de alertas
 */
export interface AlertProviderProps {
  /** Componentes filhos */
  children: ReactNode;
  
  /** Posição dos alertas na tela */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  /** Duração padrão dos alertas em ms (padrão: 5000ms) */
  defaultDuration?: number;
  
  /** Tipo padrão de alerta (padrão: info) */
  defaultType?: AlertType;
  
  /** Espaçamento entre alertas */
  gap?: number;
  
  /** Largura máxima dos alertas */
  maxWidth?: number;
}

/**
 * Provedor de contexto de alertas para a Edunéxia
 * 
 * @example
 * ```tsx
 * <AlertProvider>
 *   <App />
 * </AlertProvider>
 * ```
 */
export const AlertProvider: React.FC<AlertProviderProps> = ({
  children,
  position = 'top-right',
  defaultDuration = 5000,
  defaultType = 'info',
  gap = 4,
  maxWidth = 400
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  
  // Gera ID único para alertas
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 11);
  }, []);
  
  // Adiciona um novo alerta
  const addAlert = useCallback((alert: Omit<AlertItem, 'id'>) => {
    const id = generateId();
    const newAlert: AlertItem = {
      id,
      autoClose: true,
      duration: defaultDuration,
      type: defaultType,
      ...alert
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Se autoClose estiver habilitado, configura timer para fechar
    if (newAlert.autoClose) {
      setTimeout(() => {
        removeAlert(id);
      }, newAlert.duration);
    }
    
    return id;
  }, [defaultDuration, defaultType, generateId]);
  
  // Remove um alerta pelo ID
  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);
  
  // Remove todos os alertas
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);
  
  // Contexto a ser compartilhado
  const contextValue: AlertContextType = {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts
  };
  
  // Classes de posição para o container
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 flex flex-col items-end',
    'top-left': 'fixed top-4 left-4 flex flex-col items-start',
    'bottom-right': 'fixed bottom-4 right-4 flex flex-col items-end',
    'bottom-left': 'fixed bottom-4 left-4 flex flex-col items-start'
  };
  
  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      
      {/* Container de alertas */}
      <div 
        className={cn(
          'z-50 transition-all',
          positionClasses[position]
        )}
        style={{ 
          maxWidth: `${maxWidth}px`,
          gap: `${gap * 4}px` 
        }}
        aria-live="assertive"
      >
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className="w-full transform transition-all duration-300 ease-in-out"
            style={{ 
              opacity: 1,
              animation: 'fade-in 0.3s ease-in-out'
            }}
          >
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              dismissible={true}
              onDismiss={() => removeAlert(alert.id)}
              className="shadow-lg"
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de alertas
 * 
 * @example
 * ```tsx
 * const { addAlert } = useAlerts();
 * 
 * // Para usar
 * addAlert({
 *   type: 'success',
 *   title: 'Operação concluída',
 *   message: 'Dados salvos com sucesso!'
 * });
 * ```
 * 
 * @returns Contexto de alertas
 * @throws Error se usado fora do AlertProvider
 */
export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  
  if (context === undefined) {
    throw new Error('useAlerts deve ser usado dentro de um AlertProvider');
  }
  
  return context;
};

export default AlertProvider; 