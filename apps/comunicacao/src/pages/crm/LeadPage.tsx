import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Lead, Interacao } from '../../types/comunicacao';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Spinner } from '../../components/ui/spinner';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PipelineOportunidades } from '../../components/crm/PipelineOportunidades';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  TagIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InteracoesHistorico } from '../../components/crm/InteracoesHistorico';
import { NovaInteracaoForm } from '../../components/crm/NovaInteracaoForm';
import { AutomacoesManager } from '../../components/crm/AutomacoesManager';
import { ScoreCard } from '../../components/crm/ScoreCard';
import { toast } from 'sonner';

export function LeadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('detalhes');

  // Carregar dados do lead
  useEffect(() => {
    const carregarLead = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setLead(data as Lead);
        
        // Carregar interações
        const { data: interacoesData, error: interacoesError } = await supabase
          .from('interacoes')
          .select('*')
          .eq('participante_id', id)
          .eq('participante_tipo', 'LEAD')
          .order('data', { ascending: false });
          
        if (interacoesError) throw interacoesError;
        
        setInteracoes(interacoesData as Interacao[]);
      } catch (error) {
        console.error('Erro ao carregar lead:', error);
        toast.error('Não foi possível carregar os dados do lead.');
        navigate('/crm/leads');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarLead();
  }, [id, navigate]);

  const handleNovaInteracao = async (novaInteracao: Omit<Interacao, 'id' | 'participante_id' | 'participante_tipo' | 'criado_at'>) => {
    if (!lead) return;
    
    try {
      const { data, error } = await supabase
        .from('interacoes')
        .insert({
          ...novaInteracao,
          participante_id: lead.id,
          participante_tipo: 'LEAD',
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Atualizar data de última interação do lead
      await supabase
        .from('leads')
        .update({ ultima_interacao: new Date().toISOString() })
        .eq('id', lead.id);
      
      toast.success('Interação registrada com sucesso');
      setInteracoes(prev => [data as Interacao, ...prev]);
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
      toast.error('Erro ao registrar interação');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Lead não encontrado</h2>
        <p className="text-gray-500 mt-2">O lead solicitado não existe ou foi removido.</p>
        <Button className="mt-4" onClick={() => navigate('/crm/leads')}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  // Função para formatar status com cor
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'NOVO': 'bg-blue-100 text-blue-800 border-blue-300',
      'EM_CONTATO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'QUALIFICADO': 'bg-green-100 text-green-800 border-green-300',
      'DESQUALIFICADO': 'bg-red-100 text-red-800 border-red-300',
      'CONVERTIDO': 'bg-purple-100 text-purple-800 border-purple-300',
      'INATIVO': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    
    const statusLabel: Record<string, string> = {
      'NOVO': 'Novo',
      'EM_CONTATO': 'Em Contato',
      'QUALIFICADO': 'Qualificado',
      'DESQUALIFICADO': 'Desqualificado',
      'CONVERTIDO': 'Convertido',
      'INATIVO': 'Inativo',
    };
    
    const colorClass = statusMap[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={colorClass}>
        {statusLabel[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{lead.nome}</h1>
          <div className="flex space-x-3 mt-2">
            {getStatusBadge(lead.status)}
            <Badge variant="outline" className="flex items-center">
              <TagIcon className="h-3.5 w-3.5 mr-1" />
              {lead.canal_origem || 'Não especificado'}
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="interacoes">Interações</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="automacoes">Automações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalhes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="flex items-center mt-1">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                        {lead.email}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                    <p className="flex items-center mt-1">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${lead.telefone}`} className="text-blue-600 hover:underline">
                        {lead.telefone}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Última interação</h3>
                    <p className="flex items-center mt-1">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {lead.ultima_interacao 
                        ? format(new Date(lead.ultima_interacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        : 'Sem interações'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Engajamento</h3>
                    <p className="flex items-center mt-1">
                      <ChartBarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {lead.engajamento}/10
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Detalhes Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fonte de aquisição</h3>
                      <p className="mt-1">{lead.fonte_aquisicao || 'Não especificado'}</p>
                    </div>
                    
                    {lead.tags && lead.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {lead.observacoes && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Observações</h3>
                        <div className="p-3 bg-gray-50 rounded-md mt-1 border text-sm whitespace-pre-wrap">
                          {lead.observacoes}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <ScoreCard lead={lead} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="interacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova Interação</CardTitle>
            </CardHeader>
            <CardContent>
              <NovaInteracaoForm onSubmit={handleNovaInteracao} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
            </CardHeader>
            <CardContent>
              <InteracoesHistorico interacoes={interacoes} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oportunidades" className="space-y-4">
          <PipelineOportunidades leadId={lead.id} />
        </TabsContent>

        <TabsContent value="automacoes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Automações Personalizadas</CardTitle>
                <p className="text-sm text-gray-500">Configure ações automáticas para este lead</p>
              </div>
              <BoltIcon className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <AutomacoesManager leadId={lead.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 