import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  PageHeader, 
  Card, 
  Button, 
  Input, 
  Select, 
  DatePicker,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  Divider
} from '@edunexia/ui-components';
import { useColaboradoresService } from '../contexts';
import { TipoContrato } from '../types';
import { useMutation, useQuery } from '@tanstack/react-query';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: Date;
  data_admissao: Date;
  cargo: string;
  departamento: string;
  gestor_id?: string;
  tipo_contrato: TipoContrato;
  salario?: number;
  linkedin_url?: string;
}

const NovoColaboradorPage: React.FC = () => {
  const navigate = useNavigate();
  const colaboradoresService = useColaboradoresService();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      data_admissao: new Date(),
      tipo_contrato: TipoContrato.CLT
    }
  });

  // Buscar lista de departamentos
  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => colaboradoresService.listarDepartamentos()
  });

  // Buscar lista de gestores (colaboradores ativos que podem ser gestores)
  const { data: gestores = [] } = useQuery({
    queryKey: ['gestores'],
    queryFn: async () => colaboradoresService.listarGestores()
  });

  // Mutação para cadastrar novo colaborador
  const cadastrarMutation = useMutation({
    mutationFn: (data: FormData) => colaboradoresService.cadastrarColaborador(data),
    onSuccess: (data) => {
      navigate(`/rh/colaboradores/${data.id}`);
    }
  });

  const onSubmit = async (data: FormData) => {
    await cadastrarMutation.mutateAsync(data);
  };

  const tiposContrato = [
    { label: 'CLT', value: TipoContrato.CLT },
    { label: 'PJ', value: TipoContrato.PJ },
    { label: 'Temporário', value: TipoContrato.TEMPORARIO },
    { label: 'Estágio', value: TipoContrato.ESTAGIO },
    { label: 'Terceirizado', value: TipoContrato.TERCEIRIZADO }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Cadastrar Novo Colaborador"
        description="Preencha os dados para cadastrar um novo colaborador"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/rh/colaboradores')}
          >
            Cancelar
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="nome"
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Nome Completo*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do colaborador" />
                    </FormControl>
                    <FormMessage>{errors.nome?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="email"
                rules={{ 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@exemplo.com" />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="telefone"
                render={({ field }) => (
                  <div>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(00) 00000-0000" />
                    </FormControl>
                    <FormMessage>{errors.telefone?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="data_nascimento"
                render={({ field }) => (
                  <div>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecione a data"
                      />
                    </FormControl>
                    <FormMessage>{errors.data_nascimento?.message}</FormMessage>
                  </div>
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dados Profissionais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="cargo"
                rules={{ required: 'Cargo é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Cargo*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cargo do colaborador" />
                    </FormControl>
                    <FormMessage>{errors.cargo?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="departamento"
                rules={{ required: 'Departamento é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Departamento*</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={departamentos.map(dept => ({ label: dept, value: dept }))}
                        placeholder="Selecione o departamento"
                      />
                    </FormControl>
                    <FormMessage>{errors.departamento?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="gestor_id"
                render={({ field }) => (
                  <div>
                    <FormLabel>Gestor</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={gestores.map(gestor => ({ 
                          label: gestor.nome, 
                          value: gestor.id 
                        }))}
                        placeholder="Selecione o gestor (opcional)"
                        isClearable
                      />
                    </FormControl>
                    <FormMessage>{errors.gestor_id?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="tipo_contrato"
                rules={{ required: 'Tipo de contrato é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Tipo de Contrato*</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={tiposContrato}
                        placeholder="Selecione o tipo de contrato"
                      />
                    </FormControl>
                    <FormMessage>{errors.tipo_contrato?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="data_admissao"
                rules={{ required: 'Data de admissão é obrigatória' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Data de Admissão*</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecione a data"
                      />
                    </FormControl>
                    <FormMessage>{errors.data_admissao?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="salario"
                render={({ field }) => (
                  <div>
                    <FormLabel>Salário</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        placeholder="0,00"
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage>{errors.salario?.message}</FormMessage>
                  </div>
                )}
              />
            </div>
            
            <Divider className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="linkedin_url"
                render={({ field }) => (
                  <div>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://www.linkedin.com/in/username" />
                    </FormControl>
                    <FormMessage>{errors.linkedin_url?.message}</FormMessage>
                  </div>
                )}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/rh/colaboradores')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Colaborador'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovoColaboradorPage; 