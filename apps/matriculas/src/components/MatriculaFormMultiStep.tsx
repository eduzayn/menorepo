import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea, Card, Badge, Spinner, toast } from '@edunexia/ui-components';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@edunexia/ui-components/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { matriculaSchema, type MatriculaInput } from '../schemas/matricula';
import { useCriarMatricula } from '../hooks/useMatriculas';
import { DocumentoUpload } from './documentos/DocumentoUpload';
import { ContratoViewer } from './contratos/ContratoViewer';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

// Novos hooks para buscar dados
import { useQuery } from '@tanstack/react-query';
import { alunoService } from '../services/alunoService';
import { cursoService } from '../services/cursoService';
import { planoService } from '../services/planoService';

interface MatriculaFormMultiStepProps {
  onSuccess?: () => void;
}

// Componente de busca de aluno
const AlunoBusca = ({ 
  selectedValue, 
  onSelect 
}: { 
  selectedValue?: string; 
  onSelect: (id: string, nome: string) => void 
}) => {
  const [busca, setBusca] = useState('');
  const debouncedBusca = useDebounce(busca, 500);
  const [selectedAluno, setSelectedAluno] = useState<{id: string; nome: string} | null>(null);

  const { data: alunos, isLoading } = useQuery({
    queryKey: ['alunos', debouncedBusca],
    queryFn: () => alunoService.buscarAlunos({ termo: debouncedBusca }),
    enabled: debouncedBusca.length >= 3,
  });

  useEffect(() => {
    if (selectedValue && !selectedAluno) {
      // Buscar aluno pelo ID quando já temos um valor selecionado
      alunoService.buscarAluno(selectedValue).then(aluno => {
        if (aluno) setSelectedAluno({ id: aluno.id, nome: aluno.nome });
      });
    }
  }, [selectedValue]);

  return (
    <div className="relative">
      {selectedAluno ? (
        <div className="flex items-center justify-between p-2 border rounded-md">
          <div>
            <span className="font-medium">{selectedAluno.nome}</span>
            <Badge className="ml-2 bg-blue-100 text-blue-800">Selecionado</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSelectedAluno(null);
              setBusca('');
            }}
          >
            Alterar
          </Button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Busque pelo nome ou CPF do aluno"
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {isLoading && (
            <div className="py-2 flex justify-center">
              <Spinner size="sm" />
            </div>
          )}

          {debouncedBusca.length >= 3 && alunos && alunos.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {alunos.map(aluno => (
                <div
                  key={aluno.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedAluno({ id: aluno.id, nome: aluno.nome });
                    onSelect(aluno.id, aluno.nome);
                  }}
                >
                  <div>{aluno.nome}</div>
                  <div className="text-sm text-gray-500">CPF: {aluno.cpf}</div>
                </div>
              ))}
            </div>
          )}

          {debouncedBusca.length >= 3 && alunos && alunos.length === 0 && (
            <div className="py-2 text-center text-gray-500">
              Nenhum aluno encontrado
            </div>
          )}
        </>
      )}
    </div>
  );
};

export function MatriculaFormMultiStep({ onSuccess }: MatriculaFormMultiStepProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [matriculaId, setMatriculaId] = useState<string | null>(null);
  const [selectedAlunoNome, setSelectedAlunoNome] = useState<string>('');
  
  // Carregar cursos
  const { data: cursos = [], isLoading: cursosLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => cursoService.listarCursos(),
  });

  // Carregar planos
  const { data: planos = [], isLoading: planosLoading } = useQuery({
    queryKey: ['planos'],
    queryFn: () => planoService.listarPlanos(),
  });
  
  const form = useForm<MatriculaInput>({
    resolver: zodResolver(matriculaSchema),
    defaultValues: {
      status: 'PENDENTE'
    }
  });
  
  const { mutate: criarMatricula, isPending } = useCriarMatricula();

  const steps = [
    { label: 'Dados Básicos', description: 'Informações iniciais da matrícula' },
    { label: 'Documentação', description: 'Upload de documentos obrigatórios' },
    { label: 'Contrato', description: 'Visualização e assinatura do contrato' },
    { label: 'Pagamento', description: 'Finalização e escolha da forma de pagamento' },
    { label: 'Conclusão', description: 'Matrícula finalizada com sucesso' }
  ];

  function onSubmit(data: MatriculaInput) {
    criarMatricula(data, {
      onSuccess: (novaMatricula) => {
        // Agora recebemos a resposta com o ID real da matrícula
        if (novaMatricula && novaMatricula.id) {
          setMatriculaId(novaMatricula.id);
          toast.success('Matrícula criada com sucesso!');
          handleNext();
        }
      },
      onError: (erro) => {
        toast.error('Erro ao criar matrícula. Por favor, tente novamente.');
        console.error(erro);
      }
    });
  }

  const handleNext = () => {
    if (activeStep === 0 && !form.formState.isValid) {
      form.trigger();
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      toast.success('Matrícula finalizada com sucesso!');
      navigate('/matriculas');
    }
  };

  // Renderiza o passo de dados básicos
  const renderDadosBasicos = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Dados do Aluno</h3>
          
          <FormField
            control={form.control}
            name="alunoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aluno</FormLabel>
                <FormControl>
                  <AlunoBusca
                    selectedValue={field.value}
                    onSelect={(id, nome) => {
                      field.onChange(id);
                      setSelectedAlunoNome(nome);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Curso e Plano</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cursoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cursosLoading ? (
                        <div className="p-2 flex justify-center">
                          <Spinner size="sm" />
                        </div>
                      ) : (
                        cursos.map(curso => (
                          <SelectItem key={curso.id} value={curso.id}>
                            {curso.nome}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planoPagamentoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {planosLoading ? (
                        <div className="p-2 flex justify-center">
                          <Spinner size="sm" />
                        </div>
                      ) : (
                        planos.map(plano => (
                          <SelectItem key={plano.id} value={plano.id}>
                            {plano.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.valorTotal)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Informações Adicionais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="ATIVA">Ativa</SelectItem>
                      <SelectItem value="CANCELADA">Cancelada</SelectItem>
                      <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataInicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dataFim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Fim (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Observações sobre a matrícula"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="submit" 
            disabled={isPending || form.formState.isSubmitting}
            className="w-32"
          >
            {isPending ? <Spinner size="sm" /> : 'Próximo'}
          </Button>
        </div>
      </form>
    </Form>
  );

  // Renderiza o passo de upload de documentos
  const renderDocumentos = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-2">Documentação</h3>
        <p className="text-sm text-gray-600 mb-4">
          Faça o upload dos documentos necessários para a matrícula de {selectedAlunoNome}.
        </p>
        {matriculaId && (
          <div className="border rounded-md p-4 bg-gray-50">
            <DocumentoUpload />
          </div>
        )}
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>
          Próximo
        </Button>
      </div>
    </div>
  );

  // Renderiza o passo de contrato
  const renderContrato = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-2">Contrato</h3>
        <p className="text-sm text-gray-600 mb-4">
          Revise e assine o contrato de matrícula.
        </p>
        {matriculaId && (
          <div className="border rounded-md p-4 bg-gray-50">
            <ContratoViewer />
          </div>
        )}
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>
          Próximo
        </Button>
      </div>
    </div>
  );

  // Renderiza o passo de pagamento
  const renderPagamento = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-2">Pagamento</h3>
        <p className="text-sm text-gray-600 mb-4">
          Escolha a forma de pagamento para finalizar a matrícula.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 cursor-pointer hover:bg-gray-50 border-2 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Boleto Bancário</h3>
                <p className="text-sm text-gray-600">Pagamento via boleto com vencimento em 3 dias úteis.</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Recomendado</Badge>
            </div>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:bg-gray-50">
            <h3 className="font-medium">Cartão de Crédito</h3>
            <p className="text-sm text-gray-600">Pagamento com cartão de crédito em até 12x.</p>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:bg-gray-50">
            <h3 className="font-medium">Pix</h3>
            <p className="text-sm text-gray-600">Pagamento instantâneo via Pix.</p>
          </Card>
          
          <Card className="p-4 cursor-pointer hover:bg-gray-50">
            <h3 className="font-medium">Transferência Bancária</h3>
            <p className="text-sm text-gray-600">Transferência para a conta da instituição.</p>
          </Card>
        </div>
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>
          Finalizar Matrícula
        </Button>
      </div>
    </div>
  );

  // Renderiza o passo final
  const renderConclusao = () => (
    <Card className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-green-600 mb-2">Matrícula Finalizada com Sucesso!</h3>
      <p className="text-gray-600 mb-6">
        A matrícula de {selectedAlunoNome} foi criada e processada com sucesso.
        O aluno já pode acessar o Portal do Aluno.
      </p>
      <Button onClick={handleFinish} className="px-6">
        Ir para Lista de Matrículas
      </Button>
    </Card>
  );

  // Renderiza o passo atual
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return renderDadosBasicos();
      case 1:
        return renderDocumentos();
      case 2:
        return renderContrato();
      case 3:
        return renderPagamento();
      case 4:
        return renderConclusao();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Nova Matrícula</h2>
        <p className="text-gray-500">Etapa {activeStep + 1} de {steps.length}</p>
      </div>

      <div className="mb-8 overflow-hidden">
        <div className="flex mb-4 relative">
          {/* Linha de progresso no background */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          {/* Etapas */}
          <div className="flex justify-between w-full relative z-10">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center">
                <div 
                  className={`flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center text-sm transition-colors duration-300 ${
                    activeStep > idx 
                      ? 'bg-green-600 text-white' 
                      : activeStep === idx 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {activeStep > idx ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="text-xs font-medium mt-1 text-center">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>
    </div>
  );
} 