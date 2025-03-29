import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { CurrencyDollarIcon, DocumentIcon, ReceiptRefundIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
const Financeiro = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('mes');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [transacoes, setTransacoes] = useState([]);
    const [filteredTransacoes, setFilteredTransacoes] = useState([]);
    const [resumo, setResumo] = useState({
        totalEntradas: 0,
        totalSaidas: 0,
        totalPendente: 0,
        saldo: 0
    });
    useEffect(() => {
        const fetchFinanceiro = () => {
            setLoading(true);
            // Simulando dados para demonstração
            setTimeout(() => {
                const mockTransacoes = Array.from({ length: 20 }, (_, index) => {
                    const tipo = Math.random() > 0.3 ? 'entrada' : 'saida';
                    const status = ['pago', 'pendente', 'atrasado', 'cancelado'][Math.floor(Math.random() * 4)];
                    const hoje = new Date();
                    const dataTransacao = new Date(hoje);
                    dataTransacao.setDate(hoje.getDate() - Math.floor(Math.random() * 60));
                    let vencimento;
                    if (status === 'pendente' || status === 'atrasado') {
                        vencimento = new Date(dataTransacao);
                        vencimento.setDate(dataTransacao.getDate() + 15);
                    }
                    const descricoes = [
                        'Certificação de alunos',
                        'Validação de curso',
                        'Renovação de contrato',
                        'Taxa administrativa',
                        'Emissão de certificados em lote',
                        'Solicitação de histórico'
                    ];
                    return {
                        id: `TRX${String(index + 1).padStart(5, '0')}`,
                        tipo,
                        descricao: descricoes[Math.floor(Math.random() * descricoes.length)],
                        valor: parseFloat((Math.random() * 2000 + 100).toFixed(2)),
                        data: dataTransacao.toISOString(),
                        vencimento: vencimento?.toISOString(),
                        status,
                        referencia: `REF${Math.floor(Math.random() * 9999)}`
                    };
                });
                // Ordenar por data mais recente
                mockTransacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
                setTransacoes(mockTransacoes);
                setFilteredTransacoes(mockTransacoes);
                // Calcular resumo
                const entradas = mockTransacoes
                    .filter(t => t.tipo === 'entrada' && t.status === 'pago')
                    .reduce((sum, t) => sum + t.valor, 0);
                const saidas = mockTransacoes
                    .filter(t => t.tipo === 'saida' && t.status === 'pago')
                    .reduce((sum, t) => sum + t.valor, 0);
                const pendente = mockTransacoes
                    .filter(t => t.tipo === 'entrada' && (t.status === 'pendente' || t.status === 'atrasado'))
                    .reduce((sum, t) => sum + t.valor, 0);
                setResumo({
                    totalEntradas: entradas,
                    totalSaidas: saidas,
                    totalPendente: pendente,
                    saldo: entradas - saidas
                });
                setLoading(false);
            }, 1000);
            // Em produção:
            // const response = await api.financeiro.listar();
            // setTransacoes(response.transacoes);
            // setResumo(response.resumo);
            // setLoading(false);
        };
        fetchFinanceiro();
    }, []);
    useEffect(() => {
        // Aplicar filtros
        let result = [...transacoes];
        // Filtro por período
        if (periodo !== 'todos') {
            const hoje = new Date();
            const limitDate = new Date();
            switch (periodo) {
                case 'mes':
                    limitDate.setMonth(hoje.getMonth() - 1);
                    break;
                case 'trimestre':
                    limitDate.setMonth(hoje.getMonth() - 3);
                    break;
                case 'semestre':
                    limitDate.setMonth(hoje.getMonth() - 6);
                    break;
                case 'ano':
                    limitDate.setFullYear(hoje.getFullYear() - 1);
                    break;
            }
            result = result.filter(t => new Date(t.data) >= limitDate);
        }
        // Filtro por status
        if (statusFiltro) {
            result = result.filter(t => t.status === statusFiltro);
        }
        // Filtro por texto
        if (searchTerm) {
            const termLower = searchTerm.toLowerCase();
            result = result.filter(t => t.descricao.toLowerCase().includes(termLower) ||
                t.referencia?.toLowerCase().includes(termLower) ||
                t.id.toLowerCase().includes(termLower));
        }
        setFilteredTransacoes(result);
    }, [transacoes, periodo, statusFiltro, searchTerm]);
    // Formatar data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    };
    // Formatar valor
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };
    // Obter cor por status
    const getStatusColor = (status) => {
        switch (status) {
            case 'pago':
                return 'bg-green-100 text-green-800';
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'atrasado':
                return 'bg-red-100 text-red-800';
            case 'cancelado':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "sm:flex sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Financeiro" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Gerenciamento financeiro da sua institui\u00E7\u00E3o" })] }), _jsx("div", { className: "mt-4 sm:mt-0 flex space-x-3", children: _jsxs("button", { type: "button", className: "btn-outline flex items-center", title: "Exportar relat\u00F3rio", children: [_jsx(ArrowDownTrayIcon, { className: "-ml-1 mr-2 h-5 w-5", "aria-hidden": "true" }), "Exportar"] }) })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(CurrencyDollarIcon, { className: "h-6 w-6 text-green-600", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Recebido" }), _jsx("dd", { children: _jsx("div", { className: "text-lg font-medium text-gray-900", children: formatCurrency(resumo.totalEntradas) }) })] }) })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(ReceiptRefundIcon, { className: "h-6 w-6 text-red-600", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Pago" }), _jsx("dd", { children: _jsx("div", { className: "text-lg font-medium text-gray-900", children: formatCurrency(resumo.totalSaidas) }) })] }) })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DocumentIcon, { className: "h-6 w-6 text-yellow-600", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Valores Pendentes" }), _jsx("dd", { children: _jsx("div", { className: "text-lg font-medium text-gray-900", children: formatCurrency(resumo.totalPendente) }) })] }) })] }) }) }), _jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(CurrencyDollarIcon, { className: "h-6 w-6 text-blue-600", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Saldo" }), _jsx("dd", { children: _jsx("div", { className: "text-lg font-medium text-gray-900", children: formatCurrency(resumo.saldo) }) })] }) })] }) }) })] }), _jsx("div", { className: "mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6", children: _jsxs("div", { className: "md:flex md:items-center md:justify-between space-y-4 md:space-y-0", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "periodo", className: "block text-sm font-medium text-gray-700", children: "Per\u00EDodo" }), _jsxs("select", { id: "periodo", name: "periodo", className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md", value: periodo, onChange: (e) => setPeriodo(e.target.value), children: [_jsx("option", { value: "mes", children: "\u00DAltimo m\u00EAs" }), _jsx("option", { value: "trimestre", children: "\u00DAltimo trimestre" }), _jsx("option", { value: "semestre", children: "\u00DAltimo semestre" }), _jsx("option", { value: "ano", children: "\u00DAltimo ano" }), _jsx("option", { value: "todos", children: "Todo o per\u00EDodo" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700", children: "Status" }), _jsxs("select", { id: "status", name: "status", className: "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md", value: statusFiltro, onChange: (e) => setStatusFiltro(e.target.value), children: [_jsx("option", { value: "", children: "Todos os status" }), _jsx("option", { value: "pago", children: "Pago" }), _jsx("option", { value: "pendente", children: "Pendente" }), _jsx("option", { value: "atrasado", children: "Atrasado" }), _jsx("option", { value: "cancelado", children: "Cancelado" })] })] })] }), _jsxs("div", { className: "relative max-w-xs w-full", children: [_jsx("label", { htmlFor: "search", className: "block text-sm font-medium text-gray-700", children: "Buscar" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "search", id: "search", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "Buscar transa\u00E7\u00F5es", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] })] })] }) }), _jsx("div", { className: "mt-6 bg-white shadow overflow-hidden sm:rounded-md", children: loading ? (_jsx("div", { className: "px-4 py-5 sm:p-6 flex justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Data" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Descri\u00E7\u00E3o" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Refer\u00EAncia" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Valor" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredTransacoes.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-4 text-center text-sm text-gray-500", children: "Nenhuma transa\u00E7\u00E3o encontrada" }) })) : (filteredTransacoes.map((transacao) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [_jsx("div", { children: formatDate(transacao.data) }), transacao.vencimento && (_jsxs("div", { className: "text-xs", children: ["Venc.: ", formatDate(transacao.vencimento)] }))] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: transacao.descricao }), _jsx("div", { className: "text-xs text-gray-500", children: transacao.id })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: transacao.referencia || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transacao.status)}`, children: transacao.status.charAt(0).toUpperCase() + transacao.status.slice(1) }) }), _jsxs("td", { className: `px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`, children: [transacao.tipo === 'entrada' ? '+' : '-', " ", formatCurrency(transacao.valor)] })] }, transacao.id)))) })] }) })) }), _jsx("div", { className: "mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-yellow-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: "M\u00F3dulo em desenvolvimento" }), _jsxs("div", { className: "mt-2 text-sm text-yellow-700", children: [_jsx("p", { children: "Estamos trabalhando para adicionar funcionalidades como:" }), _jsxs("ul", { className: "list-disc pl-5 mt-1 space-y-1", children: [_jsx("li", { children: "Gera\u00E7\u00E3o de boletos para pagamento" }), _jsx("li", { children: "Fatura detalhada por servi\u00E7o" }), _jsx("li", { children: "Gr\u00E1ficos de desempenho financeiro" }), _jsx("li", { children: "Integra\u00E7\u00E3o com sistemas de pagamento" })] })] })] })] }) })] }));
};
export default Financeiro;
