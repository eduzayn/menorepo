import React from 'react';
import { LeadStatus } from '../../types/comunicacao';

export interface LeadFiltersProps {
  onSearch: (term: string) => void;
  onStatusChange: (status: LeadStatus | null) => void;
  onSortChange: (field: 'criado_at' | 'atualizado_at' | 'ultima_interacao') => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

export function LeadFilters({
  onSearch,
  onStatusChange,
  onSortChange,
  onOrderChange,
}: LeadFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-wrap gap-4">
        {/* Busca */}
        <div className="w-full md:w-auto flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar lead
          </label>
          <input
            type="text"
            id="search"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nome, email ou telefone..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="w-full md:w-auto">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => onStatusChange(e.target.value as LeadStatus || null)}
            defaultValue=""
          >
            <option value="">Todos</option>
            <option value="NOVO">Novos</option>
            <option value="EM_CONTATO">Em Contato</option>
            <option value="QUALIFICADO">Qualificados</option>
            <option value="CONVERTIDO">Convertidos</option>
            <option value="PERDIDO">Perdidos</option>
          </select>
        </div>

        {/* Ordenação */}
        <div className="w-full md:w-auto">
          <label htmlFor="sortField" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sortField"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => onSortChange(e.target.value as 'criado_at' | 'atualizado_at' | 'ultima_interacao')}
            defaultValue="ultima_interacao"
          >
            <option value="ultima_interacao">Última interação</option>
            <option value="criado_at">Data de criação</option>
            <option value="atualizado_at">Data de atualização</option>
          </select>
        </div>

        {/* Direção da ordenação */}
        <div className="w-full md:w-auto">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Direção
          </label>
          <select
            id="sortOrder"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
            defaultValue="desc"
          >
            <option value="desc">Mais recentes primeiro</option>
            <option value="asc">Mais antigos primeiro</option>
          </select>
        </div>
      </div>
    </div>
  );
} 