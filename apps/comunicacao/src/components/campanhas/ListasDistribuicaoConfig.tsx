import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PlusCircleIcon, TrashIcon, PencilIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import { useGrupos } from '../../hooks/useGrupos';
import { toast } from 'sonner';
import { supabase } from '../../services/supabase';

interface ListaDistribuicao {
  id?: string;
  nome: string;
  descricao: string;
  tipo: 'turma' | 'perfil' | 'interesse';
  filtros?: {
    curso?: string;
    turma?: string;
    perfil?: string;
    interesses?: string[];
  };
  participantes: any[];
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: string;
}

export default function ListasDistribuicaoConfig() {
  const [activeTab, setActiveTab] = useState('listagem');
  const [listas, setListas] = useState<ListaDistribuicao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentListaId, setCurrentListaId] = useState<string | null>(null);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>([]);
  
  const { 
    grupos, 
    criarGrupo, 
    atualizarGrupo, 
    excluirGrupo, 
    adicionarParticipante, 
    removerParticipante,
    participantes
  } = useGrupos();
  
  // Formulário para nova lista
  const [formValues, setFormValues] = useState<ListaDistribuicao>({
    nome: '',
    descricao: '',
    tipo: 'turma',
    filtros: {},
    participantes: []
  });
  
  // Buscar listas/grupos existentes
  useEffect(() => {
    if (grupos.data) {
      // Converter grupos para formato de listas de distribuição
      const listasConvertidas = (grupos.data || []).map(grupo => {
        // Determinar tipo com base no nome ou descrição
        let tipo: 'turma' | 'perfil' | 'interesse' = 'interesse';
        if (grupo.nome.toLowerCase().includes('turma') || grupo.descricao?.toLowerCase().includes('turma')) {
          tipo = 'turma';
        } else if (grupo.nome.toLowerCase().includes('perfil') || grupo.descricao?.toLowerCase().includes('perfil')) {
          tipo = 'perfil';
        }
        
        return {
          id: grupo.id,
          nome: grupo.nome,
          descricao: grupo.descricao || '',
          tipo,
          participantes: []
        };
      });
      
      setListas(listasConvertidas);
    }
  }, [grupos.data]);
  
  // Buscar usuários
  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email');
      
      if (error) throw error;
      
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar participantes do grupo
  const carregarParticipantes = async (grupoId: string) => {
    try {
      if (grupoId) {
        const participantesQuery = participantes(grupoId);
        const dados = participantesQuery.data || [];
        
        // Atualizar a lista com os participantes
        setListas(prev => prev.map(lista => 
          lista.id === grupoId 
            ? { ...lista, participantes: dados } 
            : lista
        ));
      }
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    }
  };
  
  // Carregar usuários e participantes quando iniciar
  useEffect(() => {
    fetchUsuarios();
    
    // Carregar participantes para cada lista
    listas.forEach(lista => {
      if (lista.id) {
        carregarParticipantes(lista.id);
      }
    });
  }, []);
  
  // Editar lista existente
  const handleEdit = (lista: ListaDistribuicao) => {
    setFormValues(lista);
    setCurrentListaId(lista.id || null);
    setIsEditing(true);
    setActiveTab('formulario');
  };
  
  // Excluir lista
  const handleDelete = async (id?: string) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta lista de distribuição?')) {
      try {
        await excluirGrupo.mutateAsync(id);
        toast.success('Lista excluída com sucesso');
        
        // Atualizar estado local
        setListas(prev => prev.filter(lista => lista.id !== id));
      } catch (error) {
        console.error('Erro ao excluir lista:', error);
        toast.error('Erro ao excluir lista de distribuição');
      }
    }
  };
  
  // Adicionar usuário à lista
  const handleAddUsuario = async (listaId: string, usuarioId: string) => {
    try {
      await adicionarParticipante.mutateAsync({
        grupo_id: listaId,
        usuario_id: usuarioId,
        role: 'membro'
      });
      
      toast.success('Usuário adicionado à lista com sucesso');
      
      // Recarregar participantes
      carregarParticipantes(listaId);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      toast.error('Erro ao adicionar usuário à lista');
    }
  };
  
  // Remover usuário da lista
  const handleRemoveUsuario = async (listaId: string, usuarioId: string) => {
    try {
      await removerParticipante.mutateAsync({
        grupoId: listaId,
        usuarioId
      });
      
      toast.success('Usuário removido da lista com sucesso');
      
      // Recarregar participantes
      carregarParticipantes(listaId);
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast.error('Erro ao remover usuário da lista');
    }
  };
  
  // Salvar nova lista ou atualizar existente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formValues.nome) {
      toast.error('Preencha o nome da lista');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Dados para criar/atualizar o grupo
      const grupoData = {
        nome: formValues.nome,
        descricao: `${formValues.tipo.toUpperCase()}: ${formValues.descricao}`,
        criado_por: 'sistema'
      };
      
      let listaId: string;
      
      if (isEditing && currentListaId) {
        // Atualizar grupo existente
        const resultado = await atualizarGrupo.mutateAsync({
          id: currentListaId,
          grupo: grupoData
        });
        listaId = resultado.id;
        toast.success('Lista atualizada com sucesso');
      } else {
        // Criar novo grupo
        const resultado = await criarGrupo.mutateAsync({
          ...grupoData,
          criado_por: 'sistema'
        });
        listaId = resultado.id;
        toast.success('Lista criada com sucesso');
      }
      
      // Adicionar participantes selecionados
      for (const usuarioId of usuariosSelecionados) {
        await handleAddUsuario(listaId, usuarioId);
      }
      
      // Limpar formulário e voltar para listagem
      setFormValues({
        nome: '',
        descricao: '',
        tipo: 'turma',
        filtros: {},
        participantes: []
      });
      setUsuariosSelecionados([]);
      setIsEditing(false);
      setCurrentListaId(null);
      setActiveTab('listagem');
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
      toast.error('Erro ao salvar lista de distribuição');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar filtros específicos conforme o tipo de lista
  const renderTipoFiltros = () => {
    switch (formValues.tipo) {
      case 'turma':
        return (
          <>
            <div>
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                value={formValues.filtros?.curso || ''}
                onChange={(e) => setFormValues({
                  ...formValues,
                  filtros: { ...formValues.filtros, curso: e.target.value }
                })}
                placeholder="Nome do curso"
              />
            </div>
            <div>
              <Label htmlFor="turma">Turma</Label>
              <Input
                id="turma"
                value={formValues.filtros?.turma || ''}
                onChange={(e) => setFormValues({
                  ...formValues,
                  filtros: { ...formValues.filtros, turma: e.target.value }
                })}
                placeholder="Identificador da turma"
              />
            </div>
          </>
        );
        
      case 'perfil':
        return (
          <div>
            <Label htmlFor="perfil">Perfil</Label>
            <Select
              value={formValues.filtros?.perfil || ''}
              onValueChange={(value) => setFormValues({
                ...formValues,
                filtros: { ...formValues.filtros, perfil: value }
              })}
            >
              <SelectTrigger id="perfil">
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluno">Alunos</SelectItem>
                <SelectItem value="professor">Professores</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="coordenador">Coordenadores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'interesse':
        return (
          <div>
            <Label>Interesses/Tópicos</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formValues.filtros?.interesses || []).map((interesse, idx) => (
                <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span>{interesse}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const interesses = [...(formValues.filtros?.interesses || [])];
                      interesses.splice(idx, 1);
                      setFormValues({
                        ...formValues,
                        filtros: { ...formValues.filtros, interesses }
                      });
                    }}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                id="interesse"
                placeholder="Digite um interesse ou tópico"
                className="mr-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      const interesses = [...(formValues.filtros?.interesses || []), target.value.trim()];
                      setFormValues({
                        ...formValues,
                        filtros: { ...formValues.filtros, interesses }
                      });
                      target.value = '';
                    }
                  }
                }}
              />
              <Button
                type="button"
                onClick={(e) => {
                  const input = document.getElementById('interesse') as HTMLInputElement;
                  if (input.value.trim()) {
                    const interesses = [...(formValues.filtros?.interesses || []), input.value.trim()];
                    setFormValues({
                      ...formValues,
                      filtros: { ...formValues.filtros, interesses }
                    });
                    input.value = '';
                  }
                }}
              >
                Adicionar
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listas de Distribuição</CardTitle>
        <CardDescription>
          Gerencie grupos para envio de mensagens segmentadas por turma, perfil ou interesse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="listagem">Listas Configuradas</TabsTrigger>
            <TabsTrigger value="formulario">
              {isEditing ? 'Editar Lista' : 'Nova Lista'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Listas de Distribuição</h3>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentListaId(null);
                  setFormValues({
                    nome: '',
                    descricao: '',
                    tipo: 'turma',
                    filtros: {},
                    participantes: []
                  });
                  setUsuariosSelecionados([]);
                  setActiveTab('formulario');
                }}
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Nova Lista
              </Button>
            </div>
            
            {listas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma lista de distribuição configurada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listas.map((lista) => (
                    <TableRow key={lista.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lista.nome}</div>
                          <div className="text-sm text-gray-500">{lista.descricao}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{lista.tipo}</TableCell>
                      <TableCell>{lista.participantes?.length || 0} usuários</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(lista)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(lista.id)}
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
                  <Label htmlFor="nome">Nome da Lista</Label>
                  <Input
                    id="nome"
                    value={formValues.nome}
                    onChange={(e) => setFormValues({...formValues, nome: e.target.value})}
                    placeholder="Ex: Turma ADS 2024, Professores, Interessados em TI..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formValues.descricao}
                    onChange={(e) => setFormValues({...formValues, descricao: e.target.value})}
                    placeholder="Descrição da lista de distribuição"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo de Lista</Label>
                  <Select
                    value={formValues.tipo}
                    onValueChange={(value: any) => setFormValues({
                      ...formValues,
                      tipo: value,
                      filtros: {} // Limpar filtros ao mudar o tipo
                    })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo de lista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="turma">Por Turma/Curso</SelectItem>
                      <SelectItem value="perfil">Por Perfil</SelectItem>
                      <SelectItem value="interesse">Por Interesse/Tópico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Filtros específicos conforme o tipo de lista */}
                {renderTipoFiltros()}
                
                {/* Seleção de participantes (manual) */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Adicionar Participantes Manualmente</h4>
                  
                  <div className="border rounded-md p-4">
                    <div className="space-y-2">
                      <Label htmlFor="usuarios">Selecionar Usuários</Label>
                      <Select
                        onValueChange={(value) => {
                          if (!usuariosSelecionados.includes(value)) {
                            setUsuariosSelecionados([...usuariosSelecionados, value]);
                          }
                        }}
                      >
                        <SelectTrigger id="usuarios">
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios
                            .filter(u => !usuariosSelecionados.includes(u.id))
                            .map((usuario) => (
                              <SelectItem key={usuario.id} value={usuario.id}>
                                {usuario.nome} ({usuario.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {usuariosSelecionados.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Usuários Selecionados</h5>
                        <ul className="space-y-1">
                          {usuariosSelecionados.map((id) => {
                            const usuario = usuarios.find(u => u.id === id);
                            return (
                              <li key={id} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                                <span>{usuario?.nome} ({usuario?.email})</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setUsuariosSelecionados(
                                    usuariosSelecionados.filter(uid => uid !== id)
                                  )}
                                >
                                  <UserMinusIcon className="h-4 w-4 text-red-500" />
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab('listagem');
                    setIsEditing(false);
                    setCurrentListaId(null);
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