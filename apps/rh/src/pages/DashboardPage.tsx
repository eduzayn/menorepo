import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  PageHeader, 
  Card, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatIcon,
  Divider,
  Badge,
  ProgressBar,
  Chart
} from '@edunexia/ui-components';

import { 
  getColaboradoresService,
  getVagasService,
  getCandidatosService,
  getAvaliacoesService
} from '../services';

const DashboardPage: React.FC = () => {
  // Consultas para estatísticas
  const { data: estatisticasColaboradores, isLoading: loadingColaboradores } = useQuery({
    queryKey: ['estatisticas-colaboradores'],
    queryFn: () => getColaboradoresService().obterEstatisticas(),
  });

  const { data: estatisticasVagas, isLoading: loadingVagas } = useQuery({
    queryKey: ['estatisticas-vagas'],
    queryFn: () => getVagasService().obterEstatisticas(),
  });

  const { data: estatisticasCandidatos, isLoading: loadingCandidatos } = useQuery({
    queryKey: ['estatisticas-candidatos'],
    queryFn: () => getCandidatosService().obterEstatisticas(),
  });

  const { data: estatisticasAvaliacoes, isLoading: loadingAvaliacoes } = useQuery({
    queryKey: ['estatisticas-avaliacoes'],
    queryFn: () => getAvaliacoesService().obterEstatisticas(),
  });

  // Dados para o gráfico de colaboradores por departamento
  const departamentosData = estatisticasColaboradores?.porDepartamento.map(dep => ({
    name: dep.nome,
    value: dep.total
  })) || [];

  // Dados para o gráfico de status de vagas
  const vagasStatusData = [
    { name: 'Abertas', value: estatisticasVagas?.abertas || 0 },
    { name: 'Encerradas', value: estatisticasVagas?.encerradas || 0 }
  ];

  // Dados para o gráfico de status de candidatos
  const candidatosStatusData = [
    { name: 'Inscritos', value: estatisticasCandidatos?.inscritos || 0 },
    { name: 'Em Análise', value: estatisticasCandidatos?.emAnalise || 0 },
    { name: 'Aprovados', value: estatisticasCandidatos?.aprovados || 0 },
    { name: 'Contratados', value: estatisticasCandidatos?.contratados || 0 },
    { name: 'Reprovados', value: estatisticasCandidatos?.reprovados || 0 }
  ];

  // Cálculo de taxa de conversão de candidatos
  const taxaConversao = estatisticasCandidatos?.total 
    ? Math.round((estatisticasCandidatos.contratados / estatisticasCandidatos.total) * 100) 
    : 0;

  return (
    <div>
      <PageHeader
        title="Dashboard RH"
        subtitle="Visão geral do departamento de Recursos Humanos"
      />

      {/* Cards principais */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <Stat>
            <StatIcon name="users" color="blue" />
            <StatLabel>Colaboradores Ativos</StatLabel>
            <StatNumber isLoading={loadingColaboradores}>
              {estatisticasColaboradores?.ativos || 0}
            </StatNumber>
          </Stat>
        </Card>

        <Card>
          <Stat>
            <StatIcon name="briefcase" color="green" />
            <StatLabel>Vagas Abertas</StatLabel>
            <StatNumber isLoading={loadingVagas}>
              {estatisticasVagas?.abertas || 0}
            </StatNumber>
          </Stat>
        </Card>

        <Card>
          <Stat>
            <StatIcon name="user-plus" color="purple" />
            <StatLabel>Candidatos Ativos</StatLabel>
            <StatNumber isLoading={loadingCandidatos}>
              {estatisticasCandidatos?.total 
                ? estatisticasCandidatos.total - (estatisticasCandidatos.contratados + estatisticasCandidatos.reprovados) 
                : 0}
            </StatNumber>
          </Stat>
        </Card>

        <Card>
          <Stat>
            <StatIcon name="clipboard-check" color="orange" />
            <StatLabel>Avaliações Pendentes</StatLabel>
            <StatNumber isLoading={loadingAvaliacoes}>
              {estatisticasAvaliacoes?.pendentes || 0}
            </StatNumber>
          </Stat>
        </Card>
      </div>

      {/* Gráficos e informações detalhadas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Distribuição por departamento */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Colaboradores por Departamento</h3>
          <div className="h-64">
            <Chart
              type="pie"
              data={departamentosData}
              isLoading={loadingColaboradores}
            />
          </div>
        </Card>

        {/* Vagas e status */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Status das Vagas</h3>
          <div className="h-64">
            <Chart
              type="bar"
              data={vagasStatusData}
              isLoading={loadingVagas}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Processo seletivo */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Processo Seletivo</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Taxa de Conversão</span>
                <span className="font-medium">{taxaConversao}%</span>
              </div>
              <ProgressBar value={taxaConversao} max={100} color="green" />
            </div>
            
            <Divider />
            
            <div className="h-48">
              <Chart
                type="bar"
                data={candidatosStatusData}
                isLoading={loadingCandidatos}
              />
            </div>
          </div>
        </Card>

        {/* Avaliações de desempenho */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Avaliações de Desempenho</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Média das Notas</span>
                <span className="font-medium">{estatisticasAvaliacoes?.mediaNotas.toFixed(1) || 0}/10</span>
              </div>
              <ProgressBar 
                value={estatisticasAvaliacoes?.mediaNotas || 0} 
                max={10} 
                color="blue" 
              />
            </div>
            
            <Divider />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-xl font-medium">
                  {estatisticasAvaliacoes?.pendentes || 0}
                  <Badge color="yellow" className="ml-2">
                    {estatisticasAvaliacoes?.total 
                      ? Math.round((estatisticasAvaliacoes.pendentes / estatisticasAvaliacoes.total) * 100) 
                      : 0}%
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Em Andamento</p>
                <p className="text-xl font-medium">
                  {estatisticasAvaliacoes?.emAndamento || 0}
                  <Badge color="blue" className="ml-2">
                    {estatisticasAvaliacoes?.total 
                      ? Math.round((estatisticasAvaliacoes.emAndamento / estatisticasAvaliacoes.total) * 100) 
                      : 0}%
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Concluídas</p>
                <p className="text-xl font-medium">
                  {estatisticasAvaliacoes?.concluidas || 0}
                  <Badge color="green" className="ml-2">
                    {estatisticasAvaliacoes?.total 
                      ? Math.round((estatisticasAvaliacoes.concluidas / estatisticasAvaliacoes.total) * 100) 
                      : 0}%
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-medium">{estatisticasAvaliacoes?.total || 0}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 