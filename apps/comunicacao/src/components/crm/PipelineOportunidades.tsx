import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Oportunidade, PipelineEtapa } from '../../types/comunicacao';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { 
  CalendarIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  PencilAltIcon,
  PlusIcon,
  UserIcon,
  XIcon
} from '@heroicons/react/24/outline';
import { Spinner } from '../ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

// Mapeamento de etapas do pipeline para exibição
const etapasConfig: Record<PipelineEtapa, {nome: string, cor: string, icone: any}> = {
  'PROSPECCAO': {
    nome: 'Prospecção',
    cor: 'bg-blue-100 text-blue-800 border-blue-300',
    icone: UserIcon
  },
  'QUALIFICACAO': {
    nome: 'Qualificação',
    cor: 'bg-purple-100 text-purple-800 border-purple-300',
    icone: ChevronRightIcon
  },
  'PROPOSTA': {
    nome: 'Proposta',
    cor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icone: PencilAltIcon
  },
  'NEGOCIACAO': {
    nome: 'Negociação',
    cor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icone: CurrencyDollarIcon
  },
  'FECHAMENTO': {
    nome: 'Fechamento',
    cor: 'bg-green-100 text-green-800 border-green-300',
    icone: PlusIcon
  },
  'POS_VENDA': {
    nome: 'Pós-Venda',
    cor: 'bg-gray-100 text-gray-800 border-gray-300',
    icone: CalendarIcon
  }
};

// Componente para um card de oportunidade no pipeline
interface OportunidadeCardProps {
  oportunidade: Oportunidade;
  onEdit: (oportunidade: Oportunidade) => void;
  onDelete: (id: string) => void;
}

function OportunidadeCard({ oportunidade, onEdit, onDelete }: OportunidadeCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'oportunidade',
    item: { id: oportunidade.id, etapa: oportunidade.etapa },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const etapaConfig = etapasConfig[oportunidade.etapa];
  
  // Formatar valor para exibição
  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(oportunidade.valor || 0);

  return (
    <div 
      ref={drag}
      className={`rounded-lg border border-gray-200 bg-white shadow-sm transition-all cursor-grab
                ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={oportunidade.titulo}>
            {oportunidade.titulo}
          </h3>
          <Badge className={etapaConfig.cor}>
            {oportunidade.probabilidade}%
          </Badge>
        </div>
        
        <div className="flex flex-col space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Valor:</span>
            <span className="font-medium text-gray-900">{valorFormatado}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Fechamento:</span>
            <span>{format(new Date(oportunidade.data_estimada_fechamento), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex justify-between text-xs">
        <button 
          onClick={() => onEdit(oportunidade)} 
          className="text-indigo-600 hover:text-indigo-900"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(oportunidade.id)} 
          className="text-red-600 hover:text-red-900"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

// Componente para uma coluna do pipeline
interface PipelineColunaPProps {
  etapa: PipelineEtapa;
  oportunidades: Oportunidade[];
  onDrop: (id: string, etapa: PipelineEtapa) => void;
  onAddOportunidade: (etapa: PipelineEtapa) => void;
  onEditOportunidade: (oportunidade: Oportunidade) => void;
  onDeleteOportunidade: (id: string) => void;
}

function PipelineColuna({ 
  etapa, 
  oportunidades, 
  onDrop, 
  onAddOportunidade, 
  onEditOportunidade, 
  onDeleteOportunidade 
}: PipelineColunaPProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'oportunidade',
    drop: (item: { id: string }) => {
      onDrop(item.id, etapa);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const etapaConfig = etapasConfig[etapa];
  const EtapaIcone = etapaConfig.icone;

  // Calcular valor total da coluna
  const valorTotal = oportunidades.reduce((sum, op) => sum + (op.valor || 0), 0);
  const valorTotalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(valorTotal);

  return (
    <div 
      ref={drop}
      className={`flex-1 min-w-[250px] max-w-[280px] bg-gray-50 rounded-lg border-2 
                ${isOver ? 'border-indigo-300 shadow-lg' : 'border-transparent'}`}
    >
      <div className="p-3 border-b bg-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-md ${etapaConfig.cor.split(' ')[0]} mr-2`}>
              <EtapaIcone className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">{etapaConfig.nome}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">{oportunidades.length}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-medium text-gray-500">{valorTotalFormatado}</span>
              </TooltipTrigger>
              <TooltipContent side="top">
                Valor total das oportunidades nesta etapa
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <div className="p-2 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
        {oportunidades.map(oportunidade => (
          <OportunidadeCard 
            key={oportunidade.id}
            oportunidade={oportunidade}
            onEdit={onEditOportunidade}
            onDelete={onDeleteOportunidade}
          />
        ))}
        
        <button 
          onClick={() => onAddOportunidade(etapa)}
          className="w-full py-2 px-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors flex justify-center items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova oportunidade
        </button>
      </div>
    </div>
  );
}

// Formulário de oportunidade
interface OportunidadeFormProps {
  oportunidade?: Oportunidade;
  leadId?: string;
  onSave: (data: Partial<Oportunidade>) => void;
  onCancel: () => void;
}

function OportunidadeForm({ oportunidade, leadId, onSave, onCancel }: OportunidadeFormProps) {
  const [formData, setFormData] = useState({
    titulo: oportunidade?.titulo || '',
    descricao: oportunidade?.descricao || '',
    valor: oportunidade?.valor?.toString() || '',
    etapa: oportunidade?.etapa || 'PROSPECCAO' as PipelineEtapa,
    probabilidade: oportunidade?.probabilidade?.toString() || '10',
    data_estimada_fechamento: oportunidade?.data_estimada_fechamento 
      ? format(new Date(oportunidade.data_estimada_fechamento), 'yyyy-MM-dd')
      : format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd')
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.titulo || !formData.valor || !formData.data_estimada_fechamento) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    const valorNumerico = parseFloat(formData.valor.replace(/[^0-9.-]+/g, ''));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error('Valor inválido');
      return;
    }
    
    const probabilidade = parseInt(formData.probabilidade);
    if (isNaN(probabilidade) || probabilidade < 0 || probabilidade > 100) {
      toast.error('Probabilidade deve ser entre 0 e 100');
      return;
    }
    
    // Preparar dados
    const dadosOportunidade: Partial<Oportunidade> = {
      ...formData,
      valor: valorNumerico,
      probabilidade: probabilidade,
      lead_id: oportunidade?.lead_id || leadId,
    };
    
    onSave(dadosOportunidade);
  };

  // Atualizar formValue quando o valor é alterado (formatar para moeda)
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value) {
      value = (parseInt(value) / 100).toFixed(2);
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      value = `R$ ${value}`;
    }
    
    setFormData(prev => ({ ...prev, valor: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <Label htmlFor="titulo">Título da oportunidade *</Label>
          <Input
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleValorChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="probabilidade">Probabilidade (%)</Label>
            <Input
              id="probabilidade"
              name="probabilidade"
              type="number"
              min="0"
              max="100"
              value={formData.probabilidade}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="etapa">Etapa</Label>
            <select
              id="etapa"
              name="etapa"
              className="w-full rounded-md border border-gray-300 p-2"
              value={formData.etapa}
              onChange={handleChange}
            >
              {Object.entries(etapasConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="data_estimada_fechamento">Data estimada de fechamento *</Label>
            <Input
              id="data_estimada_fechamento"
              name="data_estimada_fechamento"
              type="date"
              value={formData.data_estimada_fechamento}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {oportunidade ? 'Atualizar' : 'Criar'} Oportunidade
        </Button>
      </div>
    </form>
  );
}

// Componente principal do Pipeline
interface PipelineOportunidadesProps {
  leadId?: string;
}

export function PipelineOportunidades({ leadId }: PipelineOportunidadesProps) {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [oportunidadeAtual, setOportunidadeAtual] = useState<Oportunidade | undefined>();
  const [etapaSelecionada, setEtapaSelecionada] = useState<PipelineEtapa | undefined>();

  // Carregar oportunidades
  useEffect(() => {
    const carregarOportunidades = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase.from('oportunidades').select('*');
        
        if (leadId) {
          query = query.eq('lead_id', leadId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setOportunidades(data || []);
      } catch (error) {
        console.error('Erro ao carregar oportunidades:', error);
        toast.error('Erro ao carregar oportunidades');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarOportunidades();
  }, [leadId]);

  // Função para atualizar etapa de uma oportunidade (drag & drop)
  const handleOportunidadeDrop = async (id: string, novaEtapa: PipelineEtapa) => {
    try {
      const oportunidade = oportunidades.find(op => op.id === id);
      if (!oportunidade || oportunidade.etapa === novaEtapa) return;
      
      // Atualizar localmente primeiro (para UI responsiva)
      setOportunidades(prevOps => 
        prevOps.map(op => op.id === id ? { ...op, etapa: novaEtapa } : op)
      );
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('oportunidades')
        .update({ etapa: novaEtapa })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Oportunidade movida com sucesso');
    } catch (error) {
      console.error('Erro ao mover oportunidade:', error);
      toast.error('Erro ao mover oportunidade');
      
      // Reverter alteração local em caso de erro
      setOportunidades(prevOps => [...prevOps]);
    }
  };

  // Função para adicionar nova oportunidade
  const handleAddOportunidade = (etapa: PipelineEtapa) => {
    setEtapaSelecionada(etapa);
    setOportunidadeAtual(undefined);
    setModalOpen(true);
  };

  // Função para editar uma oportunidade
  const handleEditOportunidade = (oportunidade: Oportunidade) => {
    setOportunidadeAtual(oportunidade);
    setEtapaSelecionada(undefined);
    setModalOpen(true);
  };

  // Função para excluir uma oportunidade
  const handleDeleteOportunidade = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      return;
    }
    
    try {
      // Atualizar localmente primeiro (para UI responsiva)
      setOportunidades(prevOps => prevOps.filter(op => op.id !== id));
      
      // Excluir no banco de dados
      const { error } = await supabase
        .from('oportunidades')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Oportunidade excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir oportunidade:', error);
      toast.error('Erro ao excluir oportunidade');
      
      // Recarregar oportunidades em caso de erro
      const { data } = await supabase.from('oportunidades').select('*');
      setOportunidades(data || []);
    }
  };

  // Função para salvar oportunidade (nova ou edição)
  const handleSaveOportunidade = async (data: Partial<Oportunidade>) => {
    try {
      let result;
      
      if (oportunidadeAtual) {
        // Atualizar existente
        result = await supabase
          .from('oportunidades')
          .update(data)
          .eq('id', oportunidadeAtual.id)
          .select()
          .single();
          
        if (result.error) throw result.error;
        
        setOportunidades(prevOps => 
          prevOps.map(op => op.id === oportunidadeAtual.id ? result.data : op)
        );
        
        toast.success('Oportunidade atualizada com sucesso');
      } else {
        // Criar nova
        const etapa = etapaSelecionada || 'PROSPECCAO';
        result = await supabase
          .from('oportunidades')
          .insert({ ...data, etapa })
          .select()
          .single();
          
        if (result.error) throw result.error;
        
        setOportunidades(prevOps => [...prevOps, result.data]);
        
        toast.success('Oportunidade criada com sucesso');
      }
      
      setModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
      toast.error('Erro ao salvar oportunidade');
    }
  };

  // Agrupar oportunidades por etapa
  const oportunidadesPorEtapa: Record<PipelineEtapa, Oportunidade[]> = {
    'PROSPECCAO': [],
    'QUALIFICACAO': [],
    'PROPOSTA': [],
    'NEGOCIACAO': [],
    'FECHAMENTO': [],
    'POS_VENDA': []
  };
  
  oportunidades.forEach(op => {
    if (op.etapa in oportunidadesPorEtapa) {
      oportunidadesPorEtapa[op.etapa].push(op);
    }
  });

  // Cálculo de valor total do pipeline
  const valorTotal = oportunidades.reduce((sum, op) => sum + (op.valor || 0), 0);
  const valorTotalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valorTotal);
  
  // Cálculo de valor ponderado (valor * probabilidade / 100)
  const valorPonderado = oportunidades.reduce((sum, op) => sum + ((op.valor || 0) * (op.probabilidade / 100)), 0);
  const valorPonderadoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valorPonderado);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pipeline de Oportunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Total de oportunidades</div>
              <div className="text-2xl font-bold">{oportunidades.length}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Valor total</div>
              <div className="text-2xl font-bold">{valorTotalFormatado}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Valor ponderado</div>
              <div className="text-2xl font-bold">{valorPonderadoFormatado}</div>
              <div className="text-xs text-gray-400">Baseado na probabilidade de fechamento</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DndProvider backend={HTML5Backend}>
        <div className="flex space-x-3 overflow-x-auto pb-6">
          {(Object.keys(oportunidadesPorEtapa) as PipelineEtapa[]).map(etapa => (
            <PipelineColuna 
              key={etapa}
              etapa={etapa}
              oportunidades={oportunidadesPorEtapa[etapa]}
              onDrop={handleOportunidadeDrop}
              onAddOportunidade={handleAddOportunidade}
              onEditOportunidade={handleEditOportunidade}
              onDeleteOportunidade={handleDeleteOportunidade}
            />
          ))}
        </div>
      </DndProvider>
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {oportunidadeAtual ? 'Editar' : 'Nova'} Oportunidade
            </DialogTitle>
          </DialogHeader>
          
          <OportunidadeForm 
            oportunidade={oportunidadeAtual}
            leadId={leadId}
            onSave={handleSaveOportunidade}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 