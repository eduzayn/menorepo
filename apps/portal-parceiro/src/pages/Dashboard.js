import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, AcademicCapIcon, UsersIcon, DocumentCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
const Dashboard = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCursos: 0,
        totalAlunos: 0,
        solicitacoesPendentes: 0,
        certificadosEmitidos: 0,
        receitaTotal: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            try {
                // Em produção, estes dados viriam da API
                // Simulando dados para demonstração
                // Simular carregamento de estatísticas
                setTimeout(() => {
                    setStats({
                        totalCursos: 12,
                        totalAlunos: 138,
                        solicitacoesPendentes: 23,
                        certificadosEmitidos: 94,
                        receitaTotal: 12540.90
                    });
                    // Simular carregamento de atividades recentes
                    setRecentActivities([
                        {
                            id: '1',
                            tipo: 'certificado',
                            descricao: 'Certificado emitido para Maria Silva',
                            data: '2023-05-15T10:30:00',
                            status: 'emitido'
                        },
                        {
                            id: '2',
                            tipo: 'solicitacao',
                            descricao: 'Nova solicitação de certificação de João Santos',
                            data: '2023-05-14T14:22:00',
                            status: 'pendente'
                        },
                        {
                            id: '3',
                            tipo: 'curso',
                            descricao: 'Curso de Administração foi atualizado',
                            data: '2023-05-12T09:15:00'
                        },
                        {
                            id: '4',
                            tipo: 'financeiro',
                            descricao: 'Pagamento de certificação recebido',
                            data: '2023-05-10T16:45:00',
                            status: 'pago'
                        },
                        {
                            id: '5',
                            tipo: 'aluno',
                            descricao: 'Novo aluno cadastrado: Pedro Almeida',
                            data: '2023-05-09T11:20:00'
                        }
                    ]);
                    setLoading(false);
                }, 1000);
                // Em produção, usaríamos a API assim:
                // const response = await api.relatorios.obterDashboard(profile?.instituicao_id);
                // setStats(response.stats);
                // setRecentActivities(response.activities);
            }
            catch (error) {
                console.error('Erro ao carregar dashboard:', error);
                setLoading(false);
            }
        };
        loadDashboard();
    }, [profile]);
    // Função para formatar data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    // Função para obter ícone por tipo de atividade
    const getActivityIcon = (tipo) => {
        switch (tipo) {
            case 'curso':
                return _jsx(AcademicCapIcon, { className: "h-5 w-5 text-primary" });
            case 'aluno':
                return _jsx(UsersIcon, { className: "h-5 w-5 text-secondary" });
            case 'certificado':
                return _jsx(DocumentCheckIcon, { className: "h-5 w-5 text-green-600" });
            case 'solicitacao':
                return _jsx(DocumentCheckIcon, { className: "h-5 w-5 text-amber-500" });
            case 'financeiro':
                return _jsx(CurrencyDollarIcon, { className: "h-5 w-5 text-blue-500" });
            default:
                return _jsx(ChartBarIcon, { className: "h-5 w-5 text-gray-500" });
        }
    };
    // Função para obter cor por status
    const getStatusColor = (status) => {
        switch (status) {
            case 'emitido':
                return 'bg-green-100 text-green-800';
            case 'pendente':
                return 'bg-amber-100 text-amber-800';
            case 'pago':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { children: [_jsxs("header", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["Bem-vindo ao Portal do Parceiro, ", profile?.nome || 'Usuário'] })] }), loading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5", children: [_jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 bg-primary-light rounded-md p-3", children: _jsx(AcademicCapIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Cursos" }), _jsx("dd", { className: "flex items-baseline", children: _jsx("div", { className: "text-2xl font-semibold text-gray-900", children: stats.totalCursos }) })] }) })] }) }), _jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/painel/cursos", className: "font-medium text-primary hover:text-primary-dark", children: "Ver todos os cursos" }) }) })] }), _jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 bg-blue-500 rounded-md p-3", children: _jsx(UsersIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Alunos" }), _jsx("dd", { className: "flex items-baseline", children: _jsx("div", { className: "text-2xl font-semibold text-gray-900", children: stats.totalAlunos }) })] }) })] }) }), _jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/painel/alunos", className: "font-medium text-primary hover:text-primary-dark", children: "Ver todos os alunos" }) }) })] }), _jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 bg-amber-500 rounded-md p-3", children: _jsx(DocumentCheckIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Solicita\u00E7\u00F5es Pendentes" }), _jsx("dd", { className: "flex items-baseline", children: _jsx("div", { className: "text-2xl font-semibold text-gray-900", children: stats.solicitacoesPendentes }) })] }) })] }) }), _jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/painel/certificacoes?status=pendente", className: "font-medium text-primary hover:text-primary-dark", children: "Ver solicita\u00E7\u00F5es" }) }) })] }), _jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 bg-green-500 rounded-md p-3", children: _jsx(DocumentCheckIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Certificados Emitidos" }), _jsx("dd", { className: "flex items-baseline", children: _jsx("div", { className: "text-2xl font-semibold text-gray-900", children: stats.certificadosEmitidos }) })] }) })] }) }), _jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/painel/certificacoes?status=emitido", className: "font-medium text-primary hover:text-primary-dark", children: "Ver certificados" }) }) })] }), _jsxs("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: [_jsx("div", { className: "px-4 py-5 sm:p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 bg-purple-500 rounded-md p-3", children: _jsx(CurrencyDollarIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Receita Total" }), _jsx("dd", { className: "flex items-baseline", children: _jsx("div", { className: "text-2xl font-semibold text-gray-900", children: new Intl.NumberFormat('pt-BR', {
                                                                        style: 'currency',
                                                                        currency: 'BRL'
                                                                    }).format(stats.receitaTotal) }) })] }) })] }) }), _jsx("div", { className: "bg-gray-50 px-4 py-4 sm:px-6", children: _jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/painel/financeiro", className: "font-medium text-primary hover:text-primary-dark", children: "Ver financeiro" }) }) })] })] }), _jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Atividades Recentes" }), _jsx("div", { className: "mt-2 bg-white shadow overflow-hidden sm:rounded-md", children: _jsx("ul", { className: "divide-y divide-gray-200", children: recentActivities.map((activity) => (_jsx("li", { children: _jsx("div", { className: "px-4 py-4 sm:px-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: getActivityIcon(activity.tipo) }), _jsxs("div", { className: "ml-4 flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-primary truncate", children: activity.descricao }), _jsx("div", { className: "ml-2 flex-shrink-0 flex", children: activity.status && (_jsx("p", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`, children: activity.status })) })] }), _jsx("div", { className: "mt-1 flex items-center text-sm text-gray-500", children: _jsx("span", { children: formatDate(activity.data) }) })] })] }) }) }, activity.id))) }) })] })] }))] }));
};
export default Dashboard;
