import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Lead, LeadStatus } from '../../types/comunicacao';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Configuração das colunas do Kanban (por status)
const statusConfig: Record<LeadStatus, { nome: string, cor: string, icone: any, ordem: number }> = {
  'NOVO': {
    nome: 'Novos',
    cor: 'bg-blue-500',
    icone: UserIcon,
    ordem: 1
  },
  'EM_CONTATO': {
    nome: 'Em Contato',
    cor: 'bg-yellow-500',
    icone: PhoneIcon,
    ordem: 2
  },
  'QUALIFICADO': {
    nome: 'Qualificados',
    cor: 'bg-green-500',
    icone: CheckCircleIcon,
    ordem: 3
  },
  'PERDIDO': {
    nome: 'Perdidos',
    cor: 'bg-red-500',
    icone: XCircleIcon,
    ordem: 4
  },
  'CONVERTIDO': {
    nome: 'Convertidos',
    cor: 'bg-purple-500',
    icone: CurrencyDollarIcon,
    ordem: 5
  }
};

// Componente de card de lead
interface LeadCardProps {
  lead: Lead;
}

function LeadCard({ lead }: LeadCardProps) {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'lead',
    item: { id: lead.id, status: lead.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const ultimaInteracaoFormatada = lead.ultima_interacao
    ? format(new Date(lead.ultima_interacao), 'dd/MM/yyyy', { locale: ptBR })
    : 'Sem interações';

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all cursor-grab
                  ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => navigate(`/crm/leads/${lead.id}`)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-medium text-gray-900 truncate max-w-[180px]" title={lead.nome}>
            {lead.nome}
          </h3>
          <Badge variant="outline" className="text-xs">
            {lead.canal_origem || 'Direto'}
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center text-gray-600">
            <EnvelopeIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate" title={lead.email}>{lead.email}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <PhoneIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span className="truncate">{lead.telefone}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Última interação:</span>
            <span className="text-gray-900">{ultimaInteracaoFormatada}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Engajamento:</span>
            <div className="flex items-center">
              <div className="w-24 h-1.5 bg-gray-200 rounded overflow-hidden">
                <div 
                  className="h-full bg-indigo-500" 
                  style={{width: `${(lead.engajamento / 10) * 100}%`}}
                ></div>
              </div>
              <span className="ml-1.5 text-gray-900">{lead.engajamento}/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de coluna do Kanban
interface KanbanColunaProps {
  status: LeadStatus;
  leads: Lead[];
  onDrop: (id: string, status: LeadStatus) => void;
}

function KanbanColuna({ status, leads, onDrop }: KanbanColunaProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'lead',
    drop: (item: { id: string }) => {
      onDrop(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const config = statusConfig[status];
  const StatusIcon = config.icone;

  return (
    <div 
      ref={drop}
      className={`flex-1 min-w-[280px] bg-gray-50 rounded-lg border-2 
                ${isOver ? 'border-indigo-300 shadow-lg' : 'border-transparent'}`}
    >
      <div className={`${config.cor} text-white p-3 rounded-t-lg flex justify-between items-center`}>
        <div className="flex items-center">
          <StatusIcon className="h-4 w-4 mr-2" />
          <h3 className="font-semibold text-sm">{config.nome}</h3>
        </div>
        <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded text-xs font-medium">
          {leads.length}
        </span>
      </div>
      
      <div className="p-2 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        
        {leads.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            Nenhum lead nesta categoria
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal do Kanban
export function LeadsKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar leads
  useEffect(() => {
    const carregarLeads = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('criado_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setLeads(data || []);
      } catch (error) {
        console.error('Erro ao carregar leads:', error);
        toast.error('Erro ao carregar leads');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarLeads();
  }, []);

  // Atualizar status de um lead (drag & drop)
  const handleLeadDrop = async (id: string, novoStatus: LeadStatus) => {
    try {
      const lead = leads.find(l => l.id === id);
      if (!lead || lead.status === novoStatus) return;
      
      // Atualizar localmente primeiro (para UI responsiva)
      setLeads(prevLeads => 
        prevLeads.map(l => l.id === id ? { ...l, status: novoStatus } : l)
      );
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: novoStatus,
          atualizado_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Lead movido para ${statusConfig[novoStatus].nome}`);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
      
      // Reverter alteração local em caso de erro
      setLeads(prevLeads => [...prevLeads]);
    }
  };

  // Agrupar leads por status
  const leadsPorStatus: Record<LeadStatus, Lead[]> = {
    'NOVO': [],
    'EM_CONTATO': [],
    'QUALIFICADO': [],
    'PERDIDO': [],
    'CONVERTIDO': []
  };
  
  leads.forEach(lead => {
    if (lead.status in leadsPorStatus) {
      leadsPorStatus[lead.status].push(lead);
    } else {
      // Fallback para leads com status inválido
      leadsPorStatus['NOVO'].push(lead);
    }
  });

  // Ordenar status para exibição
  const statusOrdenados = Object.keys(statusConfig).sort(
    (a, b) => statusConfig[a as LeadStatus].ordem - statusConfig[b as LeadStatus].ordem
  ) as LeadStatus[];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-3 overflow-x-auto pb-6">
        {statusOrdenados.map(status => (
          <KanbanColuna 
            key={status}
            status={status}
            leads={leadsPorStatus[status]}
            onDrop={handleLeadDrop}
          />
        ))}
      </div>
    </DndProvider>
  );
} 