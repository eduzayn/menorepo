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
export declare function Alert({ type, title, message, dismissible, onDismiss, className }: AlertProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=alert.d.ts.map