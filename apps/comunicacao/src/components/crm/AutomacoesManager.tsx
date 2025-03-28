import { useState, useEffect } from 'react';
import { useAutomacoes } from '../../hooks/useAutomacoes';
import { Automacao, AutomacaoTrigger, AutomacaoAcao } from '../../types/comunicacao';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

// Definições para exibição amigável das opções
const triggerOptions: Record<AutomacaoTrigger, string> = {
  'LEAD_CRIADO': 'Lead criado',
  'STATUS_ALTERADO': 'Status alterado',
  'PONTUACAO_ATINGIDA': 'Pontuação atingida',
  'TEMPO_INATIVO': 'Tempo inativo',
  'INTERACAO_RECEBIDA': 'Interação recebida'
};

const acaoOptions: Record<AutomacaoAcao, string> = {
  'ENVIAR_EMAIL': 'Enviar e-mail',
  'ENVIAR_SMS': 'Enviar SMS',
  'ATRIBUIR_RESPONSAVEL': 'Atribuir responsável',
  'MUDAR_STATUS': 'Mudar status',
  'ADICIONAR_TAREFA': 'Adicionar tarefa',
  'AGENDAR_REUNIAO': 'Agendar reunião'
};

interface AutomacoesManagerProps {
  leadId?: string; // Opcional: para mostrar automações específicas para um lead
}

export function AutomacoesManager({ leadId }: AutomacoesManagerProps) {
  // Estado para automações e formulário
  const [selectedAutomacao, setSelectedAutomacao] = useState<Automacao | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<Partial<Automacao>>({
    nome: '',
    descricao: '',
    ativo: true,
    trigger: 'LEAD_CRIADO',
    condicoes: {},
    acoes: [],
    criado_por: 'sistema' // Esse valor deveria vir do contexto de autenticação
  });
  
  // Usar o hook de automações
  const { 
    automacoes,
    isLoading,
    error,
    fetchAutomacoes,
    createAutomacao,
    updateAutomacao,
    deleteAutomacao,
    toggleAutomacaoStatus,
    executarAutomacaoManual
  } = useAutomacoes();
  
  // Carregar automações
  useEffect(() => {
    fetchAutomacoes();
  }, []);
  
  // Filtrar automações para o lead específico, se informado
  const automacoesFiltradas = leadId 
    ? automacoes.filter(a => !a.segmento_id || a.segmento_id === leadId)
    : automacoes;
    
  // Abrir formulário para criar nova automação
  const handleAddNew = () => {
    setSelectedAutomacao(null);
    setFormValues({
      nome: '',
      descricao: '',
      ativo: true,
      trigger: 'LEAD_CRIADO',
      condicoes: {},
      acoes: [],
      criado_por: 'sistema'
    });
    setIsFormOpen(true);
  };
  
  // Abrir formulário para editar automação existente
  const handleEdit = (automacao: Automacao) => {
    setSelectedAutomacao(automacao);
    setFormValues(automacao);
    setIsFormOpen(true);
  };
  
  // Salvar automação (criar nova ou atualizar existente)
  const handleSave = async () => {
    try {
      if (!formValues.nome) {
        toast.error('O nome da automação é obrigatório');
        return;
      }
      
      if (!formValues.acoes || formValues.acoes.length === 0) {
        toast.error('Adicione pelo menos uma ação');
        return;
      }
      
      if (selectedAutomacao) {
        // Atualizar automação existente
        await updateAutomacao(selectedAutomacao.id, formValues);
      } else {
        // Criar nova automação
        await createAutomacao(formValues as Omit<Automacao, 'id' | 'criado_at' | 'atualizado_at'>);
      }
      
      setIsFormOpen(false);
      fetchAutomacoes();
    } catch (err) {
      console.error('Erro ao salvar automação:', err);
    }
  };
  
  // Excluir automação
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta automação?')) {
      try {
        await deleteAutomacao(id);
      } catch (err) {
        console.error('Erro ao excluir automação:', err);
      }
    }
  };
  
  // Alternar status (ativar/desativar)
  const handleToggleStatus = async (id: string, ativo: boolean) => {
    try {
      await toggleAutomacaoStatus(id, !ativo);
      fetchAutomacoes();
    } catch (err) {
      console.error('Erro ao alterar status da automação:', err);
    }
  };
  
  // Executar automação manualmente
  const handleExecutarManual = async (automacaoId: string, targetLeadId: string) => {
    try {
      if (!targetLeadId) {
        toast.error('Selecione um lead para executar a automação');
        return;
      }
      
      const result = await executarAutomacaoManual(automacaoId, targetLeadId);
      
      if (result.success) {
        toast.success(`Automação executada com sucesso: ${result.processed} ações processadas`);
      } else {
        toast.error('Erro ao executar automação');
      }
    } catch (err) {
      console.error('Erro ao executar automação:', err);
      toast.error('Erro ao executar automação');
    }
  };
  
  // Funções para manipular ações no formulário
  const addAcao = () => {
    setFormValues(prev => ({
      ...prev,
      acoes: [...(prev.acoes || []), {
        tipo: 'ENVIAR_EMAIL',
        parametros: {},
        intervalo: 0
      }]
    }));
  };
  
  const updateAcao = (index: number, field: string, value: any) => {
    setFormValues(prev => {
      const acoes = [...(prev.acoes || [])];
      acoes[index] = {
        ...acoes[index],
        [field]: value
      };
      return { ...prev, acoes };
    });
  };
  
  const updateAcaoParametro = (index: number, param: string, value: any) => {
    setFormValues(prev => {
      const acoes = [...(prev.acoes || [])];
      acoes[index] = {
        ...acoes[index],
        parametros: {
          ...(acoes[index].parametros || {}),
          [param]: value
        }
      };
      return { ...prev, acoes };
    });
  };
  
  const removeAcao = (index: number) => {
    setFormValues(prev => {
      const acoes = [...(prev.acoes || [])];
      acoes.splice(index, 1);
      return { ...prev, acoes };
    });
  };
  
  // Funções para manipular condições no formulário
  const updateCondicao = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      condicoes: {
        ...(prev.condicoes || {}),
        [field]: value
      }
    }));
  };
  
  // Renderizar o formulário de automação
  const renderForm = () => {
    if (!isFormOpen) return null;
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{selectedAutomacao ? 'Editar Automação' : 'Nova Automação'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
              <TabsTrigger value="condicoes">Condições</TabsTrigger>
              <TabsTrigger value="acoes">Ações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Automação</Label>
                <Input 
                  id="nome" 
                  value={formValues.nome || ''} 
                  onChange={e => setFormValues(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Enviar e-mail de boas-vindas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  value={formValues.descricao || ''} 
                  onChange={e => setFormValues(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o objetivo desta automação..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trigger">Gatilho</Label>
                <Select 
                  value={formValues.trigger} 
                  onValueChange={value => setFormValues(prev => ({ ...prev, trigger: value as AutomacaoTrigger }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gatilho" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(triggerOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ativo" 
                  checked={formValues.ativo} 
                  onCheckedChange={checked => setFormValues(prev => ({ ...prev, ativo: checked }))}
                />
                <Label htmlFor="ativo">Automação ativa</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="condicoes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status do Lead</Label>
                <Select 
                  value={formValues.condicoes?.status || ''} 
                  onValueChange={value => updateCondicao('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Qualquer status</SelectItem>
                    <SelectItem value="NOVO">Novo</SelectItem>
                    <SelectItem value="EM_CONTATO">Em Contato</SelectItem>
                    <SelectItem value="QUALIFICADO">Qualificado</SelectItem>
                    <SelectItem value="CONVERTIDO">Convertido</SelectItem>
                    <SelectItem value="PERDIDO">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scoreMin">Pontuação Mínima</Label>
                <Input 
                  id="scoreMin" 
                  type="number" 
                  value={formValues.condicoes?.scoreMin || ''} 
                  onChange={e => updateCondicao('scoreMin', parseInt(e.target.value))}
                  placeholder="Qualquer pontuação"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origem">Origem do Lead</Label>
                <Input 
                  id="origem" 
                  value={formValues.condicoes?.origem || ''} 
                  onChange={e => updateCondicao('origem', e.target.value)}
                  placeholder="Qualquer origem"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="acoes" className="space-y-4">
              {(formValues.acoes || []).map((acao, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Ação {index + 1}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeAcao(index)}
                      className="text-red-500 h-8 w-8 p-0"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`acao-${index}`}>Tipo de Ação</Label>
                      <Select 
                        value={acao.tipo} 
                        onValueChange={value => updateAcao(index, 'tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(acaoOptions).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Campos específicos por tipo de ação */}
                    {acao.tipo === 'ENVIAR_EMAIL' && (
                      <>
                        <div className="space-y-1">
                          <Label htmlFor={`assunto-${index}`}>Assunto</Label>
                          <Input 
                            id={`assunto-${index}`} 
                            value={acao.parametros?.assunto || ''} 
                            onChange={e => updateAcaoParametro(index, 'assunto', e.target.value)}
                            placeholder="Assunto do e-mail"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`corpo-${index}`}>Corpo</Label>
                          <Textarea 
                            id={`corpo-${index}`} 
                            value={acao.parametros?.corpo || ''} 
                            onChange={e => updateAcaoParametro(index, 'corpo', e.target.value)}
                            placeholder="Conteúdo do e-mail"
                            rows={3}
                          />
                        </div>
                      </>
                    )}
                    
                    {acao.tipo === 'ENVIAR_SMS' && (
                      <div className="space-y-1">
                        <Label htmlFor={`mensagem-${index}`}>Mensagem</Label>
                        <Textarea 
                          id={`mensagem-${index}`} 
                          value={acao.parametros?.mensagem || ''} 
                          onChange={e => updateAcaoParametro(index, 'mensagem', e.target.value)}
                          placeholder="Texto da mensagem SMS"
                          rows={2}
                        />
                      </div>
                    )}
                    
                    {/* Intervalo antes da próxima ação */}
                    <div className="space-y-1">
                      <Label htmlFor={`intervalo-${index}`}>Intervalo (segundos)</Label>
                      <Input 
                        id={`intervalo-${index}`} 
                        type="number" 
                        value={acao.intervalo || 0} 
                        onChange={e => updateAcao(index, 'intervalo', parseInt(e.target.value))}
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500">Tempo antes de executar a próxima ação</p>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button 
                onClick={addAcao} 
                variant="outline" 
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Ação
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Automação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Renderizar lista de automações
  const renderAutomacoesList = () => {
    if (isLoading && automacoes.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando automações...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          Erro ao carregar automações: {error.message}
        </div>
      );
    }
    
    if (automacoesFiltradas.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Nenhuma automação encontrada. Crie uma nova automação para começar.
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {automacoesFiltradas.map(automacao => (
          <Card key={automacao.id} className="overflow-hidden">
            <div className={`h-1.5 ${automacao.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{automacao.nome}</h3>
                  <p className="text-gray-500 text-sm mt-1">{automacao.descricao}</p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(automacao)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500"
                    onClick={() => handleDelete(automacao.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge 
                  variant="outline" 
                  className={automacao.ativo ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
                >
                  {automacao.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {triggerOptions[automacao.trigger]}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {automacao.acoes.length} {automacao.acoes.length === 1 ? 'ação' : 'ações'}
                </Badge>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`status-${automacao.id}`} 
                    checked={automacao.ativo}
                    onCheckedChange={() => handleToggleStatus(automacao.id, automacao.ativo)}
                  />
                  <Label htmlFor={`status-${automacao.id}`}>
                    {automacao.ativo ? 'Ativada' : 'Desativada'}
                  </Label>
                </div>
                
                {leadId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExecutarManual(automacao.id, leadId)}
                    className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Executar agora
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Automações</h2>
          <p className="text-gray-500">Gerencie ações automáticas para leads</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={fetchAutomacoes}
            className="flex items-center"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
          <Button onClick={handleAddNew} className="flex items-center">
            <PlusIcon className="h-4 w-4 mr-1" />
            Nova Automação
          </Button>
        </div>
      </div>
      
      {renderAutomacoesList()}
      {renderForm()}
    </div>
  );
} 