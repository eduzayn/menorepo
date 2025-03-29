import React, { useState } from 'react';
import { 
  PageHeader, 
  Button, 
  Card, 
  Table, 
  Badge, 
  SearchInput, 
  Dropdown, 
  Pagination,
  Avatar,
  Select,
  DateRangePicker
} from '@edunexia/ui-components';
import { useAvaliacoesService, useColaboradoresService } from '../contexts';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Avaliacao, Colaborador, StatusAvaliacao } from '@edunexia/shared-types/rh';

const AvaliacoesPage: React.FC = () => {
  const avaliacoesService = useAvaliacoesService();
  const colaboradoresService = useColaboradoresService();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<StatusAvaliacao | null>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const itemsPerPage = 10;

  // Buscar avaliações com filtros
  const { data, isLoading } = useQuery({
    queryKey: ['avaliacoes', searchTerm, selectedStatus, selectedColaborador, dateRange, currentPage],
    queryFn: async () => {
      return avaliacoesService.listarAvaliacoes({
        termo_busca: searchTerm || undefined,
        status: selectedStatus || undefined,
        colaborador_id: selectedColaborador || undefined,
        data_inicio: dateRange[0] ? dateRange[0].toISOString().split('T')[0] : undefined,
        data_fim: dateRange[1] ? dateRange[1].toISOString().split('T')[0] : undefined,
        page: currentPage,
        limit: itemsPerPage
      });
    }
  });

  // Buscar colaboradores para o filtro
  const { data: colaboradores } = useQuery({
    queryKey: ['colaboradores-filtro'],
    queryFn: async () => colaboradoresService.listarColaboradoresAtivos()
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: StatusAvaliacao | null) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleColaboradorChange = (value: string | null) => {
    setSelectedColaborador(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: [Date | null, Date | null]) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getBadgeColorForStatus = (status: string) => {
    switch (status) {
      case StatusAvaliacao.PENDENTE:
        return 'yellow';
      case StatusAvaliacao.EM_ANDAMENTO:
        return 'blue';
      case StatusAvaliacao.CONCLUIDA:
        return 'green';
      case StatusAvaliacao.CANCELADA:
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusOptions = [
    { label: 'Pendente', value: StatusAvaliacao.PENDENTE },
    { label: 'Em Andamento', value: StatusAvaliacao.EM_ANDAMENTO },
    { label: 'Concluída', value: StatusAvaliacao.CONCLUIDA },
    { label: 'Cancelada', value: StatusAvaliacao.CANCELADA }
  ];

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getColaboradorNome = (id: string): string => {
    if (!colaboradores) return 'Carregando...';
    const colaborador = colaboradores.find((c: Colaborador) => c.id === id);
    return colaborador ? colaborador.nome : 'Colaborador não encontrado';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Avaliações de Desempenho"
        description="Gerencie ciclos avaliativos e acompanhe o desempenho dos colaboradores"
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/rh/avaliacoes/nova')}
          >
            Nova Avaliação
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchInput
              placeholder="Buscar por ciclo, avaliador ou observações..."
              value={searchTerm}
              onChange={handleSearch}
              className="sm:w-96"
            />

            <Dropdown
              label="Filtrar por Status"
              options={statusOptions}
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="Todos os status"
              allowClear
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Select
              label="Filtrar por Colaborador"
              options={
                colaboradores?.map((col: Colaborador) => ({
                  label: col.nome,
                  value: col.id
                })) || []
              }
              value={selectedColaborador}
              onChange={handleColaboradorChange}
              placeholder="Todos os colaboradores"
              isClearable
              className="w-full sm:w-72"
            />

            <DateRangePicker
              label="Período da Avaliação"
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder={['Data inicial', 'Data final']}
              className="w-full sm:w-96"
            />
          </div>
        </div>
      </Card>

      <Card>
        <Table
          data={data?.items || []}
          isLoading={isLoading}
          columns={[
            {
              header: 'Ciclo Avaliativo',
              accessor: 'ciclo_avaliativo',
              cell: (row: Avaliacao) => (
                <div className="font-medium">{row.ciclo_avaliativo}</div>
              )
            },
            {
              header: 'Colaborador',
              cell: (row: Avaliacao) => (
                <div className="flex items-center gap-2">
                  <Avatar
                    name={getColaboradorNome(row.colaborador_id)}
                    size="sm"
                  />
                  <span>{getColaboradorNome(row.colaborador_id)}</span>
                </div>
              )
            },
            {
              header: 'Período',
              cell: (row: Avaliacao) => (
                <div className="text-sm">
                  <div>
                    {new Date(row.data_inicio).toLocaleDateString('pt-BR')}
                  </div>
                  <div>até</div>
                  <div>
                    {new Date(row.data_fim).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              )
            },
            {
              header: 'Status',
              cell: (row: Avaliacao) => (
                <Badge color={getBadgeColorForStatus(row.status)}>
                  {formatStatusLabel(row.status)}
                </Badge>
              )
            },
            {
              header: 'Pontuação',
              cell: (row: Avaliacao) => (
                <div className="font-medium">
                  {row.pontuacao_geral !== undefined ? `${row.pontuacao_geral.toFixed(1)}/10` : '-'}
                </div>
              )
            },
            {
              header: 'Avaliador',
              cell: (row: Avaliacao) => (
                <div>{getColaboradorNome(row.avaliador_id)}</div>
              )
            },
            {
              header: 'Ações',
              cell: (row: Avaliacao) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/rh/avaliacoes/${row.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
              )
            }
          ]}
          emptyState={{
            title: 'Nenhuma avaliação encontrada',
            description: 'Tente ajustar os filtros ou crie uma nova avaliação.'
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

export default AvaliacoesPage; 