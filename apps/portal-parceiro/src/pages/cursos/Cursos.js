import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
const niveis = ['Livre', 'Básico', 'Intermediário', 'Avançado', 'Especialização', 'Graduação', 'Pós-graduação'];
const Cursos = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [cursos, setCursos] = useState([]);
    const [filteredCursos, setFilteredCursos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [nivelFilter, setNivelFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    useEffect(() => {
        // Simulando carregamento de dados da API
        const fetchCursos = () => {
            setLoading(true);
            // Simulando dados para demonstração
            setTimeout(() => {
                const mockCursos = Array.from({ length: 12 }, (_, index) => {
                    const status = ['ativa', 'pendente', 'suspensa', 'encerrada'][Math.floor(Math.random() * 4)];
                    const nivel = niveis[Math.floor(Math.random() * niveis.length)];
                    const aprovado = status === 'ativa' || status === 'suspensa';
                    return {
                        id: `CRS${String(index + 1).padStart(5, '0')}`,
                        titulo: `Curso de ${['Administração', 'Marketing', 'Finanças', 'Gestão de Projetos', 'Liderança', 'RH', 'Logística'][Math.floor(Math.random() * 7)]} ${index + 1}`,
                        nivel,
                        cargaHoraria: [20, 40, 60, 80, 120][Math.floor(Math.random() * 5)],
                        status,
                        alunos: Math.floor(Math.random() * 50),
                        certificados: Math.floor(Math.random() * 30),
                        dataAprovacao: aprovado ? new Date(2023, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString() : undefined,
                    };
                });
                setCursos(mockCursos);
                setFilteredCursos(mockCursos);
                setLoading(false);
            }, 1000);
            // Em produção:
            // const response = await api.cursos.listar();
            // setCursos(response);
            // setFilteredCursos(response);
            // setLoading(false);
        };
        fetchCursos();
    }, []);
    useEffect(() => {
        // Aplicar filtros aos cursos
        let result = [...cursos];
        // Filtro de texto
        if (searchTerm) {
            const termLower = searchTerm.toLowerCase();
            result = result.filter(curso => curso.titulo.toLowerCase().includes(termLower) ||
                curso.id.toLowerCase().includes(termLower));
        }
        // Filtro de nível
        if (nivelFilter) {
            result = result.filter(curso => curso.nivel === nivelFilter);
        }
        // Filtro de status
        if (statusFilter) {
            result = result.filter(curso => curso.status === statusFilter);
        }
        setFilteredCursos(result);
    }, [cursos, searchTerm, nivelFilter, statusFilter]);
    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString)
            return 'Não aprovado';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    };
    // Obter cor por status
    const getStatusColor = (status) => {
        switch (status) {
            case 'ativa':
                return 'bg-green-100 text-green-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspensa':
                return 'bg-red-100 text-red-800';
            case 'encerrada':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Cursos" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Gerencie os cursos oferecidos pela sua institui\u00E7\u00E3o" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { type: "button", className: "btn-primary flex items-center", children: [_jsx(PlusIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }), "Novo Curso"] }) })] }), _jsx("div", { className: "mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6", children: _jsx("div", { className: "md:flex md:items-center md:justify-between", children: _jsxs("div", { className: "md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "search", id: "search", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm", placeholder: "Buscar cursos", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsx("div", { children: _jsxs("select", { id: "nivel", name: "nivel", className: "block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md", value: nivelFilter, onChange: (e) => setNivelFilter(e.target.value), children: [_jsx("option", { value: "", children: "Todos os n\u00EDveis" }), niveis.map(nivel => (_jsx("option", { value: nivel, children: nivel }, nivel)))] }) }), _jsx("div", { children: _jsxs("select", { id: "status", name: "status", className: "block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), children: [_jsx("option", { value: "", children: "Todos os status" }), _jsx("option", { value: "ativa", children: "Ativa" }), _jsx("option", { value: "pendente", children: "Pendente" }), _jsx("option", { value: "suspensa", children: "Suspensa" }), _jsx("option", { value: "encerrada", children: "Encerrada" })] }) })] }) }) }), _jsx("div", { className: "mt-6 bg-white shadow overflow-hidden sm:rounded-md", children: loading ? (_jsx("div", { className: "px-4 py-5 sm:p-6 flex justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : (_jsx("ul", { className: "divide-y divide-gray-200", children: filteredCursos.length === 0 ? (_jsx("li", { className: "px-4 py-5 sm:px-6", children: _jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-sm text-gray-500", children: "Nenhum curso encontrado" }) }) })) : (filteredCursos.map((curso) => (_jsx("li", { children: _jsx("div", { className: "px-4 py-4 sm:px-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-medium", children: curso.titulo.substring(0, 2).toUpperCase() }) }), _jsxs("div", { className: "ml-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h3", { className: "text-sm font-medium text-primary truncate", children: curso.titulo }), _jsx("span", { className: `ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(curso.status)}`, children: curso.status.charAt(0).toUpperCase() + curso.status.slice(1) })] }), _jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [_jsxs("div", { className: "sm:flex", children: [_jsxs("p", { className: "flex items-center text-sm text-gray-500", children: ["N\u00EDvel: ", curso.nivel] }), _jsxs("p", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6", children: ["Carga hor\u00E1ria: ", curso.cargaHoraria, "h"] }), _jsxs("p", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6", children: ["Alunos: ", curso.alunos] }), _jsxs("p", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6", children: ["Certificados: ", curso.certificados] })] }), _jsx("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: _jsxs("p", { children: ["Data de aprova\u00E7\u00E3o: ", formatDate(curso.dataAprovacao)] }) })] })] })] }), _jsxs("div", { className: "ml-5 flex-shrink-0 flex space-x-4", children: [_jsx("button", { type: "button", className: "text-primary hover:text-primary-dark", title: "Visualizar Curso", children: _jsx(EyeIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "text-primary hover:text-primary-dark", title: "Editar Curso", children: _jsx(PencilSquareIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "text-primary hover:text-primary-dark", title: "Duplicar Curso", children: _jsx(DocumentDuplicateIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: "text-red-500 hover:text-red-700", title: "Excluir Curso", children: _jsx(TrashIcon, { className: "h-5 w-5", "aria-hidden": "true" }) })] })] }) }) }, curso.id)))) })) })] }));
};
export default Cursos;
