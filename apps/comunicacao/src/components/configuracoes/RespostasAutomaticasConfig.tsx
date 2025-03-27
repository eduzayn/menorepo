import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PlusCircleIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAutomacoes } from '../../hooks/useAutomacoes';
import { toast } from 'sonner';

interface RespostaAutomatica {
  id?: string;
  nome: string;
  gatilho: string;
  mensagem: string;
  condicoes: {
    canal?: string;
    palavrasChave?: string[];
    segmento?: string;
  };
  ativo: boolean;
}

export default function RespostasAutomaticasConfig() {
  const [activeTab, setActiveTab] = useState('listagem');
  const [respostas, setRespostas] = useState<RespostaAutomatica[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRespostaId, setCurrentRespostaId] = useState<string | null>(null);
  
  const { automacoes, createAutomacao, updateAutomacao, deleteAutomacao, toggleAutomacaoStatus, isLoading } = useAutomacoes();
  
  // Formulário para nova resposta automática
  const [formValues, setFormValues] = useState<RespostaAutomatica>({
    nome: '',
    gatilho: 'mensagem_recebida',
    mensagem: '',
    condicoes: {
      canal: 'todos',
      palavrasChave: [],
    },
    ativo: true
  });
  
  // Carregar dados existentes
  useEffect(() => {
    const automacoesFiltradas = automacoes.filter(a => 
      a.acoes.some(acao => acao.tipo === 'ENVIAR_EMAIL' || acao.tipo === 'ENVIAR_SMS')
    );
    
    // Converter automações para formato de respostas automáticas
    const respostasConvertidas: RespostaAutomatica[] = automacoesFiltradas.map(a => {
      const acaoResposta = a.acoes.find(acao => 
        acao.tipo === 'ENVIAR_EMAIL' || acao.tipo === 'ENVIAR_SMS'
      );
      
      return {
        id: a.id,
        nome: a.nome,
        gatilho: a.trigger === 'INTERACAO_RECEBIDA' ? 'mensagem_recebida' : 'tempo_inativo',
        mensagem: acaoResposta?.parametros.mensagem || acaoResposta?.parametros.assunto || '',
        condicoes: {
          canal: a.condicoes.canal || 'todos',
          palavrasChave: a.condicoes.palavrasChave || [],
          segmento: a.condicoes.segmento_id
        },
        ativo: a.ativo
      };
    });
    
    setRespostas(respostasConvertidas);
  }, [automacoes]);
  
  // Editar resposta existente
  const handleEdit = (resposta: RespostaAutomatica) => {
    setFormValues(resposta);
    setCurrentRespostaId(resposta.id || null);
    setIsEditing(true);
    setActiveTab('formulario');
  };
  
  // Excluir resposta
  const handleDelete = async (id?: string) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta resposta automática?')) {
      try {
        await deleteAutomacao(id);
        toast.success('Resposta automática excluída com sucesso');
      } catch (error) {
        console.error('Erro ao excluir resposta:', error);
        toast.error('Erro ao excluir resposta automática');
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
      toast.error('Erro ao alterar status da resposta automática');
    }
  };
  
  // Salvar nova resposta ou atualizar existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formValues.nome || !formValues.mensagem) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      // Converter para formato de automação
      const automacaoData = {
        nome: formValues.nome,
        descricao: `Resposta automática: ${formValues.nome}`,
        ativo: formValues.ativo,
        trigger: formValues.gatilho === 'mensagem_recebida' ? 'INTERACAO_RECEBIDA' : 'TEMPO_INATIVO',
        condicoes: {
          canal: formValues.condicoes.canal !== 'todos' ? formValues.condicoes.canal : undefined,
          palavrasChave: formValues.condicoes.palavrasChave,
          segmento_id: formValues.condicoes.segmento
        },
        acoes: [
          {
            tipo: formValues.condicoes.canal === 'EMAIL' ? 'ENVIAR_EMAIL' : 'ENVIAR_SMS',
            parametros: {
              assunto: formValues.gatilho === 'mensagem_recebida' ? 'Resposta automática' : 'Lembrete',
              mensagem: formValues.mensagem
            },
            intervalo: 0
          }
        ]
      };
      
      if (isEditing && currentRespostaId) {
        await updateAutomacao(currentRespostaId, automacaoData);
        toast.success('Resposta automática atualizada com sucesso');
      } else {
        await createAutomacao({
          ...automacaoData,
          criado_por: 'sistema'
        });
        toast.success('Resposta automática criada com sucesso');
      }
      
      // Limpar formulário e voltar para listagem
      setFormValues({
        nome: '',
        gatilho: 'mensagem_recebida',
        mensagem: '',
        condicoes: {
          canal: 'todos',
          palavrasChave: [],
        },
        ativo: true
      });
      setIsEditing(false);
      setCurrentRespostaId(null);
      setActiveTab('listagem');
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      toast.error('Erro ao salvar resposta automática');
    }
  };
  
  // Adicionar palavra-chave
  const handleAddPalavraChave = () => {
    const palavraChave = prompt('Digite uma palavra-chave:');
    if (palavraChave) {
      setFormValues(prev => ({
        ...prev,
        condicoes: {
          ...prev.condicoes,
          palavrasChave: [...(prev.condicoes.palavrasChave || []), palavraChave]
        }
      }));
    }
  };
  
  // Remover palavra-chave
  const handleRemovePalavraChave = (index: number) => {
    setFormValues(prev => {
      const palavrasChave = [...(prev.condicoes.palavrasChave || [])];
      palavrasChave.splice(index, 1);
      return {
        ...prev,
        condicoes: {
          ...prev.condicoes,
          palavrasChave
        }
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respostas Automáticas</CardTitle>
        <CardDescription>
          Configure mensagens pré-programadas para responder automaticamente a interações específicas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="listagem">Respostas Configuradas</TabsTrigger>
            <TabsTrigger value="formulario">
              {isEditing ? 'Editar Resposta' : 'Nova Resposta'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Respostas Automáticas</h3>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentRespostaId(null);
                  setFormValues({
                    nome: '',
                    gatilho: 'mensagem_recebida',
                    mensagem: '',
                    condicoes: {
                      canal: 'todos',
                      palavrasChave: [],
                    },
                    ativo: true
                  });
                  setActiveTab('formulario');
                }}
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Nova Resposta
              </Button>
            </div>
            
            {respostas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma resposta automática configurada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Gatilho</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {respostas.map((resposta) => (
                    <TableRow key={resposta.id}>
                      <TableCell className="font-medium">{resposta.nome}</TableCell>
                      <TableCell>
                        {resposta.gatilho === 'mensagem_recebida' 
                          ? 'Mensagem recebida' 
                          : 'Tempo de inatividade'}
                      </TableCell>
                      <TableCell>
                        {resposta.condicoes?.canal === 'todos' 
                          ? 'Todos' 
                          : resposta.condicoes?.canal}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={resposta.ativo}
                          onCheckedChange={() => handleToggleStatus(resposta.id, resposta.ativo)}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(resposta)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(resposta.id)}
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
                  <Label htmlFor="nome">Nome da Resposta Automática</Label>
                  <Input
                    id="nome"
                    value={formValues.nome}
                    onChange={(e) => setFormValues({...formValues, nome: e.target.value})}
                    placeholder="Ex: Boas-vindas, Agradecimento, etc."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="gatilho">Gatilho</Label>
                  <Select
                    value={formValues.gatilho}
                    onValueChange={(value) => setFormValues({...formValues, gatilho: value})}
                  >
                    <SelectTrigger id="gatilho">
                      <SelectValue placeholder="Selecione o gatilho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensagem_recebida">Mensagem recebida</SelectItem>
                      <SelectItem value="tempo_inativo">Tempo de inatividade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="canal">Canal</Label>
                  <Select
                    value={formValues.condicoes.canal || 'todos'}
                    onValueChange={(value) => setFormValues({
                      ...formValues, 
                      condicoes: {...formValues.condicoes, canal: value}
                    })}
                  >
                    <SelectTrigger id="canal">
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os canais</SelectItem>
                      <SelectItem value="CHAT">Chat</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Palavras-chave</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formValues.condicoes.palavrasChave || []).map((palavra, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span>{palavra}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePalavraChave(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={handleAddPalavraChave}>
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    Adicionar palavra-chave
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    value={formValues.mensagem}
                    onChange={(e) => setFormValues({...formValues, mensagem: e.target.value})}
                    placeholder="Digite a mensagem que será enviada automaticamente..."
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
                  <Label htmlFor="ativo">Ativar resposta automática</Label>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('listagem');
                    setIsEditing(false);
                    setCurrentRespostaId(null);
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