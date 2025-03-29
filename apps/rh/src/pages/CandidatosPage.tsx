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
  Avatar
} from '@edunexia/ui-components';
import { useCandidatosService, useVagasService } from '../contexts';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Candidato, StatusCandidato, Vaga } from '@edunexia/shared-types/rh';

const CandidatosPage: React.FC = () => {
  const candidatosService = useCandidatosService();
  const vagasService = useVagasService();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVaga, setSelectedVaga] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusCandidato | null>(null);
  const itemsPerPage = 10;

  // Buscar candidatos com filtros
  const { data, isLoading } = useQuery({
    queryKey: ['candidatos', searchTerm, selectedVaga, selectedStatus, currentPage],
    queryFn: async () => {
      return candidatosService.listarCandidatos({
        termo_busca: searchTerm || undefined,
        vaga_id: selectedVaga || undefined,
        status: selectedStatus || undefined,
        page: currentPage,
        limit: itemsPerPage
      });
    }
  });

  // Buscar vagas para o filtro
  const { data: vagas } = useQuery({
    queryKey: ['vagas-filtro'],
    queryFn: async () => vagasService.listarVagasAtivas()
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleVagaChange = (value: string | null) => {
    setSelectedVaga(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: StatusCandidato | null) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getBadgeColorForStatus = (status: StatusCandidato) => {
    switch (status) {
      case StatusCandidato.INSCRITO:
        return 'gray';
      case StatusCandidato.EM_ANALISE:
        return 'blue';
      case StatusCandidato.ENTREVISTA_AGENDADA:
        return 'orange';
      case StatusCandidato.ENTREVISTADO:
        return 'indigo';
      case StatusCandidato.APROVADO:
        return 'green';
      case StatusCandidato.CONTRATADO:
        return 'emerald';
      case StatusCandidato.REPROVADO:
        return 'red';
      case StatusCandidato.DESISTENTE:
        return 'pink';
      default:
        return 'gray';
    }
  };

  const statusOptions = [
    { label: 'Inscritos', value: StatusCandidato.INSCRITO },
    { label: 'Em Análise', value: StatusCandidato.EM_ANALISE },
    { label: 'Entrevista Agendada', value: StatusCandidato.ENTREVISTA_AGENDADA },
    { label: 'Entrevistados', value: StatusCandidato.ENTREVISTADO },
    { label: 'Aprovados', value: StatusCandidato.APROVADO },
    { label: 'Contratados', value: StatusCandidato.CONTRATADO },
    { label: 'Reprovados', value: StatusCandidato.REPROVADO },
    { label: 'Desistentes', value: StatusCandidato.DESISTENTE }
  ];

  const formatStatusLabel = (status: StatusCandidato) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getVagaTitle = (vagaId: string): string => {
    if (!vagas) return 'Carregando...';
    const vaga = vagas.find((v: Vaga) => v.id === vagaId);
    return vaga ? vaga.titulo : 'Vaga não encontrada';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Gestão de Candidatos"
        description="Gerencie candidatos em processos seletivos"
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/rh/candidatos/novo')}
          >
            Novo Candidato
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4">
          <SearchInput
            placeholder="Buscar por nome, email ou competências..."
            value={searchTerm}
            onChange={handleSearch}
            className="sm:w-96"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Dropdown
              label="Filtrar por Vaga"
              options={
                vagas?.map((vaga: Vaga) => ({
                  label: vaga.titulo,
                  value: vaga.id
                })) || []
              }
              value={selectedVaga}
              onChange={handleVagaChange}
              placeholder="Todas as vagas"
              allowClear
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
        </div>
      </Card>

      <Card>
        <Table
          data={data?.items || []}
          isLoading={isLoading}
          columns={[
            {
              header: 'Candidato',
              cell: (row: Candidato) => (
                <div className="flex items-center gap-3">
                  <Avatar
                    name={row.nome}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">{row.nome}</div>
                    <div className="text-xs text-gray-500">{row.email}</div>
                  </div>
                </div>
              )
            },
            {
              header: 'Vaga',
              cell: (row: Candidato) => (
                <div className="font-medium">
                  {getVagaTitle(row.vaga_id)}
                </div>
              )
            },
            {
              header: 'Status',
              cell: (row: Candidato) => (
                <Badge color={getBadgeColorForStatus(row.status)}>
                  {formatStatusLabel(row.status)}
                </Badge>
              )
            },
            {
              header: 'Competências',
              cell: (row: Candidato) => (
                <div className="flex flex-wrap gap-1">
                  {row.competencias.slice(0, 3).map((comp, idx) => (
                    <Badge key={idx} color="gray" variant="subtle">
                      {comp}
                    </Badge>
                  ))}
                  {row.competencias.length > 3 && (
                    <Badge color="gray" variant="subtle">
                      +{row.competencias.length - 3}
                    </Badge>
                  )}
                </div>
              )
            },
            {
              header: 'Links',
              cell: (row: Candidato) => (
                <div className="flex items-center gap-2">
                  {row.linkedin_url && (
                    <a 
                      href={row.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      LinkedIn
                    </a>
                  )}
                  {row.github_url && (
                    <a 
                      href={row.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              )
            },
            {
              header: 'Cadastro',
              accessor: 'created_at',
              cell: (row: Candidato) => (
                <span>
                  {new Date(row.created_at).toLocaleDateString('pt-BR')}
                </span>
              )
            },
            {
              header: 'Ações',
              cell: (row: Candidato) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/rh/candidatos/${row.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
              )
            }
          ]}
          emptyState={{
            title: 'Nenhum candidato encontrado',
            description: 'Tente ajustar os filtros ou adicione novos candidatos.'
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

export default CandidatosPage; 