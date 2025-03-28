import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Componente de carregamento padronizado
 */
export function Loader({ text, size = 'md', className = '', fullPage = false }) {
    // Mapeamento de tamanhos para classes
    const sizeClasses = {
        sm: 'loader-sm',
        md: 'loader-md',
        lg: 'loader-lg'
    };
    // Criar classe base
    const baseClass = `loader ${sizeClasses[size]} ${className}`;
    // Se for página completa, adiciona container
    if (fullPage) {
        return (_jsx("div", { className: "loader-fullpage", children: _jsxs("div", { className: baseClass, children: [_jsx("div", { className: "loader-spinner" }), text && _jsx("p", { className: "loader-text", children: text })] }) }));
    }
    // Caso contrário, apenas o loader
    return (_jsxs("div", { className: baseClass, children: [_jsx("div", { className: "loader-spinner" }), text && _jsx("p", { className: "loader-text", children: text })] }));
}
