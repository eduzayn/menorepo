import React, { useState } from 'react';
import { 
  PageHeader, 
  Button, 
  Card, 
  Table, 
  Badge, 
  SearchInput, 
  Dropdown, 
  Pagination 
} from '@edunexia/ui-components';
import { useVagasService } from '../contexts';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { StatusVaga, Vaga } from '../types';

const VagasPage: React.FC = () => {
  const vagasService = useVagasService();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState<StatusVaga | null>(null);
  const itemsPerPage = 10;

  // Buscar vagas com filtros
  const { data, isLoading } = useQuery({
    queryKey: ['vagas', searchTerm, filtroStatus, currentPage],
    queryFn: async () => {
      return vagasService.listarVagas({
        busca: searchTerm || undefined,
        status: filtroStatus || undefined,
        pagina: currentPage,
        limite: itemsPerPage
      });
    }
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: StatusVaga | null) => {
    setFiltroStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getBadgeColorForStatus = (status: StatusVaga) => {
    switch (status) {
      case StatusVaga.ABERTA:
        return 'green';
      case StatusVaga.EM_ANDAMENTO:
        return 'blue';
      case StatusVaga.ENCERRADA:
        return 'gray';
      case StatusVaga.SUSPENSA:
        return 'orange';
      case StatusVaga.CANCELADA:
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusOptions = [
    { label: 'Abertas', value: StatusVaga.ABERTA },
    { label: 'Em Andamento', value: StatusVaga.EM_ANDAMENTO },
    { label: 'Encerradas', value: StatusVaga.ENCERRADA },
    { label: 'Suspensas', value: StatusVaga.SUSPENSA },
    { label: 'Canceladas', value: StatusVaga.CANCELADA }
  ];

  const formatStatusLabel = (status: StatusVaga) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Gestão de Vagas"
        description="Gerencie vagas de emprego, processos seletivos e candidaturas"
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/rh/vagas/nova')}
          >
            Nova Vaga
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4">
          <SearchInput
            placeholder="Buscar por título, departamento ou cargo..."
            value={searchTerm}
            onChange={handleSearch}
            className="sm:w-96"
          />

          <Dropdown
            label="Filtrar por Status"
            options={statusOptions}
            value={filtroStatus}
            onChange={handleStatusChange}
            placeholder="Todos os status"
            allowClear
          />
        </div>
      </Card>

      <Card>
        <Table
          data={data?.items || []}
          isLoading={isLoading}
          columns={[
            {
              header: 'Título',
              accessor: 'titulo',
              cell: (row: Vaga) => (
                <div>
                  <div className="font-medium">{row.titulo}</div>
                  <div className="text-xs text-gray-500">{row.departamento}</div>
                </div>
              )
            },
            {
              header: 'Cargo',
              accessor: 'cargo'
            },
            {
              header: 'Local',
              accessor: 'local_trabalho'
            },
            {
              header: 'Regime',
              accessor: 'regime_trabalho'
            },
            {
              header: 'Status',
              cell: (row: Vaga) => (
                <Badge color={getBadgeColorForStatus(row.status)}>
                  {formatStatusLabel(row.status)}
                </Badge>
              )
            },
            {
              header: 'Publicação',
              accessor: 'data_publicacao',
              cell: (row: Vaga) => (
                <span>
                  {new Date(row.data_publicacao).toLocaleDateString('pt-BR')}
                </span>
              )
            },
            {
              header: 'Candidatos',
              cell: (row: Vaga) => (
                <span className="font-medium">
                  {row.candidatos_count || 0}
                </span>
              )
            },
            {
              header: 'Ações',
              cell: (row: Vaga) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/rh/vagas/${row.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
              )
            }
          ]}
          emptyState={{
            title: 'Nenhuma vaga encontrada',
            description: 'Tente ajustar os filtros ou crie uma nova vaga.'
          }}
        />

        {data && data.total > 0 && (
          <div className="py-4 px-6 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalItems={data.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default VagasPage; 