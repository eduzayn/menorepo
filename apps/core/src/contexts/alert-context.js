import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from '../components/shared/alert';
// Criar contexto com valor inicial undefined
const AlertContext = createContext(undefined);
/**
 * Provedor de contexto de alertas
 */
export function AlertProvider({ children, position = 'top-right', defaultDuration = 5000 }) {
    const [alerts, setAlerts] = useState([]);
    // Gera ID único para alertas
    const generateId = useCallback(() => {
        return Math.random().toString(36).substring(2, 11);
    }, []);
    // Adiciona um novo alerta
    const addAlert = useCallback((alert) => {
        const id = generateId();
        const newAlert = Object.assign({ id, autoClose: true, duration: defaultDuration }, alert);
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
    const removeAlert = useCallback((id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);
    // Remove todos os alertas
    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);
    // Contexto a ser compartilhado
    const contextValue = {
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
    return (_jsxs(AlertContext.Provider, { value: contextValue, children: [children, _jsx("div", { className: `alerts-container ${positionClasses[position]}`, children: alerts.map(alert => (_jsx("div", { className: "alerts-item", children: _jsx(Alert, { type: alert.type, title: alert.title, message: alert.message, dismissible: true, onDismiss: () => removeAlert(alert.id) }) }, alert.id))) })] }));
}
/**
 * Hook para acessar o contexto de alertas
 * @returns Contexto de alertas
 * @throws Error se usado fora do AlertProvider
 */
export function useAlerts() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlerts deve ser usado dentro de um AlertProvider');
    }
    return context;
}
