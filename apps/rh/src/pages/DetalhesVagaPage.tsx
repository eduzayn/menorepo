import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Divider,
  Tabs,
  Tab,
  Table,
  Avatar,
  Timeline,
  TimelineItem,
  Stat,
  ProgressBar,
  Alert
} from '@edunexia/ui-components';
import { useVagasService, useCandidatosService } from '../contexts';
import { StatusVaga, TipoContrato, Candidato, StatusCandidato } from '@edunexia/shared-types/rh';
import { FiMapPin, FiUser, FiDollarSign, FiCalendar, FiBriefcase, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const DetalhesVagaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vagasService = useVagasService();
  const candidatosService = useCandidatosService();
  const [activeTab, setActiveTab] = useState('detalhes');

  // Buscar detalhes da vaga
  const { 
    data: vaga, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['vaga', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da vaga não fornecido');
      return vagasService.obterVaga(id);
    },
    enabled: !!id
  });

  // Buscar candidatos para a vaga
  const { data: candidatos = [] } = useQuery({
    queryKey: ['candidatos-vaga', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da vaga não fornecido');
      return candidatosService.listarCandidatosPorVaga(id);
    },
    enabled: !!id
  });

  // Mutação para alterar status da vaga
  const alterarStatusMutation = useMutation({
    mutationFn: (status: StatusVaga) => vagasService.alterarStatusVaga(id!, status),
    onSuccess: () => {
      refetch();
    }
  });

  const handleAlterarStatus = (status: StatusVaga) => {
    alterarStatusMutation.mutate(status);
  };

  // Obter cor do badge com base no status
  const getBadgeColorFromStatus = (status: StatusVaga) => {
    const statusMap: Record<StatusVaga, string> = {
      [StatusVaga.ABERTA]: 'green',
      [StatusVaga.EM_ANDAMENTO]: 'blue',
      [StatusVaga.ENCERRADA]: 'gray',
      [StatusVaga.SUSPENSA]: 'yellow',
      [StatusVaga.CANCELADA]: 'red'
    };
    return statusMap[status] || 'gray';
  };

  // Formatar status para exibição
  const formatStatus = (status: StatusVaga) => {
    const statusMap: Record<StatusVaga, string> = {
      [StatusVaga.ABERTA]: 'Aberta',
      [StatusVaga.EM_ANDAMENTO]: 'Em Andamento',
      [StatusVaga.ENCERRADA]: 'Encerrada',
      [StatusVaga.SUSPENSA]: 'Suspensa',
      [StatusVaga.CANCELADA]: 'Cancelada'
    };
    return statusMap[status] || status;
  };

  // Obter cor do badge para status de candidato
  const getBadgeColorForCandidatoStatus = (status: StatusCandidato) => {
    const statusMap: Record<StatusCandidato, string> = {
      [StatusCandidato.INSCRITO]: 'gray',
      [StatusCandidato.EM_ANALISE]: 'yellow',
      [StatusCandidato.ENTREVISTA_AGENDADA]: 'blue',
      [StatusCandidato.APROVADO]: 'green',
      [StatusCandidato.REPROVADO]: 'red',
      [StatusCandidato.CONTRATADO]: 'purple',
      [StatusCandidato.DESISTENTE]: 'pink'
    };
    return statusMap[status] || 'gray';
  };

  // Formatar status de candidato para exibição
  const formatCandidatoStatus = (status: StatusCandidato) => {
    const statusMap: Record<StatusCandidato, string> = {
      [StatusCandidato.INSCRITO]: 'Inscrito',
      [StatusCandidato.EM_ANALISE]: 'Em Análise',
      [StatusCandidato.ENTREVISTA_AGENDADA]: 'Entrevista Agendada',
      [StatusCandidato.APROVADO]: 'Aprovado',
      [StatusCandidato.REPROVADO]: 'Reprovado',
      [StatusCandidato.CONTRATADO]: 'Contratado',
      [StatusCandidato.DESISTENTE]: 'Desistente'
    };
    return statusMap[status] || status;
  };

  // Formatar tipo de contrato para exibição
  const formatTipoContrato = (tipo: TipoContrato) => {
    const tipoMap: Record<TipoContrato, string> = {
      [TipoContrato.CLT]: 'CLT',
      [TipoContrato.PJ]: 'PJ',
      [TipoContrato.TEMPORARIO]: 'Temporário',
      [TipoContrato.ESTAGIO]: 'Estágio',
      [TipoContrato.TERCEIRIZADO]: 'Terceirizado'
    };
    return tipoMap[tipo] || tipo;
  };

  // Calcular estatísticas de candidatos
  const calcularEstatisticasCandidatos = () => {
    if (!candidatos.length) {
      return {
        total: 0,
        emAndamento: 0,
        aprovados: 0,
        reprovados: 0,
        taxaAprovacao: 0
      };
    }

    const total = candidatos.length;
    const emAndamento = candidatos.filter(c => 
      c.status === StatusCandidato.INSCRITO || 
      c.status === StatusCandidato.EM_ANALISE || 
      c.status === StatusCandidato.ENTREVISTA_AGENDADA
    ).length;
    const aprovados = candidatos.filter(c => 
      c.status === StatusCandidato.APROVADO || 
      c.status === StatusCandidato.CONTRATADO
    ).length;
    const reprovados = candidatos.filter(c => 
      c.status === StatusCandidato.REPROVADO || 
      c.status === StatusCandidato.DESISTENTE
    ).length;
    const taxaAprovacao = Math.round((aprovados / (aprovados + reprovados || 1)) * 100);

    return {
      total,
      emAndamento,
      aprovados,
      reprovados,
      taxaAprovacao
    };
  };

  const estatisticas = calcularEstatisticasCandidatos();

  // Estados de loading e error
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Carregando dados da vaga...</p>
      </div>
    );
  }

  if (error || !vaga) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Erro ao carregar vaga. {error instanceof Error ? error.message : 'Tente novamente mais tarde.'}</p>
        <Button onClick={() => navigate('/rh/vagas')}>Voltar para Lista</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={vaga.titulo}
        description={`Vaga de ${vaga.cargo} para o departamento de ${vaga.departamento}`}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/rh/vagas')}
            >
              Voltar
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate(`/rh/vagas/${id}/editar`)}
            >
              Editar
            </Button>
          </div>
        }
      />

      {vaga.status === StatusVaga.SUSPENSA && (
        <Alert variant="warning" className="mb-6">
          <p>Esta vaga está suspensa temporariamente. Para reativá-la, altere o status para "Aberta".</p>
        </Alert>
      )}

      {vaga.status === StatusVaga.CANCELADA && (
        <Alert variant="error" className="mb-6">
          <p>Esta vaga foi cancelada e não está mais disponível para candidaturas.</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{vaga.titulo}</h2>
                <Badge color={getBadgeColorFromStatus(vaga.status)}>
                  {formatStatus(vaga.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-gray-500" />
                  <span>Cargo: {vaga.cargo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  <span>Local: {vaga.local_trabalho}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-500" />
                  <span>Contrato: {formatTipoContrato(vaga.tipo_contrato)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-gray-500" />
                  <span>Salário: {
                    vaga.faixa_salarial_min && vaga.faixa_salarial_max
                      ? `R$ ${vaga.faixa_salarial_min.toLocaleString()} - R$ ${vaga.faixa_salarial_max.toLocaleString()}`
                      : 'A combinar'
                  }</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  <span>Publicação: {new Date(vaga.data_publicacao).toLocaleDateString()}</span>
                </div>
              </div>

              <Divider className="my-4" />

              <h3 className="font-medium mb-3">Descrição</h3>
              <div className="mb-6 whitespace-pre-line">{vaga.descricao}</div>

              <h3 className="font-medium mb-3">Requisitos</h3>
              <div className="whitespace-pre-line">{vaga.requisitos}</div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Alterar Status</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  disabled={vaga.status === StatusVaga.ABERTA}
                  onClick={() => handleAlterarStatus(StatusVaga.ABERTA)}
                >
                  Marcar como Aberta
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  disabled={vaga.status === StatusVaga.EM_ANDAMENTO}
                  onClick={() => handleAlterarStatus(StatusVaga.EM_ANDAMENTO)}
                >
                  Marcar como Em Andamento
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  disabled={vaga.status === StatusVaga.SUSPENSA}
                  onClick={() => handleAlterarStatus(StatusVaga.SUSPENSA)}
                >
                  Suspender Vaga
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  disabled={vaga.status === StatusVaga.ENCERRADA}
                  onClick={() => handleAlterarStatus(StatusVaga.ENCERRADA)}
                >
                  Encerrar Vaga
                </Button>
                
                <Button
                  variant="outline"
                  color="danger"
                  fullWidth
                  disabled={vaga.status === StatusVaga.CANCELADA}
                  onClick={() => handleAlterarStatus(StatusVaga.CANCELADA)}
                >
                  Cancelar Vaga
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Stat 
                  title="Total de Candidatos" 
                  value={estatisticas.total.toString()} 
                />
                <Stat 
                  title="Em Processo" 
                  value={estatisticas.emAndamento.toString()} 
                />
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Taxa de Aprovação</p>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Aprovados: {estatisticas.aprovados}</span>
                  <span>Reprovados: {estatisticas.reprovados}</span>
                </div>
                <ProgressBar 
                  value={estatisticas.taxaAprovacao} 
                  color="green" 
                />
                <div className="text-right text-sm mt-1">
                  {estatisticas.taxaAprovacao}%
                </div>
              </div>
              
              <Divider className="my-4" />
              
              <Button 
                fullWidth
                onClick={() => navigate('/rh/candidatos/novo', { state: { vagaId: id } })}
              >
                Adicionar Candidato
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <Tab label="Processo Seletivo" value="detalhes">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Etapas do Processo Seletivo</h3>
              
              {vaga.etapas_processo?.length ? (
                <Timeline>
                  {vaga.etapas_processo.map((etapa, index) => (
                    <TimelineItem
                      key={etapa.id}
                      icon={etapa.obrigatoria ? <FiCheckCircle /> : <FiClock />}
                      title={`${index + 1}. ${etapa.nome} ${etapa.obrigatoria ? ' (Obrigatória)' : ' (Opcional)'}`}
                      description={etapa.descricao}
                      date={etapa.duracao_estimada_dias 
                        ? `Duração estimada: ${etapa.duracao_estimada_dias} dias` 
                        : undefined
                      }
                    />
                  ))}
                </Timeline>
              ) : (
                <p className="text-gray-500">Nenhuma etapa definida para o processo seletivo.</p>
              )}
            </div>
          </Card>
        </Tab>
        
        <Tab label="Candidatos" value="candidatos">
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Candidatos para esta Vaga</h3>
                <Button
                  onClick={() => navigate('/rh/candidatos/novo', { state: { vagaId: id } })}
                >
                  Adicionar Candidato
                </Button>
              </div>
              
              <Table
                data={candidatos}
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
                    header: 'Status',
                    cell: (row: Candidato) => (
                      <Badge color={getBadgeColorForCandidatoStatus(row.status)}>
                        {formatCandidatoStatus(row.status)}
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
                    header: 'Candidatura',
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
                  description: 'Não há candidatos registrados para esta vaga.'
                }}
              />
            </div>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default DetalhesVagaPage; 