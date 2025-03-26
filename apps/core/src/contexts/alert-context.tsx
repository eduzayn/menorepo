import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert, AlertType } from '../components/shared/alert';

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
interface AlertContextType {
  alerts: AlertItem[];
  addAlert: (alert: Omit<AlertItem, 'id'>) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

// Criar contexto com valor inicial undefined
const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * Props do provedor de alertas
 */
interface AlertProviderProps {
  /** Componentes filhos */
  children: ReactNode;
  
  /** Posição dos alertas na tela */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  /** Duração padrão dos alertas em ms (padrão: 5000ms) */
  defaultDuration?: number;
}

/**
 * Provedor de contexto de alertas
 */
export function AlertProvider({
  children,
  position = 'top-right',
  defaultDuration = 5000
}: AlertProviderProps) {
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
  }, [defaultDuration, generateId]);
  
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
    'top-right': 'alerts-top-right',
    'top-left': 'alerts-top-left',
    'bottom-right': 'alerts-bottom-right',
    'bottom-left': 'alerts-bottom-left'
  };
  
  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      
      {/* Container de alertas */}
      <div className={`alerts-container ${positionClasses[position]}`}>
        {alerts.map(alert => (
          <div key={alert.id} className="alerts-item">
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              dismissible={true}
              onDismiss={() => removeAlert(alert.id)}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de alertas
 * @returns Contexto de alertas
 * @throws Error se usado fora do AlertProvider
 */
export function useAlerts(): AlertContextType {
  const context = useContext(AlertContext);
  
  if (context === undefined) {
    throw new Error('useAlerts deve ser usado dentro de um AlertProvider');
  }
  
  return context;
} 