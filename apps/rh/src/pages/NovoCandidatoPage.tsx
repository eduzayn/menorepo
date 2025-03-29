import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  IconButton,
  DatePicker
} from '@edunexia/ui-components';
import { useCandidatosService, useVagasService } from '../contexts';
import { NovoCandidato, StatusCandidato, Vaga } from '@edunexia/shared-types/rh';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const NovoCandidatoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const candidatosService = useCandidatosService();
  const vagasService = useVagasService();
  
  // Verificar se há um ID de vaga no state da navegação
  const vagaIdFromState = location.state?.vagaId;
  
  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<NovoCandidato>({
    defaultValues: {
      vaga_id: vagaIdFromState || '',
      nome: '',
      email: '',
      telefone: '',
      linkedin_url: '',
      github_url: '',
      curriculo_url: '',
      competencias: [],
      formacao: [],
      experiencia: [],
      status: StatusCandidato.INSCRITO
    }
  });

  // Buscar vagas abertas para o select
  const { data: vagas = [] } = useQuery({
    queryKey: ['vagas-abertas'],
    queryFn: async () => vagasService.listarVagasAbertas()
  });

  // FieldArrays para formação acadêmica
  const { 
    fields: formacaoFields, 
    append: appendFormacao, 
    remove: removeFormacao 
  } = useFieldArray({
    control,
    name: 'formacao'
  });

  // FieldArrays para experiência profissional
  const { 
    fields: experienciaFields, 
    append: appendExperiencia, 
    remove: removeExperiencia 
  } = useFieldArray({
    control,
    name: 'experiencia'
  });

  // FieldArrays para competências
  const { 
    fields: competenciasFields, 
    append: appendCompetencia, 
    remove: removeCompetencia 
  } = useFieldArray({
    control,
    name: 'competencias'
  });

  // Mutação para cadastrar novo candidato
  const cadastrarMutation = useMutation({
    mutationFn: (data: NovoCandidato) => candidatosService.cadastrarCandidato(data),
    onSuccess: (data) => {
      navigate(`/rh/candidatos/${data.id}`);
    }
  });

  const onSubmit = async (data: NovoCandidato) => {
    // Garantir que arrays não sejam undefined
    const formData = {
      ...data,
      competencias: data.competencias || [],
      formacao: data.formacao || [],
      experiencia: data.experiencia || []
    };
    
    await cadastrarMutation.mutateAsync(formData);
  };

  const handleAddFormacao = () => {
    appendFormacao({
      instituicao: '',
      curso: '',
      grau: '',
      data_inicio: new Date().toISOString(),
      em_andamento: false,
      descricao: ''
    });
  };

  const handleAddExperiencia = () => {
    appendExperiencia({
      empresa: '',
      cargo: '',
      data_inicio: new Date().toISOString(),
      atual: false,
      descricao: ''
    });
  };

  const handleAddCompetencia = () => {
    appendCompetencia('');
  };

  const statusOptions = [
    { label: 'Inscrito', value: StatusCandidato.INSCRITO },
    { label: 'Em Análise', value: StatusCandidato.EM_ANALISE },
    { label: 'Entrevista Agendada', value: StatusCandidato.ENTREVISTA_AGENDADA }
  ];

  const grauOptions = [
    { label: 'Ensino Médio', value: 'ensino_medio' },
    { label: 'Técnico', value: 'tecnico' },
    { label: 'Graduação', value: 'graduacao' },
    { label: 'Pós-Graduação', value: 'pos_graduacao' },
    { label: 'MBA', value: 'mba' },
    { label: 'Mestrado', value: 'mestrado' },
    { label: 'Doutorado', value: 'doutorado' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Novo Candidato"
        description="Cadastre um novo candidato para uma vaga"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/rh/candidatos')}
          >
            Cancelar
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Controller
                control={control}
                name="vaga_id"
                rules={{ required: 'Vaga é obrigatória' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Vaga*</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={vagas.map((vaga: Vaga) => ({ 
                          label: vaga.titulo, 
                          value: vaga.id 
                        }))}
                        placeholder="Selecione a vaga"
                      />
                    </FormControl>
                    <FormMessage>{errors.vaga_id?.message}</FormMessage>
                  </div>
                )}
              />
              
              <Controller
                control={control}
                name="status"
                rules={{ required: 'Status é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Status*</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        options={statusOptions}
                        placeholder="Selecione o status"
                      />
                    </FormControl>
                    <FormMessage>{errors.status?.message}</FormMessage>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="nome"
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <div>
                    <FormLabel>Nome Completo*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do candidato" />
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={control}
                name="linkedin_url"
                render={({ field }) => (
                  <div>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/in/perfil" />
                    </FormControl>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="github_url"
                render={({ field }) => (
                  <div>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://github.com/perfil" />
                    </FormControl>
                  </div>
                )}
              />
              
              <FormField
                control={control}
                name="curriculo_url"
                render={({ field }) => (
                  <div>
                    <FormLabel>Currículo URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link para currículo" />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">Link para o currículo armazenado na nuvem (Google Drive, Dropbox, etc)</p>
                  </div>
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Competências</h2>
              <Button
                variant="outline"
                onClick={handleAddCompetencia}
                leftIcon={<FiPlus />}
              >
                Adicionar Competência
              </Button>
            </div>
            
            {competenciasFields.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-lg mb-6">
                <p className="text-gray-600 mb-4">Nenhuma competência adicionada</p>
                <Button
                  variant="outline"
                  onClick={handleAddCompetencia}
                  leftIcon={<FiPlus />}
                >
                  Adicionar Competência
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {competenciasFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={control}
                      name={`competencias.${index}`}
                      render={({ field }) => (
                        <FormControl className="flex-1">
                          <Input {...field} placeholder="Ex: React, JavaScript, Liderança, Comunicação..." />
                        </FormControl>
                      )}
                    />
                    <IconButton
                      variant="ghost"
                      icon={<FiTrash2 />}
                      onClick={() => removeCompetencia(index)}
                      aria-label="Remover competência"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Formação Acadêmica</h2>
              <Button
                variant="outline"
                onClick={handleAddFormacao}
                leftIcon={<FiPlus />}
              >
                Adicionar Formação
              </Button>
            </div>
            
            {formacaoFields.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-lg mb-6">
                <p className="text-gray-600 mb-4">Nenhuma formação acadêmica adicionada</p>
                <Button
                  variant="outline"
                  onClick={handleAddFormacao}
                  leftIcon={<FiPlus />}
                >
                  Adicionar Formação
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {formacaoFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Formação {index + 1}</h3>
                      <IconButton
                        variant="ghost"
                        icon={<FiTrash2 />}
                        onClick={() => removeFormacao(index)}
                        aria-label="Remover formação"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={control}
                        name={`formacao.${index}.instituicao`}
                        rules={{ required: 'Instituição é obrigatória' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Instituição*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da instituição" />
                            </FormControl>
                            <FormMessage>{errors.formacao?.[index]?.instituicao?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`formacao.${index}.curso`}
                        rules={{ required: 'Curso é obrigatório' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Curso*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome do curso" />
                            </FormControl>
                            <FormMessage>{errors.formacao?.[index]?.curso?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <Controller
                        control={control}
                        name={`formacao.${index}.grau`}
                        rules={{ required: 'Grau é obrigatório' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Grau Acadêmico*</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onChange={field.onChange}
                                options={grauOptions}
                                placeholder="Selecione o grau"
                              />
                            </FormControl>
                            <FormMessage>{errors.formacao?.[index]?.grau?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <Controller
                        control={control}
                        name={`formacao.${index}.data_inicio`}
                        rules={{ required: 'Data de início é obrigatória' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Data de Início*</FormLabel>
                            <FormControl>
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                placeholderText="Selecione a data"
                                dateFormat="dd/MM/yyyy"
                              />
                            </FormControl>
                            <FormMessage>{errors.formacao?.[index]?.data_inicio?.message}</FormMessage>
                          </div>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Controller
                        control={control}
                        name={`formacao.${index}.em_andamento`}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`formacao-em-andamento-${index}`}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <label htmlFor={`formacao-em-andamento-${index}`}>Em andamento</label>
                          </div>
                        )}
                      />
                      
                      {!formacaoFields[index].em_andamento && (
                        <Controller
                          control={control}
                          name={`formacao.${index}.data_conclusao`}
                          render={({ field }) => (
                            <div>
                              <FormLabel>Data de Conclusão</FormLabel>
                              <FormControl>
                                <DatePicker
                                  selected={field.value ? new Date(field.value) : null}
                                  onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                  placeholderText="Selecione a data"
                                  dateFormat="dd/MM/yyyy"
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                      )}
                    </div>
                    
                    <FormField
                      control={control}
                      name={`formacao.${index}.descricao`}
                      render={({ field }) => (
                        <div>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={2} 
                              placeholder="Detalhes sobre a formação, projeto, etc" 
                            />
                          </FormControl>
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Experiência Profissional</h2>
              <Button
                variant="outline"
                onClick={handleAddExperiencia}
                leftIcon={<FiPlus />}
              >
                Adicionar Experiência
              </Button>
            </div>
            
            {experienciaFields.length === 0 ? (
              <div className="bg-gray-50 p-6 text-center rounded-lg mb-6">
                <p className="text-gray-600 mb-4">Nenhuma experiência profissional adicionada</p>
                <Button
                  variant="outline"
                  onClick={handleAddExperiencia}
                  leftIcon={<FiPlus />}
                >
                  Adicionar Experiência
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {experienciaFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium">Experiência {index + 1}</h3>
                      <IconButton
                        variant="ghost"
                        icon={<FiTrash2 />}
                        onClick={() => removeExperiencia(index)}
                        aria-label="Remover experiência"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={control}
                        name={`experiencia.${index}.empresa`}
                        rules={{ required: 'Empresa é obrigatória' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Empresa*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da empresa" />
                            </FormControl>
                            <FormMessage>{errors.experiencia?.[index]?.empresa?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name={`experiencia.${index}.cargo`}
                        rules={{ required: 'Cargo é obrigatório' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Cargo*</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Título do cargo" />
                            </FormControl>
                            <FormMessage>{errors.experiencia?.[index]?.cargo?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <Controller
                        control={control}
                        name={`experiencia.${index}.data_inicio`}
                        rules={{ required: 'Data de início é obrigatória' }}
                        render={({ field }) => (
                          <div>
                            <FormLabel>Data de Início*</FormLabel>
                            <FormControl>
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                placeholderText="Selecione a data"
                                dateFormat="dd/MM/yyyy"
                              />
                            </FormControl>
                            <FormMessage>{errors.experiencia?.[index]?.data_inicio?.message}</FormMessage>
                          </div>
                        )}
                      />
                      
                      <Controller
                        control={control}
                        name={`experiencia.${index}.atual`}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`experiencia-atual-${index}`}
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <label htmlFor={`experiencia-atual-${index}`}>Trabalho atual</label>
                          </div>
                        )}
                      />
                    </div>
                    
                    {!experienciaFields[index].atual && (
                      <div className="mb-4">
                        <Controller
                          control={control}
                          name={`experiencia.${index}.data_fim`}
                          render={({ field }) => (
                            <div>
                              <FormLabel>Data de Término</FormLabel>
                              <FormControl>
                                <DatePicker
                                  selected={field.value ? new Date(field.value) : null}
                                  onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                  placeholderText="Selecione a data"
                                  dateFormat="dd/MM/yyyy"
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                      </div>
                    )}
                    
                    <FormField
                      control={control}
                      name={`experiencia.${index}.descricao`}
                      rules={{ required: 'Descrição é obrigatória' }}
                      render={({ field }) => (
                        <div>
                          <FormLabel>Descrição das Atividades*</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={3} 
                              placeholder="Descreva suas responsabilidades e realizações neste cargo" 
                            />
                          </FormControl>
                          <FormMessage>{errors.experiencia?.[index]?.descricao?.message}</FormMessage>
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
            onClick={() => navigate('/rh/candidatos')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Cadastrar Candidato'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NovoCandidatoPage; 