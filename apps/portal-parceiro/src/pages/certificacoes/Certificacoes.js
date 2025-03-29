import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AcademicCapIcon, DocumentCheckIcon, DocumentDuplicateIcon, DocumentPlusIcon, DocumentTextIcon, MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
const Certificacoes = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [certificacoes, setCertificacoes] = useState([]);
    const [filteredCertificacoes, setFilteredCertificacoes] = useState([]);
    const [activeTab, setActiveTab] = useState('todas');
    useEffect(() => {
        const fetchCertificacoes = () => {
            setLoading(true);
            // Simulando dados para demonstração
            setTimeout(() => {
                const mockCertificacoes = Array.from({ length: 15 }, (_, index) => {
                    const status = ['pendente', 'em_analise', 'aprovado', 'emitido', 'rejeitado'][Math.floor(Math.random() * 5)];
                    const hoje = new Date();
                    const dataSolicitacao = new Date(hoje);
                    dataSolicitacao.setDate(hoje.getDate() - Math.floor(Math.random() * 60));
                    let dataEmissao;
                    if (status === 'emitido') {
                        dataEmissao = new Date(dataSolicitacao);
                        dataEmissao.setDate(dataSolicitacao.getDate() + Math.floor(Math.random() * 15) + 5);
                    }
                    const cursos = [
                        { id: 'C001', nome: 'Engenharia de Software', tipo: 'Graduação' },
                        { id: 'C002', nome: 'Ciência de Dados', tipo: 'Pós-Graduação' },
                        { id: 'C003', nome: 'Gestão de Projetos', tipo: 'MBA' },
                        { id: 'C004', nome: 'Desenvolvimento Web', tipo: 'Curso Livre' }
                    ];
                    const curso = cursos[Math.floor(Math.random() * cursos.length)];
                    const nomes = [
                        'Ana Silva', 'Carlos Oliveira', 'Juliana Santos', 'Roberto Lima',
                        'Fernanda Costa', 'Marcos Souza', 'Patricia Ferreira', 'Bruno Almeida'
                    ];
                    const nome = nomes[Math.floor(Math.random() * nomes.length)];
                    const email = nome.toLowerCase().replace(' ', '.') + '@email.com';
                    const cpf = `${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 99)}`;
                    return {
                        id: `CERT${String(index + 1).padStart(5, '0')}`,
                        aluno: {
                            id: `ALN${Math.floor(Math.random() * 10000)}`,
                            nome,
                            email,
                            cpf
                        },
                        curso,
                        data_solicitacao: dataSolicitacao.toISOString(),
                        data_emissao: dataEmissao?.toISOString(),
                        status,
                        documentos_pendentes: Math.random() > 0.7,
                        observacoes: Math.random() > 0.7 ? 'Aguardando documentação complementar' : undefined
                    };
                });
                // Ordenar por data mais recente
                mockCertificacoes.sort((a, b) => new Date(b.data_solicitacao).getTime() - new Date(a.data_solicitacao).getTime());
                setCertificacoes(mockCertificacoes);
                setFilteredCertificacoes(mockCertificacoes);
                setLoading(false);
            }, 1000);
            // Em produção:
            // const response = await api.certificacoes.listar();
            // setCertificacoes(response.certificacoes);
            // setFilteredCertificacoes(response.certificacoes);
            // setLoading(false);
        };
        fetchCertificacoes();
    }, []);
    useEffect(() => {
        // Aplicar filtros
        let result = [...certificacoes];
        // Filtro por tab
        if (activeTab === 'pendentes') {
            result = result.filter(c => c.status === 'pendente');
        }
        else if (activeTab === 'em_processo') {
            result = result.filter(c => ['em_analise', 'aprovado'].includes(c.status));
        }
        else if (activeTab === 'concluidas') {
            result = result.filter(c => ['emitido', 'rejeitado'].includes(c.status));
        }
        // Filtro por status específico
        if (statusFiltro) {
            result = result.filter(c => c.status === statusFiltro);
        }
        // Filtro por texto
        if (searchTerm) {
            const termLower = searchTerm.toLowerCase();
            result = result.filter(c => c.aluno.nome.toLowerCase().includes(termLower) ||
                c.aluno.email.toLowerCase().includes(termLower) ||
                c.aluno.cpf.includes(searchTerm) ||
                c.curso.nome.toLowerCase().includes(termLower) ||
                c.id.toLowerCase().includes(termLower));
        }
        setFilteredCertificacoes(result);
    }, [certificacoes, activeTab, statusFiltro, searchTerm]);
    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString)
            return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    };
    // Obter cor por status
    const getStatusInfo = (status) => {
        switch (status) {
            case 'pendente':
                return { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente', icon: DocumentPlusIcon };
            case 'em_analise':
                return { color: 'bg-blue-100 text-blue-800', label: 'Em Análise', icon: DocumentTextIcon };
            case 'aprovado':
                return { color: 'bg-purple-100 text-purple-800', label: 'Aprovado', icon: DocumentDuplicateIcon };
            case 'emitido':
                return { color: 'bg-green-100 text-green-800', label: 'Emitido', icon: DocumentCheckIcon };
            case 'rejeitado':
                return { color: 'bg-red-100 text-red-800', label: 'Rejeitado', icon: DocumentTextIcon };
            default:
                return { color: 'bg-gray-100 text-gray-800', label: 'Desconhecido', icon: DocumentTextIcon };
        }
    };
    const renderTabs = () => {
        const tabs = [
            { id: 'todas', label: 'Todas' },
            { id: 'pendentes', label: 'Pendentes' },
            { id: 'em_processo', label: 'Em Processo' },
            { id: 'concluidas', label: 'Concluídas' }
        ];
        return (_jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "-mb-px flex space-x-8", children: tabs.map(tab => (_jsx("button", { className: `
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `, onClick: () => setActiveTab(tab.id), children: tab.label }, tab.id))) }) }));
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Certifica\u00E7\u00F5es" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Gerencie as solicita\u00E7\u00F5es de certifica\u00E7\u00E3o dos seus alunos" })] }), _jsx("div", { className: "mt-4 sm:mt-0 flex space-x-3", children: _jsxs("button", { type: "button", className: "btn-primary flex items-center", title: "Nova solicita\u00E7\u00E3o", children: [_jsx(AcademicCapIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }), "Nova Solicita\u00E7\u00E3o"] }) })] }), _jsx("div", { className: "mt-4", children: renderTabs() }), _jsx("div", { className: "mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6", children: _jsxs("div", { className: "md:flex md:items-center md:justify-between space-y-4 md:space-y-0", children: [_jsxs("div", { className: "relative", children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700", children: "Filtrar por Status" }), _jsxs("div", { className: "mt-1 flex items-center", children: [_jsx(FunnelIcon, { className: "h-5 w-5 text-gray-400 mr-2", "aria-hidden": "true" }), _jsxs("select", { id: "status", name: "status", className: "block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md", value: statusFiltro, onChange: (e) => setStatusFiltro(e.target.value), children: [_jsx("option", { value: "", children: "Todos os status" }), _jsx("option", { value: "pendente", children: "Pendente" }), _jsx("option", { value: "em_analise", children: "Em An\u00E1lise" }), _jsx("option", { value: "aprovado", children: "Aprovado" }), _jsx("option", { value: "emitido", children: "Emitido" }), _jsx("option", { value: "rejeitado", children: "Rejeitado" })] })] })] }), _jsxs("div", { className: "relative max-w-xs w-full", children: [_jsx("label", { htmlFor: "search", className: "block text-sm font-medium text-gray-700", children: "Buscar" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "search", id: "search", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "Nome, CPF, curso ou protocolo", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] })] })] }) }), _jsx("div", { className: "mt-6 bg-white shadow overflow-hidden sm:rounded-md", children: loading ? (_jsx("div", { className: "px-4 py-5 sm:p-6 flex justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : (_jsx(_Fragment, { children: filteredCertificacoes.length === 0 ? (_jsxs("div", { className: "px-4 py-5 sm:p-6 text-center", children: [_jsx(DocumentTextIcon, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "Nenhuma certifica\u00E7\u00E3o encontrada" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "N\u00E3o foram encontradas certifica\u00E7\u00F5es com os filtros atuais." }), _jsx("div", { className: "mt-6", children: _jsxs("button", { type: "button", className: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary", onClick: () => {
                                        setSearchTerm('');
                                        setStatusFiltro('');
                                        setActiveTab('todas');
                                    }, children: [_jsx(ArrowPathIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }), "Limpar filtros"] }) })] })) : (_jsx("ul", { className: "divide-y divide-gray-200", children: filteredCertificacoes.map((certificacao) => {
                            const statusInfo = getStatusInfo(certificacao.status);
                            const StatusIcon = statusInfo.icon;
                            return (_jsx("li", { children: _jsx("div", { className: "block hover:bg-gray-50", children: _jsxs("div", { className: "px-4 py-4 sm:px-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(StatusIcon, { className: "h-6 w-6 text-gray-400 mr-3", "aria-hidden": "true" }), _jsx("p", { className: "text-sm font-medium text-primary truncate", children: certificacao.aluno.nome })] }), _jsxs("div", { className: "ml-2 flex-shrink-0 flex", children: [_jsx("p", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`, children: statusInfo.label }), certificacao.documentos_pendentes && (_jsx("p", { className: "ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800", children: "Docs Pendentes" }))] })] }), _jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [_jsxs("div", { className: "sm:flex", children: [_jsxs("p", { className: "flex items-center text-sm text-gray-500", children: [_jsx(AcademicCapIcon, { className: "flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400", "aria-hidden": "true" }), certificacao.curso.nome, " (", certificacao.curso.tipo, ")"] }), _jsxs("p", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6", children: [_jsx(DocumentTextIcon, { className: "flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400", "aria-hidden": "true" }), certificacao.id] })] }), _jsx("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: _jsxs("p", { children: ["Solicita\u00E7\u00E3o: ", formatDate(certificacao.data_solicitacao), certificacao.data_emissao && (_jsxs("span", { className: "ml-2", children: ["\u2022 Emiss\u00E3o: ", formatDate(certificacao.data_emissao)] }))] }) })] }), certificacao.observacoes && (_jsx("div", { className: "mt-2 text-sm text-gray-500 italic border-t border-gray-100 pt-2", children: certificacao.observacoes }))] }) }) }, certificacao.id));
                        }) })) })) }), _jsx("div", { className: "mt-8 bg-blue-50 border-l-4 border-blue-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-blue-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-blue-800", children: "Informa\u00E7\u00F5es sobre certifica\u00E7\u00F5es" }), _jsxs("div", { className: "mt-2 text-sm text-blue-700", children: [_jsx("p", { children: "O processo de certifica\u00E7\u00E3o segue as seguintes etapas:" }), _jsxs("ol", { className: "list-decimal pl-5 mt-1 space-y-1", children: [_jsx("li", { children: "Solicita\u00E7\u00E3o e envio de documentos" }), _jsx("li", { children: "An\u00E1lise da documenta\u00E7\u00E3o pela institui\u00E7\u00E3o certificadora" }), _jsx("li", { children: "Aprova\u00E7\u00E3o e emiss\u00E3o do certificado" }), _jsx("li", { children: "Disponibiliza\u00E7\u00E3o para download ou envio f\u00EDsico" })] })] })] })] }) })] }));
};
export default Certificacoes;
