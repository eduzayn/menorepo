import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LoadingScreen = () => {
    return (_jsx("div", { className: "fixed inset-0 bg-background flex items-center justify-center z-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-foreground", children: "Carregando..." }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Aguarde enquanto preparamos tudo para voc\u00EA" })] }) }));
};
export default LoadingScreen;
