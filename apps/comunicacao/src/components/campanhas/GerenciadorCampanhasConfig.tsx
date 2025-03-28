import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  PlusCircleIcon, 
  TrashIcon, 
  PencilIcon, 
  ChartBarIcon, 
  EnvelopeIcon,
  UsersIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGrupos } from '../../hooks/useGrupos';
import { supabase } from '../../services/supabase';

interface Campanha {
  id?: string;
  titulo: string;
  descricao: string;
  status: 'rascunho' | 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  data_inicio: string;
  data_fim?: string;
  canal: 'email' | 'whatsapp' | 'sms' | 'push';
  conteudo: string;
  destinatarios: {
    tipo: 'segmento' | 'grupo' | 'individual';
    id?: string;
    nome?: string;
  }
  metricas?: {
    enviados: number;
    entregues: number;
    abertos: number;
    clicados: number;
    respondidos: number;
    falhas: number;
  }
}

export default function GerenciadorCampanhasConfig() {
  const [activeTab, setActiveTab] = useState('listagem');
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [usuariosSegmentados, setUsuariosSegmentados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCampanhaId, setCurrentCampanhaId] = useState<string | null>(null);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [segmentos, setSegmentos] = useState<any[]>([]);

  // Formulário para nova campanha
  const [formValues, setFormValues] = useState<Campanha>({
    titulo: '',
    descricao: '',
    status: 'rascunho',
    data_inicio: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    canal: 'email',
    conteudo: '',
    destinatarios: {
      tipo: 'grupo'
    },
    metricas: {
      enviados: 0,
      entregues: 0,
      abertos: 0,
      clicados: 0,
      respondidos: 0,
      falhas: 0
    }
  });

  const { grupos: gruposQuery } = useGrupos();
  
  // Carregar grupos e segmentos
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setIsLoading(true);
        
        // Carregar grupos
        if (gruposQuery.data) {
          setGrupos(gruposQuery.data);
        }
        
        // Carregar segmentos
        const { data: segmentosData, error: segmentosError } = await supabase
          .from('lead_segmentos')
          .select('*');
          
        if (segmentosError) throw segmentosError;
        setSegmentos(segmentosData || []);
        
        // Carregar campanhas
        const { data: campanhasData, error: campanhasError } = await supabase
          .from('comunicacao_campanhas')
          .select('*')
          .order('data_inicio', { ascending: false });
          
        if (campanhasError) throw campanhasError;
        
        setCampanhas(campanhasData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDados();
  }, [gruposQuery.data]);
  
  // Carregar destinatários ao mudar tipo de seleção
  useEffect(() => {
    if (formValues.destinatarios.tipo === 'segmento' && formValues.destinatarios.id) {
      fetchUsuariosPorSegmento(formValues.destinatarios.id);
    } else if (formValues.destinatarios.tipo === 'grupo' && formValues.destinatarios.id) {
      fetchUsuariosPorGrupo(formValues.destinatarios.id);
    }
  }, [formValues.destinatarios]);
  
  const fetchUsuariosPorSegmento = async (segmentoId: string) => {
    try {
      // Buscar usuários do segmento (implementação depende da estrutura do banco)
      const { data, error } = await supabase
        .from('leads')
        .select('id, nome, email')
        .eq('segmento_id', segmentoId);
        
      if (error) throw error;
      
      setUsuariosSegmentados(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários do segmento:', error);
      toast.error('Erro ao carregar usuários do segmento');
    }
  };
  
  const fetchUsuariosPorGrupo = async (grupoId: string) => {
    try {
      // Buscar participantes do grupo
      const { data, error } = await supabase
        .from('grupo_participantes')
        .select('usuario_id, profiles(id, nome, email)')
        .eq('grupo_id', grupoId);
        
      if (error) throw error;
      
      // Transformar dados para formato padronizado
      const usuarios = (data || []).map(item => ({
        id: item.profiles.id,
        nome: item.profiles.nome,
        email: item.profiles.email
      }));
      
      setUsuariosSegmentados(usuarios);
    } catch (error) {
      console.error('Erro ao carregar usuários do grupo:', error);
      toast.error('Erro ao carregar usuários do grupo');
    }
  };
  
  // Editar campanha existente
  const handleEdit = (campanha: Campanha) => {
    setFormValues({
      ...campanha,
      data_inicio: campanha.data_inicio.substring(0, 16) // Formato yyyy-MM-ddTHH:mm
    });
    setCurrentCampanhaId(campanha.id || null);
    setIsEditing(true);
    setActiveTab('formulario');
  };
  
  // Excluir campanha
  const handleDelete = async (id?: string) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        const { error } = await supabase
          .from('comunicacao_campanhas')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success('Campanha excluída com sucesso');
        
        // Atualizar estado local
        setCampanhas(prev => prev.filter(campanha => campanha.id !== id));
      } catch (error) {
        console.error('Erro ao excluir campanha:', error);
        toast.error('Erro ao excluir campanha');
      }
    }
  };
  
  // Ver métricas da campanha
  const handleVerMetricas = (campanha: Campanha) => {
    // Poderia abrir um modal ou navegar para uma página específica
    toast.info(`Métricas da campanha "${campanha.titulo}" seriam exibidas aqui.`);
  };
  
  // Salvar campanha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formValues.titulo || !formValues.conteudo || !formValues.data_inicio) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (!formValues.destinatarios.id) {
      toast.error('Selecione os destinatários da campanha');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Preparar dados para salvar
      const campanhaData = {
        ...formValues,
        metricas: formValues.metricas || {
          enviados: 0,
          entregues: 0,
          abertos: 0,
          clicados: 0,
          respondidos: 0,
          falhas: 0
        }
      };
      
      let result;
      
      if (isEditing && currentCampanhaId) {
        // Atualizar campanha existente
        const { data, error } = await supabase
          .from('comunicacao_campanhas')
          .update(campanhaData)
          .eq('id', currentCampanhaId)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        toast.success('Campanha atualizada com sucesso');
      } else {
        // Criar nova campanha
        const { data, error } = await supabase
          .from('comunicacao_campanhas')
          .insert(campanhaData)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        toast.success('Campanha criada com sucesso');
      }
      
      // Atualizar a lista de campanhas
      if (isEditing) {
        setCampanhas(prev => prev.map(item => 
          item.id === result.id ? result : item
        ));
      } else {
        setCampanhas(prev => [result, ...prev]);
      }
      
      // Limpar formulário e voltar para listagem
      resetForm();
      setActiveTab('listagem');
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      toast.error('Erro ao salvar campanha');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resetar formulário
  const resetForm = () => {
    setFormValues({
      titulo: '',
      descricao: '',
      status: 'rascunho',
      data_inicio: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      canal: 'email',
      conteudo: '',
      destinatarios: {
        tipo: 'grupo'
      },
      metricas: {
        enviados: 0,
        entregues: 0,
        abertos: 0,
        clicados: 0,
        respondidos: 0,
        falhas: 0
      }
    });
    setIsEditing(false);
    setCurrentCampanhaId(null);
    setUsuariosSegmentados([]);
  };
  
  // Renderizar badge de status
  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      rascunho: { label: 'Rascunho', className: 'bg-gray-200 text-gray-800' },
      agendada: { label: 'Agendada', className: 'bg-blue-100 text-blue-800' },
      em_andamento: { label: 'Em andamento', className: 'bg-yellow-100 text-yellow-800' },
      concluida: { label: 'Concluída', className: 'bg-green-100 text-green-800' },
      cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800' }
    };
    
    const { label, className } = statusMap[status] || { label: status, className: 'bg-gray-200' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Campanhas</CardTitle>
        <CardDescription>
          Configure, agende e monitore o desempenho das suas campanhas de comunicação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="listagem">Campanhas</TabsTrigger>
            <TabsTrigger value="formulario">
              {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Campanhas</h3>
              <Button
                onClick={() => {
                  resetForm();
                  setActiveTab('formulario');
                }}
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
            
            {campanhas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma campanha encontrada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campanhas.map((campanha) => (
                    <TableRow key={campanha.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campanha.titulo}</div>
                          <div className="text-sm text-gray-500">
                            {campanha.descricao?.substring(0, 50)}
                            {campanha.descricao && campanha.descricao.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{campanha.canal}</TableCell>
                      <TableCell>{renderStatusBadge(campanha.status)}</TableCell>
                      <TableCell>
                        {format(new Date(campanha.data_inicio), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {campanha.destinatarios?.nome || 
                         (campanha.destinatarios?.tipo === 'grupo' ? 'Grupo' : 'Segmento')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerMetricas(campanha)}
                        >
                          <ChartBarIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(campanha)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(campanha.id)}
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="titulo">Título da Campanha</Label>
                  <Input
                    id="titulo"
                    value={formValues.titulo}
                    onChange={(e) => setFormValues({...formValues, titulo: e.target.value})}
                    placeholder="Ex: Campanha de Boas-vindas, Lembrete de Matrícula..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formValues.status}
                    onValueChange={(value: any) => setFormValues({...formValues, status: value})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="data_inicio">Data de Início</Label>
                  <Input
                    id="data_inicio"
                    type="datetime-local"
                    value={formValues.data_inicio}
                    onChange={(e) => setFormValues({...formValues, data_inicio: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="canal">Canal de Envio</Label>
                  <Select
                    value={formValues.canal}
                    onValueChange={(value: any) => setFormValues({...formValues, canal: value})}
                  >
                    <SelectTrigger id="canal">
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Notificação Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formValues.descricao}
                    onChange={(e) => setFormValues({...formValues, descricao: e.target.value})}
                    placeholder="Descrição ou objetivo da campanha"
                    rows={2}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="conteudo">Conteúdo da Mensagem</Label>
                  <Textarea
                    id="conteudo"
                    value={formValues.conteudo}
                    onChange={(e) => setFormValues({...formValues, conteudo: e.target.value})}
                    placeholder="Digite o conteúdo da mensagem que será enviada"
                    rows={5}
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Você pode usar variáveis como {'{nome}'}, {'{email}'} que serão substituídas por dados do destinatário.
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="mb-2">
                    <Label>Destinatários</Label>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <Label htmlFor="destinatario-tipo">Selecionar por</Label>
                        <Select
                          value={formValues.destinatarios.tipo}
                          onValueChange={(value: any) => setFormValues({
                            ...formValues,
                            destinatarios: { tipo: value }
                          })}
                        >
                          <SelectTrigger id="destinatario-tipo">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grupo">Grupo/Lista</SelectItem>
                            <SelectItem value="segmento">Segmento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formValues.destinatarios.tipo === 'grupo' && (
                        <div>
                          <Label htmlFor="grupo-id">Selecionar Grupo</Label>
                          <Select
                            value={formValues.destinatarios.id}
                            onValueChange={(value: any) => setFormValues({
                              ...formValues,
                              destinatarios: { 
                                tipo: 'grupo',
                                id: value,
                                nome: grupos.find(g => g.id === value)?.nome
                              }
                            })}
                          >
                            <SelectTrigger id="grupo-id">
                              <SelectValue placeholder="Selecione um grupo" />
                            </SelectTrigger>
                            <SelectContent>
                              {grupos.map((grupo) => (
                                <SelectItem key={grupo.id} value={grupo.id}>
                                  {grupo.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {formValues.destinatarios.tipo === 'segmento' && (
                        <div>
                          <Label htmlFor="segmento-id">Selecionar Segmento</Label>
                          <Select
                            value={formValues.destinatarios.id}
                            onValueChange={(value: any) => setFormValues({
                              ...formValues,
                              destinatarios: { 
                                tipo: 'segmento',
                                id: value,
                                nome: segmentos.find(s => s.id === value)?.nome
                              }
                            })}
                          >
                            <SelectTrigger id="segmento-id">
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
                      
                      {usuariosSegmentados.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <Label>Pré-visualização de Destinatários</Label>
                            <span className="text-sm text-blue-600">
                              {usuariosSegmentados.length} usuários
                            </span>
                          </div>
                          <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-2">
                            <ul className="space-y-1">
                              {usuariosSegmentados.slice(0, 5).map((usuario) => (
                                <li key={usuario.id} className="text-sm py-1 px-2 bg-gray-50 rounded">
                                  {usuario.nome} ({usuario.email})
                                </li>
                              ))}
                              {usuariosSegmentados.length > 5 && (
                                <li className="text-sm py-1 px-2 text-center text-gray-500">
                                  + {usuariosSegmentados.length - 5} outros usuários
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setActiveTab('listagem');
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Campanha' : 'Criar Campanha')}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 