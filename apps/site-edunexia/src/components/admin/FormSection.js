import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const FormSection = ({ title, description, children, className = '', }) => {
    return (_jsxs("div", { className: `bg-white shadow rounded-lg overflow-hidden mb-6 ${className}`, children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: title }), description && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: description }))] }), _jsx("div", { className: "p-6", children: children })] }));
};
export const FormRow = ({ label, htmlFor, required = false, error, children, className = '', helpText, }) => {
    return (_jsxs("div", { className: `mb-4 ${className}`, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("label", { htmlFor: htmlFor, className: "block text-sm font-medium text-gray-700 mb-1", children: [label, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }) }), children, helpText && (_jsx("p", { className: "mt-1 text-xs text-gray-500", children: helpText })), error && (_jsx("p", { className: "mt-1 text-xs text-red-500", children: error }))] }));
};
export const ActionButton = ({ type = 'button', onClick, variant = 'primary', size = 'md', disabled = false, className = '', children, icon, }) => {
    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    };
    const sizeStyles = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };
    return (_jsxs("button", { type: type, onClick: onClick, disabled: disabled, className: `
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        font-medium rounded-md 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
export const ActionBar = ({ children, className = '', alignment = 'right', }) => {
    const alignmentStyles = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
    };
    return (_jsx("div", { className: `flex items-center ${alignmentStyles[alignment]} space-x-4 mt-6 ${className}`, children: children }));
};
