import { SupabaseClient } from '@supabase/supabase-js';
import { ColaboradoresService } from './colaboradores-service';
import { VagasService } from './vagas-service';
import { CandidatosService } from './candidatos-service';
import { AvaliacoesService } from './avaliacoes-service';

// Instância de client para todos os serviços
let supabaseClient: SupabaseClient | null = null;

// Função para inicializar o client
export function initializeClient(client: SupabaseClient) {
  supabaseClient = client;
}

// Função para obter o client atual
export function getClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Supabase client não foi inicializado. Chame initializeClient primeiro.');
  }
  return supabaseClient;
}

// Funções para instanciar os serviços
export function getColaboradoresService(): ColaboradoresService {
  return new ColaboradoresService(getClient());
}

export function getVagasService(): VagasService {
  return new VagasService(getClient());
}

export function getCandidatosService(): CandidatosService {
  return new CandidatosService(getClient());
}

export function getAvaliacoesService(): AvaliacoesService {
  return new AvaliacoesService(getClient());
}

// Re-exportar para facilitar o import
export { ColaboradoresService } from './colaboradores-service';
export { VagasService } from './vagas-service';
export { CandidatosService } from './candidatos-service';
export { AvaliacoesService } from './avaliacoes-service'; 