import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { PlusIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useAtribuicaoAutomatica } from '../../hooks/useAtribuicaoAutomatica';
import { toast } from 'sonner';

interface RegrasListaProps {
  regras: any[];
  onReorder: (startIndex: number, endIndex: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

interface RegraCardProps {
  regra: any;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const RegraCard: React.FC<RegraCardProps> = ({ regra, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: regra.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-lg mb-4 bg-white hover:shadow-md transition-shadow"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="cursor-move">
            <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div className="font-medium">{regra.nome}</div>
            <div className="text-sm text-gray-500">{regra.descricao}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {regra.palavras_chave.map((palavra: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {palavra}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(index)}
          >
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="border-t px-4 py-2 bg-gray-50 flex justify-between">
        <div className="text-sm">
          <span className="font-medium">Departamento:</span> {regra.departamento}
        </div>
        <div className="text-sm">
          <span className="font-medium">Prioridade:</span> {regra.prioridade}
        </div>
      </div>
    </div>
  );
};

const RegrasList: React.FC<RegrasListaProps> = ({ regras, onReorder, onEdit, onDelete }) => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = regras.findIndex((regra) => regra.id === active.id);
      const newIndex = regras.findIndex((regra) => regra.id === over.id);
      
      onReorder(oldIndex, newIndex);
    }
  };
  
  return (
    <div>
      {regras.map((regra, index) => (
        <RegraCard
          key={regra.id}
          regra={regra}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default function AtribuicaoAutomaticaConfig() {
  const [regras, setRegras] = useState([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formValues, setFormValues] = useState({
    nome: '',
    descricao: '',
    palavras_chave: [],
    departamento: '',
    prioridade: 1,
    ativo: true
  });
  const [novaTag, setNovaTag] = useState('');
  const [modoTeste, setModoTeste] = useState(false);
  const [mensagemTeste, setMensagemTeste] = useState('');
  const [resultadoTeste, setResultadoTeste] = useState<any>(null);
  
  const { 
    regras: regrasFromHook, 
    isLoading, 
    error, 
    criarRegra, 
    atualizarRegra,
    excluirRegra,
    reordenarRegras,
    testarAtribuicao
  } = useAtribuicaoAutomatica();
  
  // Carrega as regras do hook
  useEffect(() => {
    if (regrasFromHook) {
      setRegras(regrasFromHook);
    }
  }, [regrasFromHook]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editIndex !== null) {
        // Atualizar regra existente
        await atualizarRegra(regras[editIndex].id, formValues);
        toast.success('Regra atualizada com sucesso');
      } else {
        // Criar nova regra
        await criarRegra(formValues);
        toast.success('Regra criada com sucesso');
      }
      
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar regra:', err);
      toast.error('Erro ao salvar regra');
    }
  };
  
  const handleEditRegra = (index: number) => {
    setEditIndex(index);
    setFormValues(regras[index]);
  };
  
  const handleDeleteRegra = async (index: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta regra?')) {
      try {
        await excluirRegra(regras[index].id);
        toast.success('Regra excluída com sucesso');
      } catch (err) {
        console.error('Erro ao excluir regra:', err);
        toast.error('Erro ao excluir regra');
      }
    }
  };
  
  const handleReordenarRegras = async (startIndex: number, endIndex: number) => {
    try {
      const newRegras = [...regras];
      const [movedItem] = newRegras.splice(startIndex, 1);
      newRegras.splice(endIndex, 0, movedItem);
      
      setRegras(newRegras);
      
      // Atualizar prioridades no backend
      const regrasAtualizadas = newRegras.map((regra, index) => ({
        ...regra,
        prioridade: newRegras.length - index // Inverter para que os primeiros tenham maior prioridade
      }));
      
      await reordenarRegras(regrasAtualizadas);
      toast.success('Ordem das regras atualizada');
    } catch (err) {
      console.error('Erro ao reordenar regras:', err);
      toast.error('Erro ao reordenar regras');
    }
  };
  
  const handleAdicionarTag = () => {
    if (novaTag.trim() && !formValues.palavras_chave.includes(novaTag.trim())) {
      setFormValues(prev => ({
        ...prev,
        palavras_chave: [...prev.palavras_chave, novaTag.trim()]
      }));
      setNovaTag('');
    }
  };
  
  const handleRemoverTag = (tag: string) => {
    setFormValues(prev => ({
      ...prev,
      palavras_chave: prev.palavras_chave.filter(t => t !== tag)
    }));
  };
  
  const handleTestarAtribuicao = async () => {
    if (!mensagemTeste.trim()) {
      toast.error('Digite uma mensagem para testar');
      return;
    }
    
    try {
      const resultado = await testarAtribuicao(mensagemTeste);
      setResultadoTeste(resultado);
    } catch (err) {
      console.error('Erro ao testar atribuição:', err);
      toast.error('Erro ao testar atribuição');
    }
  };
  
  const resetForm = () => {
    setFormValues({
      nome: '',
      descricao: '',
      palavras_chave: [],
      departamento: '',
      prioridade: 1,
      ativo: true
    });
    setEditIndex(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 p-4">
        Erro ao carregar configurações de atribuição automática.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configuração de Atribuição Automática</CardTitle>
          <CardDescription>
            Defina regras para encaminhar automaticamente mensagens para departamentos específicos com base em palavras-chave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setModoTeste(!modoTeste)}
            >
              {modoTeste ? 'Voltar' : 'Modo Teste'}
            </Button>
            <Button onClick={() => { setEditIndex(null); setFormValues({ nome: '', descricao: '', palavras_chave: [], departamento: '', prioridade: 1, ativo: true }); }}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </div>
          
          {modoTeste ? (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-4">Testar Atribuição</h3>
              <div className="mb-4">
                <Label htmlFor="mensagem-teste">Mensagem de teste</Label>
                <div className="flex mt-1">
                  <Input
                    id="mensagem-teste"
                    value={mensagemTeste}
                    onChange={(e) => setMensagemTeste(e.target.value)}
                    placeholder="Digite uma mensagem para ver qual regra será aplicada..."
                    className="flex-1 mr-2"
                  />
                  <Button onClick={handleTestarAtribuicao}>Testar</Button>
                </div>
              </div>
              
              {resultadoTeste && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Resultado:</h4>
                  {resultadoTeste.regra ? (
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-green-700 font-medium">{resultadoTeste.regra.nome}</p>
                      <p className="text-sm mt-1">A mensagem seria encaminhada para o departamento: <span className="font-medium">{resultadoTeste.regra.departamento}</span></p>
                      <p className="text-sm mt-1">Palavras-chave encontradas: {resultadoTeste.palavras_encontradas.map((p: string) => (
                        <Badge key={p} className="mr-1 bg-green-200 text-green-800">{p}</Badge>
                      ))}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p className="text-yellow-700">Nenhuma regra corresponde a esta mensagem.</p>
                      <p className="text-sm mt-1">A mensagem seria atribuída ao departamento padrão.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="mb-8 border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-4">{editIndex !== null ? 'Editar Regra' : 'Nova Regra'}</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="nome">Nome da regra</Label>
                    <Input
                      id="nome"
                      value={formValues.nome}
                      onChange={(e) => setFormValues({...formValues, nome: e.target.value})}
                      placeholder="Ex: Suporte Técnico"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                      id="departamento"
                      value={formValues.departamento}
                      onChange={(e) => setFormValues({...formValues, departamento: e.target.value})}
                      placeholder="Ex: Suporte"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formValues.descricao}
                    onChange={(e) => setFormValues({...formValues, descricao: e.target.value})}
                    placeholder="Descreva o propósito desta regra..."
                    className="mt-1"
                  />
                </div>
                
                <div className="mt-4">
                  <Label>Palavras-chave</Label>
                  <div className="flex mt-1">
                    <Input
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      placeholder="Ex: problema, erro, ajuda"
                      className="flex-1 mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAdicionarTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAdicionarTag}>Adicionar</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formValues.palavras_chave.map((tag, index) => (
                      <Badge key={index} className="pl-2 pr-1 py-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleRemoverTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editIndex !== null ? 'Atualizar' : 'Criar'} Regra
                  </Button>
                </div>
              </form>
              
              <h3 className="font-medium text-lg mb-4">Regras de Atribuição</h3>
              <p className="text-sm text-gray-500 mb-4">
                Arraste para reordenar. As regras são verificadas de cima para baixo, em ordem de prioridade.
              </p>
              
              <DndProvider backend={HTML5Backend}>
                <RegrasList
                  regras={regras}
                  onReorder={handleReordenarRegras}
                  onEdit={handleEditRegra}
                  onDelete={handleDeleteRegra}
                />
              </DndProvider>
              
              {regras.length === 0 && (
                <div className="text-center p-8 border rounded-lg border-dashed">
                  <p className="text-gray-500">Nenhuma regra definida ainda.</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => { setEditIndex(null); setFormValues({ nome: '', descricao: '', palavras_chave: [], departamento: '', prioridade: 1, ativo: true }); }}
                  >
                    Criar primeira regra
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 