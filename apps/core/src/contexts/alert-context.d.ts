import { ReactNode } from 'react';
import { AlertType } from '../components/shared/alert';
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
export declare function AlertProvider({ children, position, defaultDuration }: AlertProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook para acessar o contexto de alertas
 * @returns Contexto de alertas
 * @throws Error se usado fora do AlertProvider
 */
export declare function useAlerts(): AlertContextType;
export {};
//# sourceMappingURL=alert-context.d.ts.map