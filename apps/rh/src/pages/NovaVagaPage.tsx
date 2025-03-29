import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { 
  PageHeader, 
  Card, 
  Button, 
  Input, 
  Select, 
  Textarea,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  Divider,
  Switch,
  IconButton
} from '@edunexia/ui-components';
import { useVagasService } from '../contexts';
import { NovaVaga, TipoContrato, StatusVaga } from '@edunexia/shared-types/rh';
import { useMutation } from '@tanstack/react-query';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const NovaVagaPage: React.FC = () => {
  const navigate = useNavigate();
  const vagasService = useVagasService();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<NovaVaga>({
    defaultValues: {
      titulo: '',
      descricao: '',
      requisitos: '',
      departamento: '',
      cargo: '',
      tipo_contrato: TipoContrato.CLT,
      local_trabalho: '',
      regime_trabalho: '',
      status: StatusVaga.ABERTA,
      data_publicacao: new Date().toISOString(),
      etapas_processo: []
    }
  });

  // FieldArray para etapas do processo
  const { 
    fields: etapasFields, 
    append: appendEtapa, 
    remove: removeEtapa 
  } = useFieldArray({
    control,
    name: 'etapas_processo'
  });

  // Mutação para cadastrar nova vaga
  const cadastrarMutation = useMutation({
    mutationFn: (data: NovaVaga) => vagasService.cadastrarVaga(data),
    onSuccess: (data) => {
      navigate(`/rh/vagas/${data.id}`);
    }
  });

  const onSubmit = async (data: NovaVaga) => {
    // Garantir que etapas_processo não seja undefined
    const formData = {
      ...data,
      etapas_processo: data.etapas_processo || []
    };
    
    await cadastrarMutation.mutateAsync(formData);
  };

  const handleAddEtapa = () => {
    appendEtapa({
      id: `temp-${Date.now()}`,
      nome: '',
      descricao: '',
      ordem: etapasFields.length + 1,
      obrigatoria: true
    });
  };

  const tipoContratoOptions = [
    { label: 'CLT', value: TipoContrato.CLT },
    { label: 'PJ', value: TipoContrato.PJ },
    { label: 'Temporário', value: TipoContrato.TEMPORARIO },
    { label: 'Estágio', value: TipoContrato.ESTAGIO },
    { label: 'Terceirizado', value: TipoContrato.TERCEIRIZADO }
  ];

  const regimeTrabalhoOptions = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'Remoto', value: 'remoto' },
    { label: 'Híbrido', value: 'hibrido' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Nova Vaga"
        description="Cadastre uma nova vaga de emprego"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/rh/vagas')}
          >
            Cancelar
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informações da Vaga</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={control}
                name="titulo"
                rules={{ required: 'Título é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Título da Vaga*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Desenvolvedor Full Stack" />
                    </FormControl>
                    <FormMessage>{errors.titulo?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="departamento"
                rules={{ required: 'Departamento é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Departamento*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Tecnologia" />
                    </FormControl>
                    <FormMessage>{errors.departamento?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="cargo"
                rules={{ required: 'Cargo é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Cargo*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Desenvolvedor Pleno" />
                    </FormControl>
                    <FormMessage>{errors.cargo?.message}</FormMessage>
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
                        options={tipoContratoOptions}
                        placeholder="Selecione o tipo de contrato"
                      />
                    </FormControl>
                    <FormMessage>{errors.tipo_contrato?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="local_trabalho"
                rules={{ required: 'Local de trabalho é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Local de Trabalho*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: São Paulo, SP" />
                    </FormControl>
                    <FormMessage>{errors.local_trabalho?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="regime_trabalho"
                rules={{ required: 'Regime de trabalho é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Regime de Trabalho*</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={regimeTrabalhoOptions}
                        placeholder="Selecione o regime de trabalho"
                      />
                    </FormControl>
                    <FormMessage>{errors.regime_trabalho?.message}</FormMessage>
                  </div>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={control}
                name="faixa_salarial_min"
                render={({ field }) => (
                  <div>
                    <FormLabel>Faixa Salarial - Mínimo</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Ex: 5000" 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="faixa_salarial_max"
                render={({ field }) => (
                  <div>
                    <FormLabel>Faixa Salarial - Máximo</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Ex: 7000" 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                  </div>
                )}
              />
            </div>
            
            <FormField
              control={control}
              name="descricao"
              rules={{ required: 'Descrição é obrigatória' }}
              render={({ field }) => (
                <div className="mb-6">
                  <FormLabel>Descrição da Vaga*</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Descreva as atividades, responsabilidades e o dia a dia da posição..."
                    />
                  </FormControl>
                  <FormMessage>{errors.descricao?.message}</FormMessage>
                </div>
              )}
            />
            
            <FormField
              control={control}
              name="requisitos"
              rules={{ required: 'Requisitos são obrigatórios' }}
              render={({ field }) => (
                <div className="mb-6">
                  <FormLabel>Requisitos*</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Descreva as habilidades, experiências e formação necessárias..."
                    />
                  </FormControl>
                  <FormMessage>{errors.requisitos?.message}</FormMessage>
                </div>
              )}
            />
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Etapas do Processo Seletivo</h2>
              <Button
                variant="outline"
                onClick={handleAddEtapa}
                leftIcon={<FiPlus />}
              >
                Adicionar Etapa
              </Button>
            </div>
            
            {etapasFields.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-lg mb-6">
                <p className="text-gray-600 mb-4">Nenhuma etapa adicionada ao processo seletivo</p>
                <Button
                  variant="outline"
                  onClick={handleAddEtapa}
                  leftIcon={<FiPlus />}
                >
                  Adicionar Etapa
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {etapasFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Etapa {index + 1}</h3>
                      <IconButton
                        variant="ghost"
                        icon={<FiTrash2 />}
                        onClick={() => removeEtapa(index)}
                        aria-label="Remover etapa"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={control}
                        name={`etapas_processo.${index}.nome`}
                        rules={{ required: 'Nome da etapa é obrigatório' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Nome da Etapa*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ex: Entrevista Técnica" />
                            </FormControl>
                            <FormMessage>{errors.etapas_processo?.[index]?.nome?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`etapas_processo.${index}.duracao_estimada_dias`}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Duração Estimada (dias)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                placeholder="Ex: 7" 
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={control}
                      name={`etapas_processo.${index}.descricao`}
                      rules={{ required: 'Descrição da etapa é obrigatória' }}
                      render={({ field }) => (
                        <div className="mb-4">
                          <FormLabel>Descrição*</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={3} 
                              placeholder="Descreva o que acontece nesta etapa..." 
                            />
                          </FormControl>
                          <FormMessage>{errors.etapas_processo?.[index]?.descricao?.message}</FormMessage>
                        </div>
                      )}
                    />
                    
                    <Controller
                      control={control}
                      name={`etapas_processo.${index}.obrigatoria`}
                      render={({ field }) => (
                        <div className="flex items-center">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={`etapa-obrigatoria-${index}`}
                            />
                          </FormControl>
                          <FormLabel className="ml-2" htmlFor={`etapa-obrigatoria-${index}`}>
                            Etapa obrigatória
                          </FormLabel>
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/rh/vagas')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Publicar Vaga'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovaVagaPage; 