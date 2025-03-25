// Este arquivo exportará todos os serviços do módulo de comunicação 
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
  getGrupos,
  getGrupo,
  criarGrupo,
  atualizarGrupo,
  excluirGrupo,
  adicionarParticipante,
  removerParticipante,
  atualizarRoleParticipante
} from './grupos';
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