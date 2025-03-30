import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Input, 
  Badge,
  Spinner
} from '@edunexia/ui-components';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@edunexia/ui-components/components/ui';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Filter } from 'lucide-react';
import { alunoService } from '../../services/alunoService';
import { cursoService } from '../../services/cursoService';
import { useDebounce } from '../../hooks/useDebounce';

// Tipos para os filtros de matrícula
interface MatriculaFiltros {
  alunoId?: string;
  cursoId?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  perPage?: number;
}

export const BuscaAvancadaMatriculas = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [busca, setBusca] = useState('');
  const debouncedBusca = useDebounce(busca, 500);

  // Carrega os filtros iniciais da URL
  const filtrosIniciais: MatriculaFiltros = {
    alunoId: searchParams.get('alunoId') || undefined,
    cursoId: searchParams.get('cursoId') || undefined,
    status: searchParams.get('status') || undefined,
    dataInicio: searchParams.get('dataInicio') || undefined,
    dataFim: searchParams.get('dataFim') || undefined,
  };

  // Formulário para os filtros avançados
  const form = useForm<MatriculaFiltros>({
    defaultValues: filtrosIniciais
  });

  // Carregar alunos
  const { data: alunos, isLoading: alunosLoading } = useQuery({
    queryKey: ['alunos', debouncedBusca],
    queryFn: () => alunoService.buscarAlunos({ termo: debouncedBusca }),
    enabled: debouncedBusca.length >= 3,
  });

  // Carregar cursos
  const { data: cursos, isLoading: cursosLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => cursoService.listarCursos(),
  });

  // Status disponíveis para matrícula
  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'ATIVA', label: 'Ativa' },
    { value: 'CANCELADA', label: 'Cancelada' },
    { value: 'TRANCADA', label: 'Trancada' },
    { value: 'CONCLUIDA', label: 'Concluída' },
    { value: 'INADIMPLENTE', label: 'Inadimplente' },
  ];

  // Verifica se existem filtros aplicados
  const temFiltrosAtivos = () => {
    return Object.entries(form.getValues()).some(([_, value]) => value !== undefined && value !== '');
  };

  // Aplica os filtros
  const aplicarFiltros = (data: MatriculaFiltros) => {
    // Remove campos vazios
    const filtrosAtivos = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key as keyof MatriculaFiltros] = value;
      }
      return acc;
    }, {} as MatriculaFiltros);

    // Atualiza os query params
    setSearchParams(filtrosAtivos as any);

    // Fecha o painel de filtros
    setExpanded(false);
  };

  // Limpa todos os filtros
  const limparFiltros = () => {
    form.reset({
      alunoId: undefined,
      cursoId: undefined,
      status: undefined,
      dataInicio: undefined,
      dataFim: undefined,
    });
    setSearchParams({});
    setBusca('');
  };

  // Formatação dos filtros aplicados para exibição
  const renderFiltrosAplicados = () => {
    const filtros: JSX.Element[] = [];
    
    const formValues = form.getValues();
    
    if (formValues.alunoId) {
      // Aqui poderia buscar o nome do aluno pelo ID
      filtros.push(
        <Badge key="aluno" className="mr-2 mb-2">
          Aluno: ID {formValues.alunoId.substring(0, 8)}...
          <button 
            className="ml-1" 
            onClick={() => {
              form.setValue('alunoId', undefined);
              aplicarFiltros({...formValues, alunoId: undefined});
            }}
          >
            <X size={14} />
          </button>
        </Badge>
      );
    }
    
    if (formValues.cursoId) {
      // Aqui poderia buscar o nome do curso pelo ID
      filtros.push(
        <Badge key="curso" className="mr-2 mb-2">
          Curso: ID {formValues.cursoId.substring(0, 8)}...
          <button 
            className="ml-1" 
            onClick={() => {
              form.setValue('cursoId', undefined);
              aplicarFiltros({...formValues, cursoId: undefined});
            }}
          >
            <X size={14} />
          </button>
        </Badge>
      );
    }
    
    if (formValues.status) {
      const statusObj = statusOptions.find(s => s.value === formValues.status);
      filtros.push(
        <Badge key="status" className="mr-2 mb-2">
          Status: {statusObj?.label || formValues.status}
          <button 
            className="ml-1" 
            onClick={() => {
              form.setValue('status', undefined);
              aplicarFiltros({...formValues, status: undefined});
            }}
          >
            <X size={14} />
          </button>
        </Badge>
      );
    }
    
    if (formValues.dataInicio) {
      filtros.push(
        <Badge key="dataInicio" className="mr-2 mb-2">
          A partir de: {new Date(formValues.dataInicio).toLocaleDateString()}
          <button 
            className="ml-1" 
            onClick={() => {
              form.setValue('dataInicio', undefined);
              aplicarFiltros({...formValues, dataInicio: undefined});
            }}
          >
            <X size={14} />
          </button>
        </Badge>
      );
    }
    
    if (formValues.dataFim) {
      filtros.push(
        <Badge key="dataFim" className="mr-2 mb-2">
          Até: {new Date(formValues.dataFim).toLocaleDateString()}
          <button 
            className="ml-1" 
            onClick={() => {
              form.setValue('dataFim', undefined);
              aplicarFiltros({...formValues, dataFim: undefined});
            }}
          >
            <X size={14} />
          </button>
        </Badge>
      );
    }
    
    return filtros;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="relative w-80">
            <Input
              className="pl-10 pr-4"
              placeholder="Buscar matrículas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <Button 
            variant="outline" 
            className="ml-4 flex items-center gap-2"
            onClick={() => setExpanded(!expanded)}
          >
            <Filter size={16} />
            Filtros Avançados
            {temFiltrosAtivos() && (
              <Badge className="bg-blue-100 text-blue-800">Ativos</Badge>
            )}
          </Button>
        </div>
        
        {temFiltrosAtivos() && (
          <Button 
            variant="ghost" 
            onClick={limparFiltros}
            className="text-gray-500"
          >
            Limpar filtros
          </Button>
        )}
      </div>
      
      {temFiltrosAtivos() && (
        <div className="flex flex-wrap mb-4">
          {renderFiltrosAplicados()}
        </div>
      )}
      
      {expanded && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Filtros Avançados</h3>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aplicarFiltros)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="alunoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluno</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno" />
                          </SelectTrigger>
                          <SelectContent>
                            {alunosLoading ? (
                              <div className="p-2 flex justify-center">
                                <Spinner size="sm" />
                              </div>
                            ) : (
                              alunos?.map(aluno => (
                                <SelectItem key={aluno.id} value={aluno.id}>
                                  {aluno.nome}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cursoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curso</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {cursosLoading ? (
                              <div className="p-2 flex justify-center">
                                <Spinner size="sm" />
                              </div>
                            ) : (
                              cursos?.map(curso => (
                                <SelectItem key={curso.id} value={curso.id}>
                                  {curso.nome}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Início (a partir de)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dataFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fim (até)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setExpanded(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={limparFiltros}
                >
                  Limpar
                </Button>
                <Button type="submit">
                  Aplicar Filtros
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}; 