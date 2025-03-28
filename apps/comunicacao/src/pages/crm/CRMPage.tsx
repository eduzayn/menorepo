import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { LeadsKanban } from '../../components/crm/LeadsKanban';
import { LeadsTable } from '../../components/crm/LeadsTable';
import { PipelineOportunidades } from '../../components/crm/PipelineOportunidades';
import { 
  ChartBarIcon, 
  UsersIcon, 
  TableCellsIcon, 
  RectangleStackIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { DadosGeraisCRM } from '../../components/crm/DadosGeraisCRM';

export function CRMPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'pipeline'>('kanban');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestão de Relacionamento</h1>
        <p className="text-gray-500 mt-1">Gerencie leads, oportunidades e relacionamentos em um só lugar</p>
      </div>
      
      <DadosGeraisCRM />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {viewMode === 'kanban' && 'Funil de Leads'}
                {viewMode === 'table' && 'Lista de Leads'}
                {viewMode === 'pipeline' && 'Pipeline de Oportunidades'}
              </CardTitle>
              <CardDescription className="mt-1">
                {viewMode === 'kanban' && 'Visualize leads organizados por status'}
                {viewMode === 'table' && 'Visualize e gerencie todos os leads em formato de tabela'}
                {viewMode === 'pipeline' && 'Gerencie oportunidades e negociações em andamento'}
              </CardDescription>
            </div>
            
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
              <button
                className={`flex items-center px-3 py-1.5 rounded text-sm ${
                  viewMode === 'kanban' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('kanban')}
              >
                <RectangleStackIcon className="h-4 w-4 mr-1.5" />
                Kanban
              </button>
              
              <button
                className={`flex items-center px-3 py-1.5 rounded text-sm ${
                  viewMode === 'table' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('table')}
              >
                <TableCellsIcon className="h-4 w-4 mr-1.5" />
                Tabela
              </button>
              
              <button
                className={`flex items-center px-3 py-1.5 rounded text-sm ${
                  viewMode === 'pipeline' 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setViewMode('pipeline')}
              >
                <CurrencyDollarIcon className="h-4 w-4 mr-1.5" />
                Pipeline
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'kanban' && <LeadsKanban />}
          {viewMode === 'table' && <LeadsTable />}
          {viewMode === 'pipeline' && <PipelineOportunidades />}
        </CardContent>
      </Card>
    </div>
  );
} 