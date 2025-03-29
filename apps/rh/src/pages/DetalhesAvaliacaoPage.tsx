import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  PageHeader, 
  Tabs, 
  Tab, 
  Card, 
  Avatar, 
  Badge, 
  Button, 
  Divider,
  ProgressBar,
  Stat
} from '@edunexia/ui-components';
import { useAvaliacoesService, useColaboradoresService } from '../contexts';
import { Avaliacao, Colaborador, CompetenciaAvaliada, Meta, StatusAvaliacao } from '@edunexia/shared-types/rh';

const DetalhesAvaliacaoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const avaliacoesService = useAvaliacoesService();
  const colaboradoresService = useColaboradoresService();
  
  // Buscar dados da avaliação
  const { data: avaliacao, isLoading } = useQuery({
    queryKey: ['avaliacao', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      return avaliacoesService.obterAvaliacao(id);
    },
    enabled: !!id
  });

  // Buscar dados do colaborador
  const { data: colaborador } = useQuery({
    queryKey: ['colaborador-avaliacao', avaliacao?.colaborador_id],
    queryFn: async () => {
      if (!avaliacao?.colaborador_id) throw new Error('ID do colaborador não disponível');
      return colaboradoresService.obterColaborador(avaliacao.colaborador_id);
    },
    enabled: !!avaliacao?.colaborador_id
  });

  // Buscar dados do avaliador
  const { data: avaliador } = useQuery({
    queryKey: ['avaliador', avaliacao?.avaliador_id],
    queryFn: async () => {
      if (!avaliacao?.avaliador_id) throw new Error('ID do avaliador não disponível');
      return colaboradoresService.obterColaborador(avaliacao.avaliador_id);
    },
    enabled: !!avaliacao?.avaliador_id
  });

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

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const calcularProgresso = (meta: Meta) => {
    if (meta.valor_alcancado === undefined || meta.valor_esperado === 0) return 0;
    return Math.min(100, (meta.valor_alcancado / meta.valor_esperado) * 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <div className="p-6 flex justify-center">
            <p>Carregando informações da avaliação...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Avaliação não encontrada</h2>
            <p className="mb-4">A avaliação solicitada não foi encontrada ou não existe.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/rh/avaliacoes')}
            >
              Voltar para Avaliações
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={`Avaliação: ${avaliacao.ciclo_avaliativo}`}
        description={`Período: ${new Date(avaliacao.data_inicio).toLocaleDateString('pt-BR')} a ${new Date(avaliacao.data_fim).toLocaleDateString('pt-BR')}`}
        actions={
          <div className="flex gap-2">
            {avaliacao.status !== StatusAvaliacao.CONCLUIDA && (
              <Button
                variant="outline"
                onClick={() => navigate(`/rh/avaliacoes/editar/${id}`)}
              >
                Editar
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => navigate('/rh/avaliacoes')}
            >
              Voltar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Status:</span>
                <Badge color={getBadgeColorForStatus(avaliacao.status)}>
                  {formatStatusLabel(avaliacao.status)}
                </Badge>
              </div>
              
              {avaliacao.pontuacao_geral !== undefined && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Pontuação Geral:</span>
                  <span className="font-medium">{avaliacao.pontuacao_geral.toFixed(1)}/10</span>
                </div>
              )}
              
              <Divider className="my-4" />
              
              <h3 className="text-md font-medium mb-3">Colaborador</h3>
              {colaborador ? (
                <div className="flex items-center gap-3 mb-4">
                  <Avatar
                    src={colaborador.foto_url}
                    name={colaborador.nome}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{colaborador.nome}</p>
                    <p className="text-sm text-gray-500">{colaborador.cargo}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Carregando dados do colaborador...</p>
              )}
              
              <Divider className="my-4" />
              
              <h3 className="text-md font-medium mb-3">Avaliador</h3>
              {avaliador ? (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={avaliador.foto_url}
                    name={avaliador.nome}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{avaliador.nome}</p>
                    <p className="text-sm text-gray-500">{avaliador.cargo}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Carregando dados do avaliador...</p>
              )}
            </div>
          </Card>

          {avaliacao.status === StatusAvaliacao.CONCLUIDA && (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo da Avaliação</h2>
                
                <Stat
                  title="Pontuação Geral"
                  value={avaliacao.pontuacao_geral?.toFixed(1) || '-'}
                  suffix="/10"
                  size="lg"
                  className="mb-4"
                />
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metas Atingidas</p>
                    <p className="font-medium">
                      {avaliacao.metas.filter(m => 
                        m.valor_alcancado !== undefined && 
                        m.valor_alcancado >= m.valor_esperado
                      ).length} 
                      de {avaliacao.metas.length}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Competências Avaliadas</p>
                    <p className="font-medium">{avaliacao.competencias.length}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="metas">
            <Tab value="metas" label="Metas">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Metas e Objetivos</h2>
                  
                  {avaliacao.metas.length > 0 ? (
                    <div className="space-y-6">
                      {avaliacao.metas.map((meta, index) => (
                        <div key={meta.id} className="border-b pb-5 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{meta.descricao}</h3>
                              <p className="text-sm text-gray-600">{meta.indicador}</p>
                            </div>
                            <Badge color={
                              meta.status === 'concluida' ? 'green' :
                              meta.status === 'em_andamento' ? 'blue' : 'yellow'
                            }>
                              {meta.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progresso</span>
                            <span>
                              {meta.valor_alcancado !== undefined ? 
                                `${meta.valor_alcancado} / ${meta.valor_esperado}` : 
                                'Não iniciado'}
                            </span>
                          </div>
                          
                          <ProgressBar 
                            value={calcularProgresso(meta)} 
                            color={
                              calcularProgresso(meta) >= 100 ? 'green' :
                              calcularProgresso(meta) >= 70 ? 'blue' :
                              calcularProgresso(meta) >= 30 ? 'orange' : 'red'
                            }
                            className="mb-2"
                          />
                          
                          {meta.observacoes && (
                            <p className="text-sm text-gray-600 mt-2">{meta.observacoes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma meta definida para esta avaliação.</p>
                  )}
                </div>
              </Card>
            </Tab>
            
            <Tab value="competencias" label="Competências">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Competências Avaliadas</h2>
                  
                  {avaliacao.competencias.length > 0 ? (
                    <div className="space-y-6">
                      {avaliacao.competencias.map((competencia: CompetenciaAvaliada) => (
                        <div key={competencia.id} className="border-b pb-5 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{competencia.nome}</h3>
                              <p className="text-sm text-gray-600">{competencia.descricao}</p>
                            </div>
                            {competencia.nota !== undefined && (
                              <div className="text-lg font-semibold">
                                {competencia.nota.toFixed(1)}/10
                              </div>
                            )}
                          </div>
                          
                          {competencia.nota !== undefined && (
                            <ProgressBar 
                              value={(competencia.nota / 10) * 100} 
                              color={
                                competencia.nota >= 8 ? 'green' :
                                competencia.nota >= 6 ? 'blue' :
                                competencia.nota >= 4 ? 'orange' : 'red'
                              }
                              className="mb-2"
                            />
                          )}
                          
                          {competencia.observacoes && (
                            <p className="text-sm text-gray-600 mt-2">{competencia.observacoes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma competência avaliada.</p>
                  )}
                </div>
              </Card>
            </Tab>
            
            <Tab value="feedback" label="Feedback">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Feedback e Desenvolvimento</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Pontos Fortes</h3>
                    {avaliacao.pontos_fortes && avaliacao.pontos_fortes.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {avaliacao.pontos_fortes.map((ponto, index) => (
                          <li key={index}>{ponto}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Nenhum ponto forte registrado.</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Pontos de Melhoria</h3>
                    {avaliacao.pontos_melhoria && avaliacao.pontos_melhoria.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {avaliacao.pontos_melhoria.map((ponto, index) => (
                          <li key={index}>{ponto}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Nenhum ponto de melhoria registrado.</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Plano de Desenvolvimento</h3>
                    {avaliacao.plano_desenvolvimento ? (
                      <p className="text-gray-800">{avaliacao.plano_desenvolvimento}</p>
                    ) : (
                      <p className="text-gray-600">Nenhum plano de desenvolvimento elaborado.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Feedback Geral</h3>
                    {avaliacao.feedback_geral ? (
                      <p className="text-gray-800">{avaliacao.feedback_geral}</p>
                    ) : (
                      <p className="text-gray-600">Nenhum feedback geral registrado.</p>
                    )}
                  </div>
                </div>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DetalhesAvaliacaoPage; 