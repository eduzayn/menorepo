// Armazenamento em memória para sessões ativas do WhatsApp
// Em produção, considere usar Redis ou outro armazenamento persistente

export const activeSessions = new Map();

// Em produção, você pode adicionar métodos adicionais para gerenciar sessões:
// - Persistência (salvar/carregar sessões)
// - Reconexão automática
// - Limpeza de sessões inativas
// - Estatísticas de uso

export const getActiveSessionsCount = () => {
  return activeSessions.size;
};

export const getAllSessionIds = () => {
  return Array.from(activeSessions.keys());
};

// Função utilitária para obter a última atividade de uma sessão
export const getSessionLastActivity = (sessionId: string) => {
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  return session._lastActivity || null;
};

// Em ambientes de produção, considere implementar:
// - Mecanismo de heartbeat para verificar saúde das sessões
// - Função para recuperar/restaurar sessões após reinicialização do servidor
// - Rotação de sessões para balanceamento de carga
// - Logs detalhados de atividades por sessão 