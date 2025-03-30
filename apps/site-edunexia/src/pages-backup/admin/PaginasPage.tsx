import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';
import { DataTable, Column } from '../../components/admin/DataTable';
import { useAllPages, useDeletePage } from '../../hooks/usePages';
import { FormSection } from '../../components/admin/FormSection';

type StatusFilter = 'all' | 'published' | 'draft' | 'archived';

const PaginasPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: pages, isLoading, error } = useAllPages();
  const deletePage = useDeletePage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Obter filtro de status da URL
  const statusFilter = (searchParams.get('status') || 'all') as StatusFilter;

  // Filtragem por status e pesquisa
  const filteredPages = useMemo(() => {
    if (!pages) return [];

    let filtered = pages;

    // Aplicar filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (page) => page.status === statusFilter
      );
    }

    // Aplicar pesquisa
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(searchLower) ||
          page.slug.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [pages, statusFilter, searchTerm]);

  // Formatador de datas
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Status formatado com cor
  const StatusBadge = ({ status }: { status: string }) => {
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

    const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    const label = labels[status as keyof typeof labels] || status;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {label}
      </span>
    );
  };

  // Colunas da tabela
  const columns: Column<SitePage>[] = [
    {
      header: 'Título',
      accessor: (page) => (
        <div>
          <div className="font-medium text-gray-900">{page.title}</div>
          <div className="text-xs text-gray-500">/{page.slug}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (page) => <StatusBadge status={page.status} />,
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
      accessor: (page) => (
        <div className="flex justify-end space-x-2">
          <Link
            to={`/pagina/${page.slug}`}
            target="_blank"
            className="text-gray-500 hover:text-blue-600"
            title="Visualizar"
          >
            <span className="material-icons text-sm">visibility</span>
          </Link>
          <Link
            to={`/admin/paginas/editar/${page.id}`}
            className="text-gray-500 hover:text-blue-600"
            title="Editar"
          >
            <span className="material-icons text-sm">edit</span>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Deseja realmente excluir a página "${page.title}"?`)) {
                deletePage.mutate(page.id);
              }
            }}
            className="text-gray-500 hover:text-red-600"
            title="Excluir"
          >
            <span className="material-icons text-sm">delete</span>
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  // Alternar filtro de status
  const handleStatusFilterChange = (status: StatusFilter) => {
    setSearchParams(status === 'all' ? {} : { status });
  };

  // Navegar para a página de edição quando clicar na linha
  const handleRowClick = (page: SitePage) => {
    navigate(`/admin/paginas/editar/${page.id}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Páginas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as páginas estáticas do site
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/admin/paginas/nova"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="material-icons text-sm mr-2">add</span>
            Nova Página
          </Link>
        </div>
      </div>

      <FormSection title="Gerenciamento de Páginas">
        <div className="mb-6 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          {/* Filtros por status */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusFilterChange('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => handleStatusFilterChange('published')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'published'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Publicadas
            </button>
            <button
              onClick={() => handleStatusFilterChange('draft')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'draft'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rascunhos
            </button>
            <button
              onClick={() => handleStatusFilterChange('archived')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'archived'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Arquivadas
            </button>
          </div>

          {/* Campo de pesquisa */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400 text-sm">search</span>
            </div>
            <input
              type="text"
              placeholder="Pesquisar por título ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="material-icons text-red-500">error</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Erro ao carregar páginas. Tente novamente mais tarde.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable<SitePage>
            columns={columns}
            data={filteredPages}
            keyExtractor={(page) => page.id}
            isLoading={isLoading}
            emptyMessage={
              searchTerm
                ? "Nenhuma página encontrada para a pesquisa."
                : "Nenhuma página encontrada."
            }
            onRowClick={handleRowClick}
          />
        )}

        {filteredPages && filteredPages.length > 0 && (
          <div className="mt-4 text-right text-gray-500 text-sm">
            Mostrando {filteredPages.length} {filteredPages.length === 1 ? 'página' : 'páginas'}
            {statusFilter !== 'all' && ` com status "${statusFilter}"`}
            {searchTerm && ` para pesquisa "${searchTerm}"`}
          </div>
        )}
      </FormSection>
    </>
  );
};

export default PaginasPage; 