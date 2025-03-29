import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/admin/DataTable';
import { useAllPages, useDeletePage } from '../../hooks/usePages';
import { FormSection } from '../../components/admin/FormSection';
const PaginasPage = () => {
    const navigate = useNavigate();
    const { data: pages, isLoading, error } = useAllPages();
    const deletePage = useDeletePage();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    // Obter filtro de status da URL
    const statusFilter = (searchParams.get('status') || 'all');
    // Filtragem por status e pesquisa
    const filteredPages = useMemo(() => {
        if (!pages)
            return [];
        let filtered = pages;
        // Aplicar filtro por status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((page) => page.status === statusFilter);
        }
        // Aplicar pesquisa
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((page) => page.title.toLowerCase().includes(searchLower) ||
                page.slug.toLowerCase().includes(searchLower));
        }
        return filtered;
    }, [pages, statusFilter, searchTerm]);
    // Formatador de datas
    const formatDate = (dateString) => {
        if (!dateString)
            return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };
    // Status formatado com cor
    const StatusBadge = ({ status }) => {
        const styles = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
            archived: 'bg-gray-100 text-gray-800',
        };
        const labels = {
            published: 'Publicado',
            draft: 'Rascunho',
            archived: 'Arquivado',
        };
        const style = styles[status] || 'bg-gray-100 text-gray-800';
        const label = labels[status] || status;
        return (_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${style}`, children: label }));
    };
    // Colunas da tabela
    const columns = [
        {
            header: 'Título',
            accessor: (page) => (_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: page.title }), _jsxs("div", { className: "text-xs text-gray-500", children: ["/", page.slug] })] })),
        },
        {
            header: 'Status',
            accessor: (page) => _jsx(StatusBadge, { status: page.status }),
            className: 'text-center',
        },
        {
            header: 'Atualização',
            accessor: (page) => formatDate(page.updated_at),
            className: 'text-center',
        },
        {
            header: 'Publicação',
            accessor: (page) => formatDate(page.published_at || ''),
            className: 'text-center',
        },
        {
            header: 'Ações',
            accessor: (page) => (_jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Link, { to: `/pagina/${page.slug}`, target: "_blank", className: "text-gray-500 hover:text-blue-600", title: "Visualizar", children: _jsx("span", { className: "material-icons text-sm", children: "visibility" }) }), _jsx(Link, { to: `/admin/paginas/editar/${page.id}`, className: "text-gray-500 hover:text-blue-600", title: "Editar", children: _jsx("span", { className: "material-icons text-sm", children: "edit" }) }), _jsx("button", { onClick: (e) => {
                            e.stopPropagation();
                            if (window.confirm(`Deseja realmente excluir a página "${page.title}"?`)) {
                                deletePage.mutate(page.id);
                            }
                        }, className: "text-gray-500 hover:text-red-600", title: "Excluir", children: _jsx("span", { className: "material-icons text-sm", children: "delete" }) })] })),
            className: 'w-24',
        },
    ];
    // Alternar filtro de status
    const handleStatusFilterChange = (status) => {
        setSearchParams(status === 'all' ? {} : { status });
    };
    // Navegar para a página de edição quando clicar na linha
    const handleRowClick = (page) => {
        navigate(`/admin/paginas/editar/${page.id}`);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "P\u00E1ginas" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gerencie as p\u00E1ginas est\u00E1ticas do site" })] }), _jsx("div", { className: "mt-4 md:mt-0", children: _jsxs(Link, { to: "/admin/paginas/nova", className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx("span", { className: "material-icons text-sm mr-2", children: "add" }), "Nova P\u00E1gina"] }) })] }), _jsxs(FormSection, { title: "Gerenciamento de P\u00E1ginas", children: [_jsxs("div", { className: "mb-6 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handleStatusFilterChange('all'), className: `px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Todas" }), _jsx("button", { onClick: () => handleStatusFilterChange('published'), className: `px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'published'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Publicadas" }), _jsx("button", { onClick: () => handleStatusFilterChange('draft'), className: `px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'draft'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Rascunhos" }), _jsx("button", { onClick: () => handleStatusFilterChange('archived'), className: `px-3 py-2 text-sm font-medium rounded-md ${statusFilter === 'archived'
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Arquivadas" })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("span", { className: "material-icons text-gray-400 text-sm", children: "search" }) }), _jsx("input", { type: "text", placeholder: "Pesquisar por t\u00EDtulo ou slug...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" })] })] }), error ? (_jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("span", { className: "material-icons text-red-500", children: "error" }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: "Erro ao carregar p\u00E1ginas. Tente novamente mais tarde." }) })] }) })) : (_jsx(DataTable, { columns: columns, data: filteredPages, keyExtractor: (page) => page.id, isLoading: isLoading, emptyMessage: searchTerm
                            ? "Nenhuma página encontrada para a pesquisa."
                            : "Nenhuma página encontrada.", onRowClick: handleRowClick })), filteredPages && filteredPages.length > 0 && (_jsxs("div", { className: "mt-4 text-right text-gray-500 text-sm", children: ["Mostrando ", filteredPages.length, " ", filteredPages.length === 1 ? 'página' : 'páginas', statusFilter !== 'all' && ` com status "${statusFilter}"`, searchTerm && ` para pesquisa "${searchTerm}"`] }))] })] }));
};
export default PaginasPage;
