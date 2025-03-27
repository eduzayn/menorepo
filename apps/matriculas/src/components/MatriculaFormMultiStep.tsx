import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea } from '@edunexia/ui-components';
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
import { matriculaSchema, type MatriculaInput } from '../schemas/matricula';
import { useCriarMatricula } from '../hooks/useMatriculas';
import { DocumentoUpload } from './documentos/DocumentoUpload';
import { ContratoViewer } from './contratos/ContratoViewer';

interface MatriculaFormMultiStepProps {
  onSuccess?: () => void;
}

export function MatriculaFormMultiStep({ onSuccess }: MatriculaFormMultiStepProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [matriculaId, setMatriculaId] = useState<string | null>(null);
  
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
    { label: 'Pagamento', description: 'Finalização e escolha da forma de pagamento' }
  ];

  function onSubmit(data: MatriculaInput) {
    criarMatricula(data, {
      onSuccess: () => {
        // Normalmente aqui você receberia a resposta com o ID
        // Por simplificação, vamos apenas simular isso
        setMatriculaId("novo-id-matrícula");
        handleNext();
      }
    });
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/matriculas');
    }
  };

  // Renderiza o passo atual
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="alunoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aluno</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ID do aluno" />
                    </FormControl>
                    <FormMessage />
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
                      <Input {...field} placeholder="ID do curso" />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} placeholder="ID do plano de pagamento" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Observações sobre a matrícula" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Próximo'}
                </Button>
              </div>
            </form>
          </Form>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documentação</h3>
            <p className="text-sm text-gray-700">
              Faça o upload dos documentos necessários para a matrícula.
            </p>
            {matriculaId && <DocumentoUpload />}
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

      case 2: 
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contrato</h3>
            <p className="text-sm text-gray-700">
              Revise e assine o contrato de matrícula.
            </p>
            {matriculaId && <ContratoViewer />}
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

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pagamento</h3>
            <p className="text-sm text-gray-700">
              Escolha a forma de pagamento para finalizar a matrícula.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                <h3 className="font-medium mb-2">Boleto Bancário</h3>
                <p className="text-sm text-gray-600">Pagamento via boleto com vencimento em 3 dias úteis.</p>
              </div>
              <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                <h3 className="font-medium mb-2">Cartão de Crédito</h3>
                <p className="text-sm text-gray-600">Pagamento com cartão de crédito em até 12x.</p>
              </div>
              <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                <h3 className="font-medium mb-2">Pix</h3>
                <p className="text-sm text-gray-600">Pagamento instantâneo via Pix.</p>
              </div>
              <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                <h3 className="font-medium mb-2">Transferência Bancária</h3>
                <p className="text-sm text-gray-600">Transferência para a conta da instituição.</p>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button onClick={handleFinish}>
                Finalizar Matrícula
              </Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center">
            <p className="text-green-600 mb-4">Matrícula finalizada com sucesso!</p>
            <Button onClick={handleFinish}>
              Ir para Lista de Matrículas
            </Button>
          </div>
        );

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

      <div className="mb-6">
        <div className="flex mb-4">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-center">
              <div 
                className={`rounded-full h-8 w-8 flex items-center justify-center text-sm ${
                  activeStep >= idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {idx + 1}
              </div>
              <div 
                className={`ml-2 ${
                  idx === steps.length - 1 ? '' : 'mr-6'
                }`}
              >
                <div className="text-sm font-medium">{step.label}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-grow border-t border-gray-300 mx-4 h-0 my-auto"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        {renderStep()}
      </div>
    </div>
  );
} 