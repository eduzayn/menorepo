import { useState } from 'react';
import { 
  Button,
  Card,
  Input,
  Select,
  Badge
} from '@edunexia/ui-components';
import { Search, Filter, X, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { StatusCobranca } from '../../types/financeiro';

interface FiltrosCobrancaProps {
  onFiltrar: (filtros: FiltroCobranca) => void;
  statusAtivo?: StatusCobranca;
  dataInicio?: string;
  dataFim?: string;
  termo?: string;
}

export interface FiltroCobranca {
  status?: StatusCobranca;
  data_inicio?: string;
  data_fim?: string;
  termo?: string;
}

const statusOptions: Array<{ value: StatusCobranca; label: string }> = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'em_processamento', label: 'Em Processamento' },
  { value: 'estornado', label: 'Estornado' },
  { value: 'parcial', label: 'Pago Parcial' }
];

export function FiltrosCobranca({
  onFiltrar,
  statusAtivo,
  dataInicio,
  dataFim,
  termo = ''
}: FiltrosCobrancaProps) {
  const [status, setStatus] = useState<StatusCobranca | undefined>(statusAtivo);
  const [dataInicioState, setDataInicio] = useState<string>(dataInicio || '');
  const [dataFimState, setDataFim] = useState<string>(dataFim || '');
  const [termoBusca, setTermoBusca] = useState<string>(termo);
  
  const limparFiltros = () => {
    setStatus(undefined);
    setDataInicio('');
    setDataFim('');
    setTermoBusca('');
    
    onFiltrar({
      status: undefined,
      data_inicio: undefined,
      data_fim: undefined,
      termo: undefined
    });
  };
  
  const aplicarFiltros = () => {
    onFiltrar({
      status,
      data_inicio: dataInicioState || undefined,
      data_fim: dataFimState || undefined,
      termo: termoBusca || undefined
    });
  };
  
  // Renderiza um chip de filtro ativo com opção de remoção
  const renderFiltroAtivo = (label: string, onClick: () => void) => (
    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
      {label}
      <X size={14} className="cursor-pointer" onClick={onClick} />
    </Badge>
  );
  
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID ou aluno..."
              className="pl-8"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <Select
            placeholder="Status da cobrança"
            value={status}
            onValueChange={(value) => setStatus(value as StatusCobranca)}
          />
        </div>
        
        <div className="w-full md:w-1/4 flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-gray-400" />
          <div className="flex-1 flex gap-2">
            <Input
              type="date"
              placeholder="Data início"
              value={dataInicioState}
              onChange={(e) => setDataInicio(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Data fim"
              value={dataFimState}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={aplicarFiltros} size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={limparFiltros}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
      
      {/* Área de filtros ativos */}
      <div className="flex flex-wrap gap-2">
        {status && renderFiltroAtivo(
          `Status: ${statusOptions.find(opt => opt.value === status)?.label}`,
          () => setStatus(undefined)
        )}
        
        {dataInicioState && renderFiltroAtivo(
          `De: ${format(new Date(dataInicioState), 'dd/MM/yyyy', { locale: ptBR })}`,
          () => setDataInicio('')
        )}
        
        {dataFimState && renderFiltroAtivo(
          `Até: ${format(new Date(dataFimState), 'dd/MM/yyyy', { locale: ptBR })}`,
          () => setDataFim('')
        )}
        
        {termoBusca && renderFiltroAtivo(
          `Busca: ${termoBusca}`,
          () => setTermoBusca('')
        )}
      </div>
    </Card>
  );
} 