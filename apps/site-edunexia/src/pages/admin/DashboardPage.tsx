import React from 'react';
import { Link } from 'react-router-dom';
import { useAllPages } from '../../hooks/usePages';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  to?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  to,
}) => {
  const trendIcon = {
    up: (
      <span className="text-green-500 flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
        {trendValue}
      </span>
    ),
    down: (
      <span className="text-red-500 flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        {trendValue}
      </span>
    ),
    neutral: <span className="text-gray-500">{trendValue}</span>,
  };

  const CardContent = () => (
    <div className="p-6 bg-white rounded-lg shadow-md h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-blue-500">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className="text-3xl font-semibold text-gray-800">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-600">{description}</p>
          {trend && trendIcon[trend]}
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

const DashboardPage: React.FC = () => {
  const { data: pages, isLoading: pagesLoading } = useAllPages();

  // Estatísticas baseadas nos dados
  const stats = {
    totalPages: pages?.length || 0,
    publishedPages: pages?.filter(page => page.status === 'published').length || 0,
    draftPages: pages?.filter(page => page.status === 'draft').length || 0,
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Painel de Controle</h1>
        <p className="text-gray-600">
          Bem-vindo ao painel administrativo do site Edunéxia. Gerencie o conteúdo do site e monitore estatísticas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Páginas"
          value={pagesLoading ? '...' : stats.totalPages}
          description="Páginas no site"
          icon={<span className="material-icons">article</span>}
          to="/admin/paginas"
        />
        <StatCard
          title="Páginas Publicadas"
          value={pagesLoading ? '...' : stats.publishedPages}
          description="Páginas visíveis ao público"
          icon={<span className="material-icons">visibility</span>}
          to="/admin/paginas?status=published"
        />
        <StatCard
          title="Rascunhos"
          value={pagesLoading ? '...' : stats.draftPages}
          description="Páginas não publicadas"
          icon={<span className="material-icons">edit_note</span>}
          to="/admin/paginas?status=draft"
        />
        <StatCard
          title="Visitantes"
          value="--"
          description="Não disponível sem analytics"
          icon={<span className="material-icons">people</span>}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
            <Link
              to="/admin/atividade"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <div className="text-sm text-gray-600">Hoje, 10:30</div>
              <div className="font-medium">Página "Sistema de Matrículas" editada</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-1">
              <div className="text-sm text-gray-600">Ontem, 15:45</div>
              <div className="font-medium">
                Novo post do blog "Inteligência Artificial na Educação" publicado
              </div>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-1">
              <div className="text-sm text-gray-600">2 dias atrás</div>
              <div className="font-medium">
                Configurações do site atualizadas
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/paginas/nova"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
            >
              <div className="flex flex-col items-center text-center">
                <span className="material-icons text-blue-600 text-xl mb-2">
                  add_circle
                </span>
                <span className="text-gray-800 font-medium">Nova Página</span>
              </div>
            </Link>
            <Link
              to="/admin/blog/novo"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
            >
              <div className="flex flex-col items-center text-center">
                <span className="material-icons text-blue-600 text-xl mb-2">
                  post_add
                </span>
                <span className="text-gray-800 font-medium">Novo Post</span>
              </div>
            </Link>
            <Link
              to="/admin/leads"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
            >
              <div className="flex flex-col items-center text-center">
                <span className="material-icons text-blue-600 text-xl mb-2">
                  contacts
                </span>
                <span className="text-gray-800 font-medium">Ver Leads</span>
              </div>
            </Link>
            <Link
              to="/admin/configuracoes"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition"
            >
              <div className="flex flex-col items-center text-center">
                <span className="material-icons text-blue-600 text-xl mb-2">
                  settings
                </span>
                <span className="text-gray-800 font-medium">Configurações</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 