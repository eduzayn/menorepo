/**
 * Definições de tipos comuns utilizados em todo o sistema
 */

/**
 * Representa uma entidade base no sistema
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Tipo para representar um timestamp ISO
 */
export type ISODateString = string;

/**
 * Filtros de data comuns
 */
export interface DateRangeFilter {
  startDate?: ISODateString;
  endDate?: ISODateString;
}

/**
 * Coordenadas de geolocalização
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Informações básicas de contato
 */
export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
}

/**
 * Opções genéricas para seleção em formulários
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Opções de ordenação para listagens
 */
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  direction: SortDirection;
} 