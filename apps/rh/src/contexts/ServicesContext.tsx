import React, { createContext, useContext } from 'react';
import { useApi } from '@edunexia/api-client';
import { createRhServices, RhServices } from '../services';

// Contexto para os serviços do RH
const ServicesContext = createContext<RhServices | null>(null);

// Props para o provedor de serviços
interface ServicesProviderProps {
  children: React.ReactNode;
}

/**
 * Provedor que disponibiliza os serviços de RH para a aplicação
 */
export const ServicesProvider: React.FC<ServicesProviderProps> = ({ children }) => {
  // Obtém o cliente de API do contexto global
  const apiClient = useApi();
  
  // Cria as instâncias dos serviços
  const services = createRhServices(apiClient);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

/**
 * Hook para acessar os serviços de RH em componentes
 */
export const useServices = (): RhServices => {
  const context = useContext(ServicesContext);
  
  if (!context) {
    throw new Error('useServices deve ser usado dentro de um ServicesProvider');
  }
  
  return context;
};

/**
 * Hooks individuais para cada serviço
 */
export const useVagasService = () => useServices().vagas;
export const useCandidatosService = () => useServices().candidatos;
export const useColaboradoresService = () => useServices().colaboradores;
export const useAvaliacoesService = () => useServices().avaliacoes;
export const useSocialMediaService = () => useServices().social; 