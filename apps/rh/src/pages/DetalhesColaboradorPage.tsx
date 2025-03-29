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
  Divider 
} from '@edunexia/ui-components';
import { useColaboradoresService, useAvaliacoesService } from '../contexts';
import { TipoContrato } from '../types';

const DetalhesColaboradorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const colaboradoresService = useColaboradoresService();
  const avaliacoesService = useAvaliacoesService();
  
  // Buscar dados do colaborador
  const { data: colaborador, isLoading } = useQuery({
    queryKey: ['colaborador', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      return colaboradoresService.obterColaborador(id);
    },
    enabled: !!id
  });

  // Buscar avaliações do colaborador
  const { data: avaliacoes } = useQuery({
    queryKey: ['avaliacoes-colaborador', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      return avaliacoesService.listarAvaliacoesPorColaborador(id);
    },
    enabled: !!id
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <div className="p-6 flex justify-center">
            <p>Carregando informações do colaborador...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!colaborador) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Colaborador não encontrado</h2>
            <p className="mb-4">O colaborador solicitado não foi encontrado ou não existe.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/rh/colaboradores')}
            >
              Voltar para Colaboradores
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={colaborador.nome}
        description={colaborador.cargo}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/rh/colaboradores/editar/${id}`)}
            >
              Editar
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/rh/avaliacoes/nova?colaborador=${id}`)}
            >
              Nova Avaliação
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1">
          <div className="p-6 flex flex-col items-center">
            <Avatar
              src={colaborador.foto_url}
              name={colaborador.nome}
              size="xl"
              className="mb-4"
            />
            <h2 className="text-xl font-semibold">{colaborador.nome}</h2>
            <p className="text-gray-600 mb-1">{colaborador.cargo}</p>
            <p className="text-gray-500 text-sm mb-3">{colaborador.email}</p>
            
            <Badge 
              color={getBadgeColorForContrato(colaborador.tipo_contrato)}
              className="mb-3"
            >
              {colaborador.tipo_contrato.toUpperCase()}
            </Badge>
            
            <Badge 
              color={colaborador.ativo ? 'green' : 'red'}
              className="mb-4"
            >
              {colaborador.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
            
            <Divider />
            
            <div className="w-full mt-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Departamento:</span>
                <span className="font-medium">{colaborador.departamento}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Data de Admissão:</span>
                <span className="font-medium">
                  {new Date(colaborador.data_admissao).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {colaborador.data_demissao && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Data de Demissão:</span>
                  <span className="font-medium">
                    {new Date(colaborador.data_demissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              {colaborador.gestor_id && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Gestor:</span>
                  <Button
                    variant="link"
                    onClick={() => navigate(`/rh/colaboradores/${colaborador.gestor_id}`)}
                  >
                    Ver Gestor
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="informacoes">
            <Tab value="informacoes" label="Informações">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Dados Profissionais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Cargo</p>
                      <p className="font-medium">{colaborador.cargo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Departamento</p>
                      <p className="font-medium">{colaborador.departamento}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Contrato</p>
                      <p className="font-medium">{colaborador.tipo_contrato.toUpperCase()}</p>
                    </div>
                    {colaborador.salario && (
                      <div>
                        <p className="text-sm text-gray-600">Salário</p>
                        <p className="font-medium">
                          {colaborador.salario.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Dados de Contato</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{colaborador.email}</p>
                    </div>
                    {colaborador.telefone && (
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="font-medium">{colaborador.telefone}</p>
                      </div>
                    )}
                    {colaborador.linkedin_url && (
                      <div>
                        <p className="text-sm text-gray-600">LinkedIn</p>
                        <a
                          href={colaborador.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver Perfil
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Tab>
            
            <Tab value="avaliacoes" label="Avaliações">
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Avaliações de Desempenho</h3>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/rh/avaliacoes/nova?colaborador=${id}`)}
                    >
                      Nova Avaliação
                    </Button>
                  </div>
                  
                  {avaliacoes && avaliacoes.length > 0 ? (
                    <div className="space-y-4">
                      {avaliacoes.map(avaliacao => (
                        <div 
                          key={avaliacao.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{avaliacao.ciclo_avaliativo}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(avaliacao.data_inicio).toLocaleDateString('pt-BR')} a {' '}
                                {new Date(avaliacao.data_fim).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <Badge color={
                              avaliacao.status === 'concluida' ? 'green' :
                              avaliacao.status === 'em_andamento' ? 'blue' : 'orange'
                            }>
                              {avaliacao.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {avaliacao.pontuacao_geral !== undefined && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Pontuação Geral:</p>
                              <p className="font-medium">{avaliacao.pontuacao_geral.toFixed(1)}/10</p>
                            </div>
                          )}
                          
                          <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => navigate(`/rh/avaliacoes/${avaliacao.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Nenhuma avaliação encontrada para este colaborador.
                    </p>
                  )}
                </div>
              </Card>
            </Tab>
            
            <Tab value="documentos" label="Documentos">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Documentos</h3>
                  <p className="text-gray-600 mb-4">
                    Documentação e arquivos relacionados ao colaborador.
                  </p>
                  
                  <Button variant="outline">Adicionar Documento</Button>
                  
                  <div className="mt-4">
                    <p className="text-gray-600">
                      Nenhum documento cadastrado para este colaborador.
                    </p>
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

export default DetalhesColaboradorPage; 