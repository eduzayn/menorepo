import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DataTable({ columns, data, keyExtractor, isLoading = false, emptyMessage = 'Nenhum dado encontrado', onRowClick }) {
    if (isLoading) {
        return (_jsx("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-12 bg-gray-200" }), [...Array(5)].map((_, index) => (_jsx("div", { className: "h-16 bg-gray-100 border-t border-gray-200" }, index)))] }) }));
    }
    if (data.length === 0) {
        return (_jsx("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: _jsx("div", { className: "p-6 text-center text-gray-500", children: emptyMessage }) }));
    }
    return (_jsx("div", { className: "bg-white shadow rounded-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsx("tr", { children: columns.map((column, index) => (_jsx("th", { scope: "col", className: `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`, children: column.header }, index))) }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: data.map((item) => (_jsx("tr", { className: onRowClick ? 'cursor-pointer hover:bg-gray-50' : '', onClick: onRowClick ? () => onRowClick(item) : undefined, children: columns.map((column, columnIndex) => (_jsx("td", { className: `px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`, children: typeof column.accessor === 'function'
                                    ? column.accessor(item)
                                    : item[column.accessor] }, columnIndex))) }, keyExtractor(item)))) })] }) }) }));
}
