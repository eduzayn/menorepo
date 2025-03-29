import { VagasService } from './vagas';
import { CandidatosService } from './candidatos';
import { ColaboradoresService } from './colaboradores';
import { AvaliacoesService } from './avaliacoes';
import { SocialMediaService } from './social';

export {
  VagasService,
  CandidatosService,
  ColaboradoresService,
  AvaliacoesService,
  SocialMediaService
};

// Factory para criar todas as instâncias de serviços
import { ApiClient } from '@edunexia/api-client';

export const createRhServices = (apiClient: ApiClient) => {
  return {
    vagas: new VagasService(apiClient),
    candidatos: new CandidatosService(apiClient),
    colaboradores: new ColaboradoresService(apiClient),
    avaliacoes: new AvaliacoesService(apiClient),
    social: new SocialMediaService(apiClient)
  };
};

// Tipos para o contexto de serviços
export type RhServices = ReturnType<typeof createRhServices>; 