import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, ArrowUpTrayIcon, EyeIcon, PencilSquareIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
const Alunos = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [alunos, setAlunos] = useState([]);
    const [filteredAlunos, setFilteredAlunos] = useState([]);
    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const alunosPorPagina = 10;
    useEffect(() => {
        // Simulando carregamento de dados da API
        const fetchAlunos = () => {
            setLoading(true);
            // Simulando dados para demonstração
            setTimeout(() => {
                const mockAlunos = Array.from({ length: 35 }, (_, index) => ({
                    id: `ALN${String(index + 1).padStart(5, '0')}`,
                    nome: `Aluno ${index + 1}`,
                    email: `aluno${index + 1}@exemplo.com`,
                    cpf: `${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 99)}`,
                    dataNascimento: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
                    dataCadastro: new Date(2023, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString(),
                    cursos: Math.floor(Math.random() * 5) + 1,
                    certificados: Math.floor(Math.random() * 4),
                }));
                setAlunos(mockAlunos);
                setFilteredAlunos(mockAlunos);
                setTotalPages(Math.ceil(mockAlunos.length / alunosPorPagina));
                setLoading(false);
            }, 1000);
            // Em produção:
            // const response = await api.alunos.listar();
            // setAlunos(response);
            // setFilteredAlunos(response);
            // setTotalPages(Math.ceil(response.length / alunosPorPagina));
            // setLoading(false);
        };
        fetchAlunos();
    }, []);
    useEffect(() => {
        if (searchTerm) {
            const termLower = searchTerm.toLowerCase();
            const filtered = alunos.filter(aluno => aluno.nome.toLowerCase().includes(termLower) ||
                aluno.email.toLowerCase().includes(termLower) ||
                aluno.cpf.includes(searchTerm));
            setFilteredAlunos(filtered);
            setTotalPages(Math.ceil(filtered.length / alunosPorPagina));
            setCurrentPage(1);
        }
        else {
            setFilteredAlunos(alunos);
            setTotalPages(Math.ceil(alunos.length / alunosPorPagina));
        }
    }, [searchTerm, alunos]);
    // Formatar data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    };
    // Obter alunos da página atual
    const getCurrentAlunos = () => {
        const inicio = (currentPage - 1) * alunosPorPagina;
        const fim = inicio + alunosPorPagina;
        return filteredAlunos.slice(inicio, fim);
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Alunos" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Gerencie os alunos vinculados \u00E0 sua institui\u00E7\u00E3o" })] }), _jsxs("div", { className: "mt-4 sm:mt-0 sm:flex space-x-2", children: [_jsxs("button", { type: "button", className: "btn-outline flex items-center", children: [_jsx(ArrowUpTrayIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }), "Importar Alunos"] }), _jsxs("button", { type: "button", className: "btn-primary flex items-center", children: [_jsx(PlusIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }), "Adicionar Aluno"] })] })] }), _jsx("div", { className: "mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6", children: _jsx("div", { className: "md:flex md:items-center", children: _jsxs("div", { className: "relative flex-grow mt-2 md:mt-0", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "search", id: "search", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm", placeholder: "Buscar por nome, email ou CPF", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }) }) }), _jsx("div", { className: "mt-6 bg-white shadow overflow-hidden sm:rounded-md", children: loading ? (_jsx("div", { className: "px-4 py-5 sm:p-6 flex justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Aluno" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "CPF" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Data de Nascimento" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Data de Cadastro" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cursos" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Certificados" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: getCurrentAlunos().map((aluno) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "flex items-center", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: aluno.nome }), _jsx("div", { className: "text-sm text-gray-500", children: aluno.email })] }) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: aluno.cpf }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: formatDate(aluno.dataNascimento) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: formatDate(aluno.dataCadastro) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: aluno.cursos }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: aluno.certificados }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { type: "button", className: "text-primary hover:text-primary-dark", title: "Visualizar Aluno", children: _jsx(EyeIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "text-primary hover:text-primary-dark", title: "Editar Aluno", children: _jsx(PencilSquareIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "text-primary hover:text-primary-dark", title: "Emitir Certificado", children: _jsx(DocumentCheckIcon, { className: "h-5 w-5", "aria-hidden": "true" }) })] }) })] }, aluno.id))) })] }) }), totalPages > 1 && (_jsx("div", { className: "bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6", children: _jsxs("div", { className: "hidden sm:flex-1 sm:flex sm:items-center sm:justify-between", children: [_jsx("div", { children: _jsxs("p", { className: "text-sm text-gray-700", children: ["Mostrando ", _jsx("span", { className: "font-medium", children: Math.min((currentPage - 1) * alunosPorPagina + 1, filteredAlunos.length) }), " a ", _jsx("span", { className: "font-medium", children: Math.min(currentPage * alunosPorPagina, filteredAlunos.length) }), " de ", _jsx("span", { className: "font-medium", children: filteredAlunos.length }), " alunos"] }) }), _jsx("div", { children: _jsxs("nav", { className: "relative z-0 inline-flex rounded-md shadow-sm -space-x-px", "aria-label": "Pagination", children: [_jsxs("button", { onClick: () => setCurrentPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, className: "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50", children: [_jsx("span", { className: "sr-only", children: "Anterior" }), _jsx("svg", { className: "h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", clipRule: "evenodd" }) })] }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'bg-primary-light text-white' : 'text-gray-700 hover:bg-gray-50'}`, children: page }, page))), _jsxs("button", { onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, className: "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50", children: [_jsx("span", { className: "sr-only", children: "Pr\u00F3xima" }), _jsx("svg", { className: "h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) })] })] }) })] }) }))] })) })] }));
};
export default Alunos;
