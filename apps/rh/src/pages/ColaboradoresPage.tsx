import React, { useState } from 'react';
import { 
  PageHeader, 
  Button, 
  Table, 
  Badge, 
  SearchInput, 
  Dropdown, 
  Pagination,
  Card,
  Avatar,
  Modal
} from '@edunexia/ui-components';
import { useColaboradoresService } from '../contexts';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Colaborador, TipoContrato } from '../types';

const ColaboradoresPage: React.FC = () => {
  const colaboradoresService = useColaboradoresService();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartamento, setSelectedDepartamento] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Buscar colaboradores com filtros
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['colaboradores', searchTerm, selectedDepartamento, currentPage],
    queryFn: async () => {
      return colaboradoresService.listarColaboradores({
        search: searchTerm,
        departamento: selectedDepartamento || undefined,
        page: currentPage,
        limit: itemsPerPage
      });
    }
  });

  // Buscar departamentos para o filtro
  const { data: departamentos } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => colaboradoresService.listarDepartamentos()
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDepartamentoChange = (value: string | null) => {
    setSelectedDepartamento(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportData = () => {
    // Implementar a exportação de dados
    colaboradoresService.exportarColaboradores()
      .then(() => {
        setIsExportModalOpen(false);
      });
  };

  const getBadgeColorForContrato = (tipo: TipoContrato) => {
    switch (tipo) {
      case TipoContrato.CLT:
        return 'green';
      case TipoContrato.PJ:
        return 'blue';
      case TipoContrato.TEMPORARIO:
        return 'orange';
      case TipoContrato.ESTAGIO:
        return 'purple';
      case TipoContrato.TERCEIRIZADO:
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Gestão de Colaboradores"
        description="Gerencie todos os colaboradores da instituição"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/rh/colaboradores/novo')}
            >
              Novo Colaborador
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4">
          <SearchInput
            placeholder="Buscar por nome, cargo ou email..."
            value={searchTerm}
            onChange={handleSearch}
            className="sm:w-96"
          />

          <Dropdown
            label="Filtrar por Departamento"
            options={
              departamentos?.map(dept => ({
                label: dept,
                value: dept
              })) || []
            }
            value={selectedDepartamento}
            onChange={handleDepartamentoChange}
            placeholder="Todos os departamentos"
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
              header: 'Colaborador',
              cell: (row: Colaborador) => (
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={row.foto_url} 
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
              header: 'Cargo',
              accessor: 'cargo'
            },
            {
              header: 'Departamento',
              accessor: 'departamento'
            },
            {
              header: 'Tipo',
              cell: (row: Colaborador) => (
                <Badge 
                  color={getBadgeColorForContrato(row.tipo_contrato)}
                >
                  {row.tipo_contrato.toUpperCase()}
                </Badge>
              )
            },
            {
              header: 'Admissão',
              accessor: 'data_admissao',
              cell: (row: Colaborador) => (
                <span>
                  {new Date(row.data_admissao).toLocaleDateString('pt-BR')}
                </span>
              )
            },
            {
              header: 'Status',
              cell: (row: Colaborador) => (
                <Badge color={row.ativo ? 'green' : 'red'}>
                  {row.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              )
            },
            {
              header: 'Ações',
              cell: (row: Colaborador) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/rh/colaboradores/${row.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
              )
            }
          ]}
          emptyState={{
            title: 'Nenhum colaborador encontrado',
            description: 'Tente ajustar os filtros ou adicione novos colaboradores.'
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

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Exportar Dados de Colaboradores"
      >
        <div className="space-y-4">
          <p>Selecione o formato de exportação desejado:</p>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportData}>
              Exportar como Excel
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              Exportar como CSV
            </Button>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setIsExportModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ColaboradoresPage; 