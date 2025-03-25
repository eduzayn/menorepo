import { useState } from 'react';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';
import type { LeadStatus } from '@/types/comunicacao';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadFiltersProps {
  onSearch: (search: string) => void;
  onStatusChange: (status: LeadStatus | null) => void;
  onSortChange: (sort: 'criado_at' | 'atualizado_at' | 'ultima_interacao') => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

export function LeadFilters({
  onSearch,
  onStatusChange,
  onSortChange,
  onOrderChange,
}: LeadFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | null>(null);
  const [sort, setSort] = useState<'criado_at' | 'atualizado_at' | 'ultima_interacao'>('ultima_interacao');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  const handleStatusChange = (value: LeadStatus | null) => {
    setStatus(value);
    onStatusChange(value);
  };

  const handleSortChange = (value: 'criado_at' | 'atualizado_at' | 'ultima_interacao') => {
    setSort(value);
    onSortChange(value);
  };

  const handleOrderChange = (value: 'asc' | 'desc') => {
    setOrder(value);
    onOrderChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Select
          value={status || ''}
          onValueChange={(value) => handleStatusChange(value as LeadStatus || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="NOVO">Novo</SelectItem>
            <SelectItem value="EM_CONTATO">Em Contato</SelectItem>
            <SelectItem value="QUALIFICADO">Qualificado</SelectItem>
            <SelectItem value="CONVERTIDO">Convertido</SelectItem>
            <SelectItem value="PERDIDO">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) => handleSortChange(value as typeof sort)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="criado_at">Data de Criação</SelectItem>
            <SelectItem value="atualizado_at">Última Atualização</SelectItem>
            <SelectItem value="ultima_interacao">Última Interação</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={order}
          onValueChange={(value) => handleOrderChange(value as 'asc' | 'desc')}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Ordem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Mais Recente</SelectItem>
            <SelectItem value="asc">Mais Antigo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 