import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Componente de alerta padronizado
 */
export function Alert({ type, title, message, dismissible = true, onDismiss, className = '' }) {
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
    return (_jsxs("div", { className: baseClass, role: "alert", children: [_jsxs("div", { className: "alert-content", children: [_jsx("div", { className: "alert-icon", children: _jsx("i", { className: `icon-${typeIcons[type]}`, "aria-hidden": "true" }) }), _jsxs("div", { className: "alert-message", children: [title && _jsx("h4", { className: "alert-title", children: title }), _jsx("p", { className: "alert-text", children: message })] })] }), dismissible && onDismiss && (_jsx("button", { type: "button", className: "alert-close", "aria-label": "Fechar", onClick: onDismiss, children: _jsx("span", { "aria-hidden": "true", children: "\u00D7" }) }))] }));
}
