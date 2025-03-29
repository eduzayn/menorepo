import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  FormField, 
  Input, 
  Select, 
  DatePicker 
} from '@edunexia/ui-components';
import { FilterIcon, SearchIcon } from 'lucide-react';

export interface FiltroBase {
  dataInicio?: string;
  dataFim?: string;
}

export interface FiltroContabilProps<T extends FiltroBase> {
  titulo?: string;
  filtros: T;
  onChange: (filtros: T) => void;
  onAplicar: () => void;
  isLoading?: boolean;
  campos?: Array<{
    nome: keyof T;
    tipo: 'texto' | 'data' | 'select' | 'numero';
    label: string;
    placeholder?: string;
    opcoes?: Array<{ valor: string; label: string }>;
    required?: boolean;
  }>;
  layout?: 'linha' | 'grid';
  className?: string;
}

/**
 * Componente reutilizável para filtros contábeis
 */
export function FiltroContabil<T extends FiltroBase>({
  titulo = 'Filtros',
  filtros,
  onChange,
  onAplicar,
  isLoading = false,
  campos = [],
  layout = 'grid',
  className = ''
}: FiltroContabilProps<T>) {
  // Verificar se há pelo menos campos de data de início e fim
  const temDatas = campos.some(campo => campo.nome === 'dataInicio' || campo.nome === 'dataFim');
  
  // Se não houver campos de data definidos, adicionar por padrão
  const camposFinais = temDatas ? campos : [
    {
      nome: 'dataInicio' as keyof T,
      tipo: 'data',
      label: 'Data Inicial',
      required: true
    },
    {
      nome: 'dataFim' as keyof T,
      tipo: 'data',
      label: 'Data Final',
      required: true
    },
    ...campos
  ];

  // Atualizar um campo específico
  const handleChange = (campo: keyof T, valor: any) => {
    onChange({
      ...filtros,
      [campo]: valor
    });
  };

  // Determinar quantidade de colunas com base no layout e número de campos
  const getLayoutClasses = () => {
    if (layout === 'linha') {
      return 'flex flex-wrap gap-4';
    }
    
    // Para layouts de grid, determinar número de colunas
    const numCampos = camposFinais.length;
    if (numCampos <= 2) return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    if (numCampos <= 4) return 'grid grid-cols-1 md:grid-cols-4 gap-4';
    return 'grid grid-cols-1 md:grid-cols-3 gap-4';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FilterIcon className="w-5 h-5 mr-2 text-primary" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={getLayoutClasses()}>
          {camposFinais.map((campo) => {
            switch (campo.tipo) {
              case 'data':
                return (
                  <FormField key={String(campo.nome)} label={campo.label} required={campo.required}>
                    <DatePicker
                      value={filtros[campo.nome] as string}
                      onChange={(data) => handleChange(campo.nome, data)}
                      placeholder={campo.placeholder}
                    />
                  </FormField>
                );
                
              case 'select':
                return (
                  <FormField key={String(campo.nome)} label={campo.label} required={campo.required}>
                    <Select
                      value={filtros[campo.nome] as string}
                      onChange={(valor) => handleChange(campo.nome, valor)}
                    >
                      <option value="">{campo.placeholder || "Todos"}</option>
                      {campo.opcoes?.map((opcao) => (
                        <option key={opcao.valor} value={opcao.valor}>
                          {opcao.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                );
                
              case 'numero':
                return (
                  <FormField key={String(campo.nome)} label={campo.label} required={campo.required}>
                    <Input
                      type="number"
                      value={filtros[campo.nome] as string | number}
                      onChange={(e) => handleChange(campo.nome, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
                      placeholder={campo.placeholder}
                    />
                  </FormField>
                );
                
              case 'texto':
              default:
                return (
                  <FormField key={String(campo.nome)} label={campo.label} required={campo.required}>
                    <Input
                      value={filtros[campo.nome] as string}
                      onChange={(e) => handleChange(campo.nome, e.target.value)}
                      placeholder={campo.placeholder}
                    />
                  </FormField>
                );
            }
          })}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={onAplicar} disabled={isLoading}>
            <SearchIcon className="w-4 h-4 mr-2" />
            {isLoading ? 'Buscando...' : 'Aplicar Filtros'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 