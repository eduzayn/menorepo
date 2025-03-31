import React, { useState } from 'react';
import { Input, Button, Select } from '@edunexia/ui-components';

// Tipo para status de lead
export type LeadStatus = 'NOVO' | 'EM_CONTATO' | 'QUALIFICADO' | 'CONVERTIDO' | 'PERDIDO';
export type SortField = 'nome' | 'data_criacao' | 'status' | 'ultima_interacao';
export type SortOrder = 'asc' | 'desc';

export interface LeadFiltersProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: LeadStatus | '') => void;
  onSort: (field: SortField, order: SortOrder) => void;
}

const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export function LeadFilters({ onSearch, onStatusFilter, onSort }: LeadFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [sortField, setSortField] = useState<SortField>('data_criacao');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as LeadStatus | '';
    setStatus(value);
    onStatusFilter(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortField;
    setSortField(value);
    onSort(value, sortOrder);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOrder;
    setSortOrder(value);
    onSort(sortField, value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon />
        </div>
        <Input
          type="text"
          placeholder="Buscar leads por nome, email ou telefone..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <Select
            placeholder="Filtrar por status"
            value={status}
            onChange={handleStatusChange}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'NOVO', label: 'Novo' },
              { value: 'EM_CONTATO', label: 'Em contato' },
              { value: 'QUALIFICADO', label: 'Qualificado' },
              { value: 'CONVERTIDO', label: 'Convertido' },
              { value: 'PERDIDO', label: 'Perdido' }
            ]}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <Select
            placeholder="Ordenar por"
            value={sortField}
            onChange={handleSortChange}
            options={[
              { value: 'nome', label: 'Nome' },
              { value: 'data_criacao', label: 'Data de criação' },
              { value: 'status', label: 'Status' },
              { value: 'ultima_interacao', label: 'Última interação' }
            ]}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <Select
            placeholder="Ordem"
            value={sortOrder}
            onChange={handleOrderChange}
            options={[
              { value: 'asc', label: 'Crescente' },
              { value: 'desc', label: 'Decrescente' }
            ]}
          />
        </div>
        
        <Button
          onClick={handleSearch}
          className="md:ml-auto"
        >
          Buscar
        </Button>
      </div>
    </div>
  );
} 