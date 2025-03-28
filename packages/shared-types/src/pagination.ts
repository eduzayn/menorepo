/**
 * Definições de tipos para paginação
 */

/**
 * Opções para paginação
 */
export interface PaginationOptions {
  page: number;
  perPage: number;
}

/**
 * Filtros comuns de paginação
 */
export interface PaginationFilters extends PaginationOptions {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Metadados de paginação
 */
export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Resposta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Resposta infinita 
 */
export interface InfiniteResponse<T> {
  data: T[];
  nextCursor?: string | null;
  hasMore: boolean;
} 