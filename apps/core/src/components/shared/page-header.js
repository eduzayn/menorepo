import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Componente de cabeçalho padronizado para páginas
 */
export function PageHeader({ title, subtitle, backUrl, actions, className = '' }) {
    return (_jsxs("div", { className: `page-header ${className}`, children: [_jsxs("div", { className: "page-header-content", children: [backUrl && (_jsx("a", { href: backUrl, className: "page-header-back", children: "\u2190 Voltar" })), _jsxs("div", { className: "page-header-titles", children: [_jsx("h1", { className: "page-header-title", children: title }), subtitle && _jsx("p", { className: "page-header-subtitle", children: subtitle })] })] }), actions && _jsx("div", { className: "page-header-actions", children: actions })] }));
}
