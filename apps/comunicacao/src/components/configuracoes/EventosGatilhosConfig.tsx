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
import { BellIcon, PlusCircleIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAutomacoes } from '../../hooks/useAutomacoes';
import { toast } from 'sonner';

interface EventoGatilho {
  id?: string;
  nome: string;
  descricao: string;
  tipoEvento: 'matricula_concluida' | 'prazo_prova' | 'mensagem_nao_respondida' | 'evento_calendario' | 'aniversario_aluno';
  condicoes: {
    intervaloDias?: number;
    curso?: string;
    disciplina?: string;
    segmento?: string;
  };
  acaoMensagem: string;
  canalNotificacao: string;
  ativo: boolean;
}

// Mapeamento de tipos de evento para triggers
const eventoParaTrigger = {
  matricula_concluida: 'LEAD_CRIADO',
  prazo_prova: 'TEMPO_INATIVO',
  mensagem_nao_respondida: 'INTERACAO_RECEBIDA',
  evento_calendario: 'TEMPO_INATIVO',
  aniversario_aluno: 'TEMPO_INATIVO'
};

// Tipos de eventos disponíveis
const tiposEventos = [
  { id: 'matricula_concluida', nome: 'Matrícula concluída', descricao: 'Enviar mensagem quando um aluno finalizar a matrícula' },
  { id: 'prazo_prova', nome: 'Prazo de prova próximo', descricao: 'Lembrar alunos sobre provas próximas do vencimento' },
  { id: 'mensagem_nao_respondida', nome: 'Mensagem não respondida', descricao: 'Notificar equipe quando mensagens não forem respondidas em determinado tempo' },
  { id: 'evento_calendario', nome: 'Evento importante', descricao: 'Notificar sobre eventos importantes no calendário acadêmico' },
  { id: 'aniversario_aluno', nome: 'Aniversário de aluno', descricao: 'Enviar mensagem de felicitações no aniversário do aluno' }
];

export default function EventosGatilhosConfig() {
  const [activeTab, setActiveTab] = useState('listagem');
  const [eventosGatilhos, setEventosGatilhos] = useState<EventoGatilho[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventoId, setCurrentEventoId] = useState<string | null>(null);
  
  const { automacoes, createAutomacao, updateAutomacao, deleteAutomacao, toggleAutomacaoStatus, isLoading } = useAutomacoes();
  
  // Formulário para novo evento gatilho
  const [formValues, setFormValues] = useState<EventoGatilho>({
    nome: '',
    descricao: '',
    tipoEvento: 'matricula_concluida',
    condicoes: {
      intervaloDias: 1,
    },
    acaoMensagem: '',
    canalNotificacao: 'EMAIL',
    ativo: true
  });
  
  // Carregar automações existentes no formato de eventos gatilhos
  useEffect(() => {
    const automacoesTriggers = automacoes.filter(a => 
      Object.values(eventoParaTrigger).includes(a.trigger as any)
    );
    
    // Converter automações para formato de eventos gatilhos
    const eventosConvertidos: EventoGatilho[] = automacoesTriggers.map(a => {
      // Determinar tipo de evento baseado no trigger e condições
      let tipoEvento: EventoGatilho['tipoEvento'] = 'matricula_concluida';
      
      if (a.trigger === 'LEAD_CRIADO') {
        tipoEvento = 'matricula_concluida';
      } else if (a.trigger === 'INTERACAO_RECEBIDA') {
        tipoEvento = 'mensagem_nao_respondida';
      } else if (a.trigger === 'TEMPO_INATIVO') {
        if (a.nome.toLowerCase().includes('prova')) {
          tipoEvento = 'prazo_prova';
        } else if (a.nome.toLowerCase().includes('aniversário')) {
          tipoEvento = 'aniversario_aluno';
        } else {
          tipoEvento = 'evento_calendario';
        }
      }
      
      // Buscar ação de mensagem
      const acaoMensagem = a.acoes.find(acao => 
        acao.tipo === 'ENVIAR_EMAIL' || acao.tipo === 'ENVIAR_SMS'
      )?.parametros.mensagem || '';
      
      // Determinar canal de notificação
      const canalNotificacao = a.acoes.find(acao => 
        acao.tipo === 'ENVIAR_EMAIL' || acao.tipo === 'ENVIAR_SMS'
      )?.tipo === 'ENVIAR_EMAIL' ? 'EMAIL' : 'SMS';
      
      return {
        id: a.id,
        nome: a.nome,
        descricao: a.descricao,
        tipoEvento,
        condicoes: {
          intervaloDias: a.condicoes.intervaloDias || 1,
          curso: a.condicoes.curso,
          disciplina: a.condicoes.disciplina,
          segmento: a.condicoes.segmento_id
        },
        acaoMensagem,
        canalNotificacao,
        ativo: a.ativo
      };
    });
    
    setEventosGatilhos(eventosConvertidos);
  }, [automacoes]);
  
  // Editar evento existente
  const handleEdit = (evento: EventoGatilho) => {
    setFormValues(evento);
    setCurrentEventoId(evento.id || null);
    setIsEditing(true);
    setActiveTab('formulario');
  };
  
  // Excluir evento
  const handleDelete = async (id?: string) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir este evento gatilho?')) {
      try {
        await deleteAutomacao(id);
        toast.success('Evento gatilho excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
        toast.error('Erro ao excluir evento gatilho');
      }
    }
  };
  
  // Toggle de status ativo/inativo
  const handleToggleStatus = async (id?: string, ativo?: boolean) => {
    if (!id || ativo === undefined) return;
    
    try {
      await toggleAutomacaoStatus(id, !ativo);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do evento gatilho');
    }
  };
  
  // Salvar novo evento ou atualizar existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formValues.nome || !formValues.acaoMensagem) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      // Converter para formato de automação
      const automacaoData = {
        nome: formValues.nome,
        descricao: formValues.descricao,
        ativo: formValues.ativo,
        trigger: eventoParaTrigger[formValues.tipoEvento] as any,
        condicoes: {
          intervaloDias: formValues.condicoes.intervaloDias,
          curso: formValues.condicoes.curso,
          disciplina: formValues.condicoes.disciplina,
          segmento_id: formValues.condicoes.segmento
        },
        acoes: [
          {
            tipo: formValues.canalNotificacao === 'EMAIL' ? 'ENVIAR_EMAIL' : 'ENVIAR_SMS',
            parametros: {
              assunto: `Notificação: ${formValues.nome}`,
              mensagem: formValues.acaoMensagem
            },
            intervalo: 0
          }
        ]
      };
      
      if (isEditing && currentEventoId) {
        await updateAutomacao(currentEventoId, automacaoData);
        toast.success('Evento gatilho atualizado com sucesso');
      } else {
        await createAutomacao({
          ...automacaoData,
          criado_por: 'sistema'
        });
        toast.success('Evento gatilho criado com sucesso');
      }
      
      // Limpar formulário e voltar para listagem
      setFormValues({
        nome: '',
        descricao: '',
        tipoEvento: 'matricula_concluida',
        condicoes: {
          intervaloDias: 1,
        },
        acaoMensagem: '',
        canalNotificacao: 'EMAIL',
        ativo: true
      });
      setIsEditing(false);
      setCurrentEventoId(null);
      setActiveTab('listagem');
    } catch (error) {
      console.error('Erro ao salvar evento gatilho:', error);
      toast.error('Erro ao salvar evento gatilho');
    }
  };
  
  // Obter descrição para o tipo de evento
  const getEventoDescricao = (tipo: string) => {
    return tiposEventos.find(t => t.id === tipo)?.descricao || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gatilhos Baseados em Eventos</CardTitle>
        <CardDescription>
          Configure automações que são acionadas quando eventos específicos ocorrem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="listagem">Gatilhos Configurados</TabsTrigger>
            <TabsTrigger value="formulario">
              {isEditing ? 'Editar Gatilho' : 'Novo Gatilho'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Eventos e Gatilhos</h3>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentEventoId(null);
                  setFormValues({
                    nome: '',
                    descricao: '',
                    tipoEvento: 'matricula_concluida',
                    condicoes: {
                      intervaloDias: 1,
                    },
                    acaoMensagem: '',
                    canalNotificacao: 'EMAIL',
                    ativo: true
                  });
                  setActiveTab('formulario');
                }}
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Novo Gatilho
              </Button>
            </div>
            
            {eventosGatilhos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum gatilho configurado. Configure agora!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo de Evento</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventosGatilhos.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-medium">
                        <div>
                          {evento.nome}
                          <p className="text-xs text-gray-500 mt-1">{evento.descricao}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BellIcon className="h-4 w-4 mr-2 text-blue-500" />
                          {tiposEventos.find(t => t.id === evento.tipoEvento)?.nome || evento.tipoEvento}
                        </div>
                      </TableCell>
                      <TableCell>{evento.canalNotificacao}</TableCell>
                      <TableCell>
                        <Switch
                          checked={evento.ativo}
                          onCheckedChange={() => handleToggleStatus(evento.id, evento.ativo)}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(evento)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(evento.id)}
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
                  <Label htmlFor="tipoEvento">Tipo de Evento</Label>
                  <Select
                    value={formValues.tipoEvento}
                    onValueChange={(value: any) => {
                      setFormValues({
                        ...formValues, 
                        tipoEvento: value,
                        nome: tiposEventos.find(t => t.id === value)?.nome || '',
                        descricao: getEventoDescricao(value)
                      });
                    }}
                  >
                    <SelectTrigger id="tipoEvento">
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEventos.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {getEventoDescricao(formValues.tipoEvento)}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="nome">Nome do Gatilho</Label>
                  <Input
                    id="nome"
                    value={formValues.nome}
                    onChange={(e) => setFormValues({...formValues, nome: e.target.value})}
                    placeholder="Ex: Boas-vindas ao aluno, Lembrete de prova..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formValues.descricao}
                    onChange={(e) => setFormValues({...formValues, descricao: e.target.value})}
                    placeholder="Descreva o objetivo deste gatilho..."
                    rows={2}
                  />
                </div>
                
                {(formValues.tipoEvento === 'prazo_prova' || formValues.tipoEvento === 'mensagem_nao_respondida') && (
                  <div>
                    <Label htmlFor="intervaloDias">Intervalo (em dias)</Label>
                    <Input
                      id="intervaloDias"
                      type="number"
                      min={1}
                      value={formValues.condicoes.intervaloDias || 1}
                      onChange={(e) => setFormValues({
                        ...formValues, 
                        condicoes: {
                          ...formValues.condicoes,
                          intervaloDias: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formValues.tipoEvento === 'prazo_prova' 
                        ? 'Quantos dias antes da prova o aluno será notificado' 
                        : 'Após quantos dias sem resposta a notificação será enviada'}
                    </p>
                  </div>
                )}
                
                {(formValues.tipoEvento === 'matricula_concluida' || formValues.tipoEvento === 'prazo_prova') && (
                  <div>
                    <Label htmlFor="curso">Curso (opcional)</Label>
                    <Input
                      id="curso"
                      value={formValues.condicoes.curso || ''}
                      onChange={(e) => setFormValues({
                        ...formValues, 
                        condicoes: {
                          ...formValues.condicoes,
                          curso: e.target.value
                        }
                      })}
                      placeholder="Deixe em branco para todos os cursos"
                    />
                  </div>
                )}
                
                {formValues.tipoEvento === 'prazo_prova' && (
                  <div>
                    <Label htmlFor="disciplina">Disciplina (opcional)</Label>
                    <Input
                      id="disciplina"
                      value={formValues.condicoes.disciplina || ''}
                      onChange={(e) => setFormValues({
                        ...formValues, 
                        condicoes: {
                          ...formValues.condicoes,
                          disciplina: e.target.value
                        }
                      })}
                      placeholder="Deixe em branco para todas as disciplinas"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="canalNotificacao">Canal de Notificação</Label>
                  <Select
                    value={formValues.canalNotificacao}
                    onValueChange={(value) => setFormValues({...formValues, canalNotificacao: value})}
                  >
                    <SelectTrigger id="canalNotificacao">
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
                  <Label htmlFor="acaoMensagem">Mensagem</Label>
                  <Textarea
                    id="acaoMensagem"
                    value={formValues.acaoMensagem}
                    onChange={(e) => setFormValues({...formValues, acaoMensagem: e.target.value})}
                    placeholder="Digite a mensagem que será enviada quando o evento ocorrer..."
                    rows={5}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Você pode usar variáveis como {'{nome}'}, {'{curso}'}, {'{data_prova}'} que serão substituídas pelos valores reais.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formValues.ativo}
                    onCheckedChange={(checked) => setFormValues({...formValues, ativo: checked})}
                  />
                  <Label htmlFor="ativo">Ativar este gatilho</Label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('listagem');
                    setIsEditing(false);
                    setCurrentEventoId(null);
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