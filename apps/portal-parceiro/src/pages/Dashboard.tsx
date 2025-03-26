import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  AcademicCapIcon, 
  UsersIcon, 
  DocumentCheckIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

type DashboardStats = {
  totalCursos: number;
  totalAlunos: number;
  solicitacoesPendentes: number;
  certificadosEmitidos: number;
  receitaTotal: number;
};

type RecentActivity = {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
  status?: string;
};

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCursos: 0,
    totalAlunos: 0,
    solicitacoesPendentes: 0,
    certificadosEmitidos: 0,
    receitaTotal: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

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
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [profile]);

  // Função para formatar data
  const formatDate = (dateString: string) => {
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
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'curso':
        return <AcademicCapIcon className="h-5 w-5 text-primary" />;
      case 'aluno':
        return <UsersIcon className="h-5 w-5 text-secondary" />;
      case 'certificado':
        return <DocumentCheckIcon className="h-5 w-5 text-green-600" />;
      case 'solicitacao':
        return <DocumentCheckIcon className="h-5 w-5 text-amber-500" />;
      case 'financeiro':
        return <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Função para obter cor por status
  const getStatusColor = (status?: string) => {
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

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo ao Portal do Parceiro, {profile?.nome || 'Usuário'}
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-light rounded-md p-3">
                    <AcademicCapIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Cursos</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.totalCursos}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/painel/cursos" className="font-medium text-primary hover:text-primary-dark">
                    Ver todos os cursos
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Alunos</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.totalAlunos}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/painel/alunos" className="font-medium text-primary hover:text-primary-dark">
                    Ver todos os alunos
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                    <DocumentCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Solicitações Pendentes</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.solicitacoesPendentes}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/painel/certificacoes?status=pendente" className="font-medium text-primary hover:text-primary-dark">
                    Ver solicitações
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <DocumentCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Certificados Emitidos</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.certificadosEmitidos}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/painel/certificacoes?status=emitido" className="font-medium text-primary hover:text-primary-dark">
                    Ver certificados
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Receita Total</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(stats.receitaTotal)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/painel/financeiro" className="font-medium text-primary hover:text-primary-dark">
                    Ver financeiro
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Atividades recentes */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Atividades Recentes</h2>
            <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.tipo)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-primary truncate">
                              {activity.descricao}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              {activity.status && (
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                                  {activity.status}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>{formatDate(activity.data)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 