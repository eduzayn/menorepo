// Este arquivo exportará todos os serviços do módulo de comunicação 
export * from './comunicacao';
export { gruposService } from './grupos';
export { notificacoesService } from './notificacoes';
export * from './supabase';
export {
  getConversas,
  getConversa,
  criarConversa,
  getMensagens,
  enviarMensagem,
  getCampanhas,
  getCampanha,
  criarCampanha,
  getRespostasRapidas,
  criarRespostaRapida,
  uploadArquivo
} from './comunicacao';
export {
  subscribeToConversa,
  atualizarStatusDigitando
} from './chat';
export {
  getNotificacoes,
  getNotificacao,
  criarNotificacao,
  atualizarNotificacao,
  excluirNotificacao,
  marcarComoLida,
  getConfiguracoes,
  atualizarConfiguracoes
} from './notificacoes'; 