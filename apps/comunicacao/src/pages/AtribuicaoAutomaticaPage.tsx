import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronDown,
  Edit2,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useAtribuicaoAutomatica } from '../hooks/useAtribuicaoAutomatica';
import { Container, Button } from '@edunexia/ui-components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Textarea,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle
} from '@edunexia/ui-components';
import { useForm } from 'react-hook-form';
import { AtribuicaoAutomatica } from '../components/automacoes/AtribuicaoAutomatica';
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from 'lucide-react';
import { useAtribuicaoAutomatica } from '../hooks/useAtribuicaoAutomatica';
import { Container, Button } from '../mock-components';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../mock-components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../mock-components';

interface FormDados {
  departamento_id: string;
  palavras_chave: string;
  prioridade: number;
}

function AtribuicaoAutomaticaPage() {
  const { 
    regras, 
    departamentos, 
    isLoading, 
    error, 
    carregarRegras, 
    carregarDepartamentos,
    adicionarRegra,
    atualizarRegra,
    removerRegra
  } = useAtribuicaoAutomatica();

  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [regraEditando, setRegraEditando] = useState<string | null>(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState<string | null>(null);
  const [alertaMensagem, setAlertaMensagem] = useState<string | null>(null);
  const [alertaTipo, setAlertaTipo] = useState<'success' | 'error' | 'warning'>('success');
  const [exemploDetectado, setExemploDetectado] = useState<string | null>(null);

  const form = useForm<FormDados>({
    defaultValues: {
      departamento_id: '',
      palavras_chave: '',
      prioridade: 1
    }
  });

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarRegras();
    carregarDepartamentos();
  }, [carregarRegras, carregarDepartamentos]);

  // Resetar formulário ao abrir diálogo
  useEffect(() => {
    if (dialogoAberto) {
      if (!regraEditando) {
        form.reset({
          departamento_id: '',
          palavras_chave: '',
          prioridade: 1
        });
      }
    }
  }, [dialogoAberto, regraEditando, form]);

  // Função para carregar dados de regra para edição
  const editarRegra = (regraId: string) => {
    const regra = regras.find(r => r.id === regraId);
    if (regra) {
      form.reset({
        departamento_id: regra.departamento_id,
        palavras_chave: regra.palavras_chave.join(', '),
        prioridade: regra.prioridade
      });
      setRegraEditando(regraId);
      setDialogoAberto(true);
    }
  };

  // Função para confirmar exclusão
  const confirmarExclusao = async (regraId: string) => {
    const resultado = await removerRegra(regraId);
    setConfirmacaoAberta(null);
    
    if (resultado.sucesso) {
      mostrarAlerta('Regra removida com sucesso', 'success');
    } else {
      mostrarAlerta(`Erro ao remover regra: ${resultado.erro}`, 'error');
    }
  };

  // Função para exibir alertas
  const mostrarAlerta = (mensagem: string, tipo: 'success' | 'error' | 'warning') => {
    setAlertaMensagem(mensagem);
    setAlertaTipo(tipo);
    
    // Limpar alerta após alguns segundos
    setTimeout(() => {
      setAlertaMensagem(null);
    }, 5000);
  };

  // Processar envio do formulário
  const onSubmit = async (dados: FormDados) => {
    // Converter string de palavras-chave para array
    const palavrasChave = dados.palavras_chave
      .split(',')
      .map(palavra => palavra.trim())
      .filter(palavra => palavra.length > 0);
    
    if (palavrasChave.length === 0) {
      mostrarAlerta('Adicione pelo menos uma palavra-chave', 'warning');
      return;
    }
    
    let resultado;
    
    if (regraEditando) {
      // Atualizar regra existente
      resultado = await atualizarRegra(regraEditando, {
        departamento_id: dados.departamento_id,
        palavras_chave: palavrasChave,
        prioridade: dados.prioridade
      });
    } else {
      // Adicionar nova regra
      resultado = await adicionarRegra(
        dados.departamento_id, 
        palavrasChave, 
        dados.prioridade
      );
    }
    
    if (resultado.sucesso) {
      setDialogoAberto(false);
      setRegraEditando(null);
      mostrarAlerta(
        regraEditando 
          ? 'Regra atualizada com sucesso' 
          : 'Regra adicionada com sucesso',
        'success'
      );
    } else {
      mostrarAlerta(`Erro ao ${regraEditando ? 'atualizar' : 'adicionar'} regra: ${resultado.erro}`, 'error');
    }
  };

  // Função para testar exemplo
  const testarExemplo = (texto: string) => {
    // Verificar regras existentes
    for (const regra of regras) {
      const palavrasEncontradas = regra.palavras_chave.filter(palavra => 
        texto.toLowerCase().includes(palavra.toLowerCase())
      );
      
      if (palavrasEncontradas.length > 0) {
        return `Seria encaminhado para: ${regra.departamento_nome} (palavras detectadas: ${palavrasEncontradas.join(', ')})`;
      }
    }
    
    return 'Nenhum departamento seria atribuído automaticamente';
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Atribuição Automática de Conversas</h1>
          <p className="text-gray-600">
            Configure as regras para direcionamento automático de conversas aos departamentos apropriados.
          </p>
        </div>
        <Button onClick={() => setDialogoAberto(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Nova Regra
        </Button>
      </div>
      
      {/* Alerta de feedback */}
      {alertaMensagem && (
        <Alert variant={alertaTipo} className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {alertaTipo === 'success' ? 'Sucesso' : alertaTipo === 'error' ? 'Erro' : 'Atenção'}
          </AlertTitle>
          <AlertDescription>{alertaMensagem}</AlertDescription>
        </Alert>
      )}

      {/* Seção de teste */}
      <div className="mb-6 p-4 border rounded-md bg-slate-50">
        <h2 className="font-medium mb-2">Testar detecção automática</h2>
        <p className="text-sm text-gray-600 mb-3">
          Digite um exemplo de mensagem para ver qual departamento seria acionado
        </p>
        <div className="flex gap-2">
          <Textarea 
            placeholder="Ex: Gostaria de falar sobre a compra do curso..."
            className="flex-1"
            onChange={(e) => setExemploDetectado(testarExemplo(e.target.value))}
          />
          <Button 
            variant="outline" 
            className="self-end"
            onClick={() => setExemploDetectado(null)}
          >
            Limpar
          </Button>
        </div>
        {exemploDetectado && (
          <div className="mt-2 p-2 bg-white border rounded text-sm">
            <strong>Resultado:</strong> {exemploDetectado}
          </div>
        )}
      </div>
      
      {/* Tabela de regras */}
      <div className="bg-white rounded-md border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-medium">Regras configuradas</h2>
          <p className="text-sm text-gray-500">
            As regras são aplicadas em ordem de prioridade (maior número = maior prioridade)
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-2 text-gray-500">Carregando regras...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-red-600">
            <p>Erro ao carregar regras: {error.message}</p>
          </div>
        ) : regras.length === 0 ? (
          <div className="p-8 text-center border-b">
            <p className="text-gray-500">Nenhuma regra configurada</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setDialogoAberto(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Regra
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departamento</TableHead>
                <TableHead>Palavras-chave</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regras.map((regra) => (
                <TableRow key={regra.id}>
                  <TableCell className="font-medium">
                    {regra.departamento_nome}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {regra.palavras_chave.map((palavra, idx) => (
                        <Badge key={idx} variant="outline">
                          {palavra}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{regra.prioridade}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editarRegra(regra.id)}
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmacaoAberta(regra.id)}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Diálogo para adicionar/editar regra */}
      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {regraEditando ? 'Editar Regra' : 'Nova Regra de Atribuição'}
            </DialogTitle>
            <DialogDescription>
              Configure as palavras-chave e o departamento destino para a atribuição automática.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="departamento_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento Destino</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      required
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departamentos.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id}>
                            {dep.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Departamento para onde as conversas serão encaminhadas.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="palavras_chave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palavras-chave</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Separe as palavras por vírgula. Ex: comprar, plano, preço"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormDescription>
                      Quando estas palavras forem detectadas, a conversa será encaminhada.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Regras com maior prioridade são verificadas primeiro.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setDialogoAberto(false);
                  setRegraEditando(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {regraEditando ? 'Salvar Alterações' : 'Adicionar Regra'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!confirmacaoAberta} onOpenChange={(open) => !open && setConfirmacaoAberta(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja remover esta regra? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmacaoAberta(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => confirmacaoAberta && confirmarExclusao(confirmacaoAberta)}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default AtribuicaoAutomaticaPage; 