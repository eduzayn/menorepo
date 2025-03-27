import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PlusCircleIcon, TrashIcon, PencilIcon, CalendarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../../services/supabase';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';

interface MensagemAgendada {
  id?: string;
  titulo: string;
  conteudo: string;
  data_envio: Date;
  canal: string;
  destinatarios: string; // 'todos', 'segmento', ou ID do segmento
  segmento_id?: string;
  segmento_nome?: string;
  ativo: boolean;
  status: 'PENDENTE' | 'ENVIADO' | 'FALHA' | 'CANCELADO';
}

export default function AgendamentoMensagensConfig() {
  const [activeTab, setActiveTab] = useState('listagem');
  const [mensagensAgendadas, setMensagensAgendadas] = useState<MensagemAgendada[]>([]);
  const [segmentos, setSegmentos] = useState<{id: string, nome: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMensagemId, setCurrentMensagemId] = useState<string | null>(null);
  
  // Formulário para nova mensagem agendada
  const [formValues, setFormValues] = useState<MensagemAgendada>({
    titulo: '',
    conteudo: '',
    data_envio: new Date(),
    canal: 'EMAIL',
    destinatarios: 'todos',
    ativo: true,
    status: 'PENDENTE'
  });
  
  // Carregar mensagens agendadas e segmentos
  useEffect(() => {
    fetchMensagensAgendadas();
    fetchSegmentos();
  }, []);
  
  // Buscar mensagens agendadas
  const fetchMensagensAgendadas = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .order('data_inicio', { ascending: true });
      
      if (error) throw error;
      
      // Converter para formato de mensagens agendadas
      const mensagens: MensagemAgendada[] = (data || []).map(campanha => ({
        id: campanha.id,
        titulo: campanha.titulo,
        conteudo: campanha.descricao,
        data_envio: new Date(campanha.data_inicio),
        canal: campanha.metadata?.canal || 'EMAIL',
        destinatarios: campanha.metadata?.destinatarios || 'todos',
        segmento_id: campanha.metadata?.segmento_id,
        ativo: campanha.status === 'ATIVO',
        status: campanha.metadata?.status || 'PENDENTE'
      }));
      
      setMensagensAgendadas(mensagens);
    } catch (error) {
      console.error('Erro ao carregar mensagens agendadas:', error);
      toast.error('Erro ao carregar mensagens agendadas');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar segmentos
  const fetchSegmentos = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_segmentos')
        .select('id, nome');
      
      if (error) throw error;
      
      setSegmentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar segmentos:', error);
    }
  };
  
  // Editar mensagem existente
  const handleEdit = (mensagem: MensagemAgendada) => {
    // Buscar segmento nome, se necessário
    if (mensagem.destinatarios === 'segmento' && mensagem.segmento_id) {
      const segmento = segmentos.find(s => s.id === mensagem.segmento_id);
      if (segmento) {
        mensagem.segmento_nome = segmento.nome;
      }
    }
    
    setFormValues(mensagem);
    setCurrentMensagemId(mensagem.id || null);
    setIsEditing(true);
    setActiveTab('formulario');
  };
  
  // Excluir mensagem
  const handleDelete = async (id?: string) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta mensagem agendada?')) {
      try {
        setIsLoading(true);
        
        const { error } = await supabase
          .from('campanhas')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setMensagensAgendadas(prev => prev.filter(m => m.id !== id));
        toast.success('Mensagem agendada excluída com sucesso');
      } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        toast.error('Erro ao excluir mensagem agendada');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Toggle de status ativo/inativo
  const handleToggleStatus = async (id?: string, ativo?: boolean) => {
    if (!id || ativo === undefined) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('campanhas')
        .update({ status: ativo ? 'ARQUIVADO' : 'ATIVO' })
        .eq('id', id);
      
      if (error) throw error;
      
      setMensagensAgendadas(prev => prev.map(m => 
        m.id === id ? { ...m, ativo: !ativo } : m
      ));
      
      toast.success(`Mensagem agendada ${ativo ? 'desativada' : 'ativada'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da mensagem agendada');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Salvar nova mensagem ou atualizar existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formValues.titulo || !formValues.conteudo || !formValues.data_envio) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const campanhaDados = {
        titulo: formValues.titulo,
        descricao: formValues.conteudo,
        tipo: 'notificacao',
        status: formValues.ativo ? 'ATIVO' : 'ARQUIVADO',
        data_inicio: formValues.data_envio.toISOString(),
        metadata: {
          canal: formValues.canal,
          destinatarios: formValues.destinatarios,
          segmento_id: formValues.destinatarios === 'segmento' ? formValues.segmento_id : null,
          status: formValues.status
        }
      };
      
      if (isEditing && currentMensagemId) {
        const { error } = await supabase
          .from('campanhas')
          .update(campanhaDados)
          .eq('id', currentMensagemId);
        
        if (error) throw error;
        
        toast.success('Mensagem agendada atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('campanhas')
          .insert([campanhaDados]);
        
        if (error) throw error;
        
        toast.success('Mensagem agendada criada com sucesso');
      }
      
      // Limpar formulário e voltar para listagem
      setFormValues({
        titulo: '',
        conteudo: '',
        data_envio: new Date(),
        canal: 'EMAIL',
        destinatarios: 'todos',
        ativo: true,
        status: 'PENDENTE'
      });
      setIsEditing(false);
      setCurrentMensagemId(null);
      setActiveTab('listagem');
      
      // Recarregar lista
      fetchMensagensAgendadas();
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      toast.error('Erro ao salvar mensagem agendada');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar badge de status
  const renderStatusBadge = (status: string) => {
    let className = "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center";
    
    switch (status) {
      case 'PENDENTE':
        className += " bg-yellow-100 text-yellow-800";
        break;
      case 'ENVIADO':
        className += " bg-green-100 text-green-800";
        break;
      case 'FALHA':
        className += " bg-red-100 text-red-800";
        break;
      case 'CANCELADO':
        className += " bg-gray-100 text-gray-800";
        break;
      default:
        className += " bg-blue-100 text-blue-800";
    }
    
    return <span className={className}>{status}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamento de Mensagens</CardTitle>
        <CardDescription>
          Configure campanhas de mensagens programadas para envio futuro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="listagem">Mensagens Agendadas</TabsTrigger>
            <TabsTrigger value="formulario">
              {isEditing ? 'Editar Mensagem' : 'Nova Mensagem'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Mensagens Programadas</h3>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentMensagemId(null);
                  setFormValues({
                    titulo: '',
                    conteudo: '',
                    data_envio: new Date(),
                    canal: 'EMAIL',
                    destinatarios: 'todos',
                    ativo: true,
                    status: 'PENDENTE'
                  });
                  setActiveTab('formulario');
                }}
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Nova Mensagem
              </Button>
            </div>
            
            {mensagensAgendadas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma mensagem agendada. Crie agora!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mensagensAgendadas.map((mensagem) => (
                    <TableRow key={mensagem.id}>
                      <TableCell className="font-medium">{mensagem.titulo}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {format(new Date(mensagem.data_envio), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>{mensagem.canal}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {mensagem.destinatarios === 'todos' 
                            ? 'Todos' 
                            : mensagem.destinatarios === 'segmento' 
                              ? `Segmento: ${mensagem.segmento_nome || mensagem.segmento_id}` 
                              : mensagem.destinatarios}
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(mensagem.status)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={mensagem.ativo}
                          onCheckedChange={() => handleToggleStatus(mensagem.id, mensagem.ativo)}
                          disabled={mensagem.status === 'ENVIADO' || mensagem.status === 'CANCELADO'}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(mensagem)}
                          disabled={mensagem.status === 'ENVIADO'}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(mensagem.id)}
                          disabled={mensagem.status === 'ENVIADO'}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="formulario">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título da Mensagem</Label>
                  <Input
                    id="titulo"
                    value={formValues.titulo}
                    onChange={(e) => setFormValues({...formValues, titulo: e.target.value})}
                    placeholder="Ex: Boas-vindas ao curso, Lembrete de prova, etc."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="canal">Canal de Envio</Label>
                  <Select
                    value={formValues.canal}
                    onValueChange={(value) => setFormValues({...formValues, canal: value})}
                  >
                    <SelectTrigger id="canal">
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="PUSH">Notificação Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="destinatarios">Destinatários</Label>
                  <Select
                    value={formValues.destinatarios}
                    onValueChange={(value) => setFormValues({...formValues, destinatarios: value})}
                  >
                    <SelectTrigger id="destinatarios">
                      <SelectValue placeholder="Selecione os destinatários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os alunos</SelectItem>
                      <SelectItem value="segmento">Segmento específico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formValues.destinatarios === 'segmento' && (
                  <div>
                    <Label htmlFor="segmento_id">Segmento</Label>
                    <Select
                      value={formValues.segmento_id}
                      onValueChange={(value) => setFormValues({...formValues, segmento_id: value})}
                    >
                      <SelectTrigger id="segmento_id">
                        <SelectValue placeholder="Selecione um segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        {segmentos.map((segmento) => (
                          <SelectItem key={segmento.id} value={segmento.id}>
                            {segmento.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_envio">Data de Envio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formValues.data_envio && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formValues.data_envio ? (
                            format(formValues.data_envio, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formValues.data_envio}
                          onSelect={(date) => date && setFormValues({...formValues, data_envio: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="hora_envio">Hora de Envio</Label>
                    <div className="flex">
                      <Input
                        id="hora_envio"
                        type="time"
                        value={formValues.data_envio ? format(formValues.data_envio, "HH:mm") : ""}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = new Date(formValues.data_envio);
                          newDate.setHours(hours, minutes);
                          setFormValues({...formValues, data_envio: newDate});
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="conteudo">Conteúdo da Mensagem</Label>
                  <Textarea
                    id="conteudo"
                    value={formValues.conteudo}
                    onChange={(e) => setFormValues({...formValues, conteudo: e.target.value})}
                    placeholder="Digite o conteúdo da mensagem que será enviada..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formValues.ativo}
                    onCheckedChange={(checked) => setFormValues({...formValues, ativo: checked})}
                  />
                  <Label htmlFor="ativo">Ativar mensagem agendada</Label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('listagem');
                    setIsEditing(false);
                    setCurrentMensagemId(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 