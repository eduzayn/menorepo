// Client principal
export { createApiClient } from './client';
export { ApiProvider, useApi } from './context';

// Hooks e utilitários
export { useQuery, useMutation, useQueryClient } from './hooks';
export { handleApiError } from './utils';

// Adaptadores de serviços específicos
export * from './services';

// Tipos
export * from './types'; 