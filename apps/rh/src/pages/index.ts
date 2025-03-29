import React from 'react';

// Importação direta das páginas implementadas
import DashboardPageComponent from './DashboardPage';
import ColaboradoresPageComponent from './ColaboradoresPage';
import NovoColaboradorPageComponent from './NovoColaboradorPage';
import DetalhesColaboradorPageComponent from './DetalhesColaboradorPage';
import VagasPageComponent from './VagasPage';
import NovaVagaPageComponent from './NovaVagaPage';
import DetalhesVagaPageComponent from './DetalhesVagaPage';
import CandidatosPageComponent from './CandidatosPage';
import NovoCandidatoPageComponent from './NovoCandidatoPage';
import DetalhesCandidatoPageComponent from './DetalhesCandidatoPage';
import AvaliacoesPageComponent from './AvaliacoesPage';
import NovaAvaliacaoPageComponent from './NovaAvaliacaoPage';
import DetalhesAvaliacaoPageComponent from './DetalhesAvaliacaoPage';

// Exportação das páginas implementadas
export const DashboardPage = DashboardPageComponent;
export const ColaboradoresPage = ColaboradoresPageComponent;
export const NovoColaboradorPage = NovoColaboradorPageComponent;
export const DetalhesColaboradorPage = DetalhesColaboradorPageComponent;
export const VagasPage = VagasPageComponent;
export const NovaVagaPage = NovaVagaPageComponent;
export const DetalhesVagaPage = DetalhesVagaPageComponent;
export const CandidatosPage = CandidatosPageComponent;
export const NovoCandidatoPage = NovoCandidatoPageComponent;
export const DetalhesCandidatoPage = DetalhesCandidatoPageComponent;
export const AvaliacoesPage = AvaliacoesPageComponent;
export const NovaAvaliacaoPage = NovaAvaliacaoPageComponent;
export const DetalhesAvaliacaoPage = DetalhesAvaliacaoPageComponent;

// Interface para o componente de placeholder
interface PlaceholderProps {
  title?: string;
}

// Componente para páginas em desenvolvimento
export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-2xl font-semibold mb-4">{title || 'Página em Desenvolvimento'}</h1>
      <p className="text-gray-600 mb-6">Esta funcionalidade está sendo implementada.</p>
    </div>
  );
};

// Páginas de placeholder específicas
export const ConfiguracoesPage: React.FC = () => <PlaceholderPage title="Configurações" />;
export const RedesSociaisPage: React.FC = () => <PlaceholderPage title="Integração com Redes Sociais" />;
export const NotFoundPage: React.FC = () => <PlaceholderPage title="Página Não Encontrada (404)" />; 