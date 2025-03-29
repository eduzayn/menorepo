import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Button,
  Avatar,
  Badge,
  Timeline,
  TimelineItem,
  Divider,
  Tabs,
  Tab,
  Grid,
  Stat
} from '@edunexia/ui-components';
import { useCandidatosService, useVagasService } from '../contexts';
import { StatusCandidato } from '@edunexia/shared-types/rh';
import { FiFileText, FiUser, FiMail, FiPhone, FiMapPin, FiLink, FiGithub, FiLinkedin, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const DetalhesCandidatoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidatosService = useCandidatosService();
  const vagasService = useVagasService();

  // Buscar detalhes do candidato
  const { data: candidato, isLoading, error } = useQuery({
    queryKey: ['candidato', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do candidato não fornecido');
      return candidatosService.obterCandidato(id);
    },
    enabled: !!id
  });

  // Buscar detalhes da vaga
  const { data: vaga } = useQuery({
    queryKey: ['vaga', candidato?.vaga_id],
    queryFn: async () => {
      if (!candidato?.vaga_id) throw new Error('ID da vaga não fornecido');
      return vagasService.obterVaga(candidato.vaga_id);
    },
    enabled: !!candidato?.vaga_id
  });

  // Determinar cor do badge com base no status
  const getBadgeColorFromStatus = (status: StatusCandidato) => {
    const statusMap: Record<StatusCandidato, string> = {
      [StatusCandidato.INSCRITO]: 'blue',
      [StatusCandidato.EM_ANALISE]: 'yellow',
      [StatusCandidato.ENTREVISTA_AGENDADA]: 'purple',
      [StatusCandidato.APROVADO]: 'green',
      [StatusCandidato.REPROVADO]: 'red',
      [StatusCandidato.CONTRATADO]: 'green',
      [StatusCandidato.DESISTIU]: 'gray'
    };
    return statusMap[status] || 'gray';
  };

  // Formatar status para exibição
  const formatStatus = (status: StatusCandidato) => {
    const statusMap: Record<StatusCandidato, string> = {
      [StatusCandidato.INSCRITO]: 'Inscrito',
      [StatusCandidato.EM_ANALISE]: 'Em Análise',
      [StatusCandidato.ENTREVISTA_AGENDADA]: 'Entrevista Agendada',
      [StatusCandidato.APROVADO]: 'Aprovado',
      [StatusCandidato.REPROVADO]: 'Reprovado',
      [StatusCandidato.CONTRATADO]: 'Contratado',
      [StatusCandidato.DESISTIU]: 'Desistiu'
    };
    return statusMap[status] || status;
  };

  // Carregar estados de loading e error
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Carregando dados do candidato...</p>
      </div>
    );
  }

  if (error || !candidato) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Erro ao carregar candidato. {error instanceof Error ? error.message : 'Tente novamente mais tarde.'}</p>
        <Button onClick={() => navigate('/rh/candidatos')}>Voltar para Lista</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={candidato.nome}
        description={`Candidato para ${vaga?.titulo || 'vaga'}`}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/rh/candidatos')}
            >
              Voltar
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate(`/rh/candidatos/${id}/editar`)}
            >
              Editar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar 
                  size="xl" 
                  name={candidato.nome} 
                  src={candidato.foto_url} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{candidato.nome}</h2>
                    <Badge color={getBadgeColorFromStatus(candidato.status)}>
                      {formatStatus(candidato.status)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{candidato.cargo_pretendido || vaga?.titulo}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidato.competencias?.map((competencia, index) => (
                      <Badge key={index} color="blue" variant="outline">{competencia}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Divider className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-500" />
                  <span>{candidato.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-500" />
                  <span>{candidato.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  <span>{candidato.localizacao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  <span>Candidatura: {new Date(candidato.data_candidatura).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {candidato.linkedin_url && (
                  <a href={candidato.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                    <FiLinkedin />
                    LinkedIn
                  </a>
                )}
                {candidato.github_url && (
                  <a href={candidato.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                    <FiGithub />
                    GitHub
                  </a>
                )}
                {candidato.portfolio_url && (
                  <a href={candidato.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-600 hover:text-purple-800">
                    <FiLink />
                    Portfolio
                  </a>
                )}
                {candidato.curriculo_url && (
                  <a href={candidato.curriculo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-red-600 hover:text-red-800">
                    <FiFileText />
                    Currículo
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Vaga</h3>
              {vaga ? (
                <>
                  <h4 className="font-medium text-lg">{vaga.titulo}</h4>
                  <p className="text-gray-600 mb-2">Departamento: {vaga.departamento}</p>
                  <Badge color="blue">{vaga.tipo_contrato}</Badge>
                  <Divider className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Salário:</span>
                    <span className="font-medium">
                      {vaga.faixa_salarial_inicio && vaga.faixa_salarial_fim
                        ? `R$ ${vaga.faixa_salarial_inicio.toLocaleString()} - R$ ${vaga.faixa_salarial_fim.toLocaleString()}`
                        : 'A combinar'}
                    </span>
                  </div>
                  <Divider className="my-4" />
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => navigate(`/rh/vagas/${vaga.id}`)}
                  >
                    Ver Detalhes da Vaga
                  </Button>
                </>
              ) : (
                <p>Carregando detalhes da vaga...</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Tabs className="mb-6">
        <Tab label="Histórico" value="historico">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Histórico do Processo</h3>
              
              <Timeline>
                <TimelineItem
                  icon={<FiUser />}
                  title="Inscrição Recebida"
                  description="O candidato se inscreveu para a vaga"
                  date={new Date(candidato.data_candidatura).toLocaleDateString()}
                />
                
                {candidato.historico?.map((evento, index) => (
                  <TimelineItem
                    key={index}
                    icon={evento.tipo === 'aprovado' ? <FiCheckCircle /> : evento.tipo === 'reprovado' ? <FiXCircle /> : <FiCalendar />}
                    title={evento.titulo}
                    description={evento.descricao}
                    date={new Date(evento.data).toLocaleDateString()}
                  />
                ))}
              </Timeline>
            </div>
          </Card>
        </Tab>
        
        <Tab label="Formação" value="formacao">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Formação Acadêmica</h3>
              
              {candidato.formacao_academica?.length ? (
                <div className="space-y-6">
                  {candidato.formacao_academica.map((formacao, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">{formacao.curso}</h4>
                      <p className="text-gray-600">{formacao.instituicao}</p>
                      <p className="text-sm text-gray-500">
                        {formacao.data_inicio && formacao.data_conclusao 
                          ? `${new Date(formacao.data_inicio).getFullYear()} - ${new Date(formacao.data_conclusao).getFullYear()}` 
                          : formacao.data_inicio 
                            ? `Desde ${new Date(formacao.data_inicio).getFullYear()}`
                            : ''}
                      </p>
                      {formacao.descricao && <p className="mt-2">{formacao.descricao}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma formação acadêmica informada.</p>
              )}
            </div>
          </Card>
        </Tab>
        
        <Tab label="Experiência" value="experiencia">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Experiência Profissional</h3>
              
              {candidato.experiencia_profissional?.length ? (
                <div className="space-y-6">
                  {candidato.experiencia_profissional.map((experiencia, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">{experiencia.cargo}</h4>
                      <p className="text-gray-600">{experiencia.empresa}</p>
                      <p className="text-sm text-gray-500">
                        {experiencia.data_inicio && experiencia.data_fim 
                          ? `${new Date(experiencia.data_inicio).toLocaleDateString()} - ${new Date(experiencia.data_fim).toLocaleDateString()}` 
                          : experiencia.data_inicio 
                            ? `Desde ${new Date(experiencia.data_inicio).toLocaleDateString()}`
                            : ''}
                      </p>
                      {experiencia.descricao && <p className="mt-2">{experiencia.descricao}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma experiência profissional informada.</p>
              )}
            </div>
          </Card>
        </Tab>
        
        <Tab label="Avaliação" value="avaliacao">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Avaliação do Candidato</h3>
              
              <Grid cols={2} className="gap-4 mb-6">
                <Stat 
                  title="Pontuação Técnica" 
                  value={candidato.pontuacao_tecnica?.toString() || '-'} 
                  description="De 0 a 10"
                />
                <Stat 
                  title="Pontuação Comportamental" 
                  value={candidato.pontuacao_comportamental?.toString() || '-'} 
                  description="De 0 a 10"
                />
              </Grid>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Pontos Fortes</h4>
                {candidato.pontos_fortes?.length ? (
                  <ul className="list-disc pl-5">
                    {candidato.pontos_fortes.map((ponto, index) => (
                      <li key={index}>{ponto}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum ponto forte registrado.</p>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Pontos de Melhoria</h4>
                {candidato.pontos_melhoria?.length ? (
                  <ul className="list-disc pl-5">
                    {candidato.pontos_melhoria.map((ponto, index) => (
                      <li key={index}>{ponto}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Nenhum ponto de melhoria registrado.</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Feedback da Entrevista</h4>
                {candidato.feedback_entrevista ? (
                  <p>{candidato.feedback_entrevista}</p>
                ) : (
                  <p className="text-gray-500">Nenhum feedback de entrevista registrado.</p>
                )}
              </div>
            </div>
          </Card>
        </Tab>
      </Tabs>
      
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={() => navigate('/rh/candidatos')}
        >
          Voltar
        </Button>
        
        {candidato.status === StatusCandidato.APROVADO && (
          <Button 
            variant="primary"
            onClick={() => navigate(`/rh/colaboradores/novo?candidato=${candidato.id}`)}
          >
            Contratar Candidato
          </Button>
        )}
        
        {(candidato.status === StatusCandidato.INSCRITO || candidato.status === StatusCandidato.EM_ANALISE) && (
          <Button 
            onClick={() => {
              /* Implementar função para agendar entrevista */
              alert('Funcionalidade de agendamento será implementada em breve.');
            }}
          >
            Agendar Entrevista
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetalhesCandidatoPage; 