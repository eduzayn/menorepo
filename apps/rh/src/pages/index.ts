// Placeholder temporário para páginas que ainda serão implementadas
// Esses componentes serão substituídos por implementações reais

import React from 'react';

// Componente de página temporário para desenvolvimento
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
    <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-center text-gray-800 dark:text-white">
        {title}
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300">
        Esta página está em desenvolvimento e será implementada em breve.
      </p>
    </div>
  </div>
);

// Exporta os componentes de página (temporários)
export const DashboardPage = () => <PlaceholderPage title="Dashboard de RH" />;
export const VagasPage = () => <PlaceholderPage title="Gestão de Vagas" />;
export const NovaVagaPage = () => <PlaceholderPage title="Criar Nova Vaga" />;
export const DetalhesVagaPage = () => <PlaceholderPage title="Detalhes da Vaga" />;
export const CandidatosPage = () => <PlaceholderPage title="Lista de Candidatos" />;
export const DetalhesCandidatoPage = () => <PlaceholderPage title="Perfil do Candidato" />;
export const ColaboradoresPage = () => <PlaceholderPage title="Gestão de Colaboradores" />;
export const DetalhesColaboradorPage = () => <PlaceholderPage title="Perfil do Colaborador" />;
export const NovoColaboradorPage = () => <PlaceholderPage title="Cadastrar Novo Colaborador" />;
export const AvaliacoesPage = () => <PlaceholderPage title="Avaliações de Desempenho" />;
export const DetalhesAvaliacaoPage = () => <PlaceholderPage title="Detalhes da Avaliação" />;
export const NovaAvaliacaoPage = () => <PlaceholderPage title="Nova Avaliação" />;
export const RedesSociaisPage = () => <PlaceholderPage title="Integração com Redes Sociais" />;
export const NotFoundPage = () => <PlaceholderPage title="Página Não Encontrada (404)" />; 