import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { 
  PageHeader, 
  Card, 
  Button, 
  Input, 
  Select, 
  DateRangePicker,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  Divider,
  Tabs,
  Tab,
  IconButton
} from '@edunexia/ui-components';
import { useAvaliacoesService, useColaboradoresService } from '../contexts';
import { StatusAvaliacao, NovaAvaliacao, Colaborador } from '@edunexia/shared-types/rh';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const NovaAvaliacaoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const avaliacoesService = useAvaliacoesService();
  const colaboradoresService = useColaboradoresService();
  const [activeTab, setActiveTab] = useState('informacoes');
  
  // Extrair ID do colaborador dos parâmetros de consulta, se disponível
  const searchParams = new URLSearchParams(location.search);
  const colaboradorIdParam = searchParams.get('colaborador');
  
  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<NovaAvaliacao>({
    defaultValues: {
      ciclo_avaliativo: '',
      data_inicio: new Date().toISOString(),
      data_fim: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
      status: StatusAvaliacao.PENDENTE,
      metas: [],
      competencias: [],
      pontos_fortes: [],
      pontos_melhoria: []
    }
  });

  // FieldArrays para os arrays do formulário
  const { 
    fields: metasFields, 
    append: appendMeta, 
    remove: removeMeta 
  } = useFieldArray({
    control,
    name: 'metas'
  });

  const { 
    fields: competenciasFields, 
    append: appendCompetencia, 
    remove: removeCompetencia 
  } = useFieldArray({
    control,
    name: 'competencias'
  });

  const { 
    fields: pontosForteFields, 
    append: appendPontoForte, 
    remove: removePontoForte 
  } = useFieldArray({
    control,
    name: 'pontos_fortes'
  });

  const { 
    fields: pontosMelhoriaFields, 
    append: appendPontoMelhoria, 
    remove: removePontoMelhoria 
  } = useFieldArray({
    control,
    name: 'pontos_melhoria'
  });

  // Buscar lista de colaboradores
  const { data: colaboradores = [] } = useQuery({
    queryKey: ['colaboradores-select'],
    queryFn: async () => colaboradoresService.listarColaboradoresAtivos()
  });

  // Se tiver um ID de colaborador na URL, define-o no formulário
  useEffect(() => {
    if (colaboradorIdParam) {
      setValue('colaborador_id', colaboradorIdParam);
    }
  }, [colaboradorIdParam, setValue]);

  // Mutação para cadastrar nova avaliação
  const cadastrarMutation = useMutation({
    mutationFn: (data: NovaAvaliacao) => avaliacoesService.cadastrarAvaliacao(data),
    onSuccess: (data) => {
      navigate(`/rh/avaliacoes/${data.id}`);
    }
  });

  const onSubmit = async (data: NovaAvaliacao) => {
    // Garantir que os arrays não sejam undefined
    const formData = {
      ...data,
      metas: data.metas || [],
      competencias: data.competencias || [],
      pontos_fortes: data.pontos_fortes || [],
      pontos_melhoria: data.pontos_melhoria || []
    };
    
    await cadastrarMutation.mutateAsync(formData);
  };

  const handleAddMeta = () => {
    appendMeta({
      id: `temp-${Date.now()}`,
      descricao: '',
      indicador: '',
      valor_esperado: 0,
      peso: 1,
      status: 'pendente',
      observacoes: ''
    });
  };

  const handleAddCompetencia = () => {
    appendCompetencia({
      id: `temp-${Date.now()}`,
      nome: '',
      descricao: '',
      peso: 1,
      observacoes: ''
    });
  };

  const handleAddPontoForte = () => {
    appendPontoForte('');
  };

  const handleAddPontoMelhoria = () => {
    appendPontoMelhoria('');
  };

  const handleNextTab = () => {
    if (activeTab === 'informacoes') setActiveTab('metas');
    else if (activeTab === 'metas') setActiveTab('competencias');
    else if (activeTab === 'competencias') setActiveTab('feedback');
  };

  const handlePreviousTab = () => {
    if (activeTab === 'feedback') setActiveTab('competencias');
    else if (activeTab === 'competencias') setActiveTab('metas');
    else if (activeTab === 'metas') setActiveTab('informacoes');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Nova Avaliação de Desempenho"
        description="Cadastre uma nova avaliação para um colaborador"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/rh/avaliacoes')}
          >
            Cancelar
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <Tab value="informacoes" label="Informações Gerais">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Informações da Avaliação</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={control}
                    name="ciclo_avaliativo"
                    rules={{ required: 'Ciclo avaliativo é obrigatório' }}
                    render={({ field }) => (
                      <div>
                        <FormLabel>Ciclo Avaliativo*</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Avaliação Anual 2023" />
                        </FormControl>
                        <FormMessage>{errors.ciclo_avaliativo?.message}</FormMessage>
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
                            options={[
                              { label: 'Pendente', value: StatusAvaliacao.PENDENTE },
                              { label: 'Em Andamento', value: StatusAvaliacao.EM_ANDAMENTO }
                            ]}
                            placeholder="Selecione o status"
                          />
                        </FormControl>
                        <FormMessage>{errors.status?.message}</FormMessage>
                      </div>
                    )}
                  />
                  
                  <Controller
                    control={control}
                    name="colaborador_id"
                    rules={{ required: 'Colaborador é obrigatório' }}
                    render={({ field }) => (
                      <div>
                        <FormLabel>Colaborador*</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onChange={field.onChange}
                            options={colaboradores.map((col: Colaborador) => ({ 
                              label: col.nome, 
                              value: col.id 
                            }))}
                            placeholder="Selecione o colaborador"
                          />
                        </FormControl>
                        <FormMessage>{errors.colaborador_id?.message}</FormMessage>
                      </div>
                    )}
                  />
                  
                  <Controller
                    control={control}
                    name="avaliador_id"
                    rules={{ required: 'Avaliador é obrigatório' }}
                    render={({ field }) => (
                      <div>
                        <FormLabel>Avaliador*</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onChange={field.onChange}
                            options={colaboradores.map((col: Colaborador) => ({ 
                              label: col.nome, 
                              value: col.id 
                            }))}
                            placeholder="Selecione o avaliador"
                          />
                        </FormControl>
                        <FormMessage>{errors.avaliador_id?.message}</FormMessage>
                      </div>
                    )}
                  />
                </div>
                
                <div className="mb-6">
                  <FormLabel>Período da Avaliação*</FormLabel>
                  <Controller
                    control={control}
                    name={['data_inicio', 'data_fim']}
                    rules={{ required: 'Período é obrigatório' }}
                    render={({ field }) => (
                      <FormControl>
                        <DateRangePicker
                          value={[
                            field.value[0] ? new Date(field.value[0]) : null,
                            field.value[1] ? new Date(field.value[1]) : null
                          ]}
                          onChange={([start, end]) => {
                            setValue('data_inicio', start ? start.toISOString() : '');
                            setValue('data_fim', end ? end.toISOString() : '');
                          }}
                          placeholder={['Data inicial', 'Data final']}
                        />
                      </FormControl>
                    )}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button 
                    type="button"
                    variant="primary"
                    onClick={handleNextTab}
                  >
                    Próximo: Metas
                  </Button>
                </div>
              </div>
            </Card>
          </Tab>
          
          <Tab value="metas" label="Metas">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Metas e Objetivos</h2>
                  <Button
                    variant="outline"
                    onClick={handleAddMeta}
                    leftIcon={<FiPlus />}
                  >
                    Adicionar Meta
                  </Button>
                </div>
                
                {metasFields.length === 0 ? (
                  <div className="bg-gray-50 p-6 text-center rounded-lg mb-6">
                    <p className="text-gray-600 mb-4">Nenhuma meta adicionada</p>
                    <Button
                      variant="outline"
                      onClick={handleAddMeta}
                      leftIcon={<FiPlus />}
                    >
                      Adicionar Meta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {metasFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium">Meta {index + 1}</h3>
                          <IconButton
                            variant="ghost"
                            icon={<FiTrash2 />}
                            onClick={() => removeMeta(index)}
                            aria-label="Remover meta"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={control}
                            name={`metas.${index}.descricao`}
                            rules={{ required: 'Descrição é obrigatória' }}
                            render={({ field }) => (
                              <div>
                                <FormLabel>Descrição*</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Descrição da meta" />
                                </FormControl>
                                <FormMessage>{errors.metas?.[index]?.descricao?.message}</FormMessage>
                              </div>
                            )}
                          />
                          
                          <FormField
                            control={control}
                            name={`metas.${index}.indicador`}
                            rules={{ required: 'Indicador é obrigatório' }}
                            render={({ field }) => (
                              <div>
                                <FormLabel>Indicador*</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Como a meta será medida" />
                                </FormControl>
                                <FormMessage>{errors.metas?.[index]?.indicador?.message}</FormMessage>
                              </div>
                            )}
                          />
                          
                          <FormField
                            control={control}
                            name={`metas.${index}.valor_esperado`}
                            rules={{ required: 'Valor esperado é obrigatório' }}
                            render={({ field }) => (
                              <div>
                                <FormLabel>Valor Esperado*</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    placeholder="Meta quantitativa" 
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage>{errors.metas?.[index]?.valor_esperado?.message}</FormMessage>
                              </div>
                            )}
                          />
                          
                          <FormField
                            control={control}
                            name={`metas.${index}.peso`}
                            rules={{ required: 'Peso é obrigatório', min: { value: 1, message: 'Peso mínimo é 1' } }}
                            render={({ field }) => (
                              <div>
                                <FormLabel>Peso*</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    placeholder="Importância relativa (1-10)" 
                                    min={1}
                                    max={10}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage>{errors.metas?.[index]?.peso?.message}</FormMessage>
                              </div>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={control}
                          name={`metas.${index}.observacoes`}
                          render={({ field }) => (
                            <div>
                              <FormLabel>Observações</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  as="textarea" 
                                  rows={2} 
                                  placeholder="Observações adicionais sobre a meta" 
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="button"
                    variant="primary"
                    onClick={handleNextTab}
                  >
                    Próximo: Competências
                  </Button>
                </div>
              </div>
            </Card>
          </Tab>
          
          <Tab value="competencias" label="Competências">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Competências a Avaliar</h2>
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
                  <div className="space-y-6">
                    {competenciasFields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium">Competência {index + 1}</h3>
                          <IconButton
                            variant="ghost"
                            icon={<FiTrash2 />}
                            onClick={() => removeCompetencia(index)}
                            aria-label="Remover competência"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={control}
                            name={`competencias.${index}.nome`}
                            rules={{ required: 'Nome é obrigatório' }}
                            render={({ field }) => (
                              <div>
                                <FormLabel>Nome*</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ex: Liderança" />
                                </FormControl>
                                <FormMessage>{errors.competencias?.[index]?.nome?.message}</FormMessage>
                              </div>
                            )}
                          />
                          
                          <FormField
                            control={control}
                            name={`competencias.${index}.peso`}
                            rules={{ required: 'Peso é obrigatório', min: { value: 1, message: 'Peso mínimo é 1' } }}
                            render={({ field }) => (
                              <div>
                                <FormLabel>Peso*</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    placeholder="Importância relativa (1-10)" 
                                    min={1}
                                    max={10}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage>{errors.competencias?.[index]?.peso?.message}</FormMessage>
                              </div>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={control}
                          name={`competencias.${index}.descricao`}
                          rules={{ required: 'Descrição é obrigatória' }}
                          render={({ field }) => (
                            <div>
                              <FormLabel>Descrição*</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  as="textarea" 
                                  rows={3} 
                                  placeholder="Descrição detalhada da competência"
                                />
                              </FormControl>
                              <FormMessage>{errors.competencias?.[index]?.descricao?.message}</FormMessage>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="button"
                    variant="primary"
                    onClick={handleNextTab}
                  >
                    Próximo: Feedback
                  </Button>
                </div>
              </div>
            </Card>
          </Tab>
          
          <Tab value="feedback" label="Feedback">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Feedback e Desenvolvimento</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Pontos Fortes</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddPontoForte}
                      leftIcon={<FiPlus />}
                    >
                      Adicionar
                    </Button>
                  </div>
                  
                  {pontosForteFields.length === 0 ? (
                    <p className="text-gray-500 text-sm mb-4">Adicione pontos fortes do colaborador</p>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {pontosForteFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <FormField
                            control={control}
                            name={`pontos_fortes.${index}`}
                            render={({ field }) => (
                              <FormControl className="flex-1">
                                <Input {...field} placeholder="Ponto forte" />
                              </FormControl>
                            )}
                          />
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={<FiTrash2 />}
                            onClick={() => removePontoForte(index)}
                            aria-label="Remover ponto forte"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Pontos de Melhoria</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddPontoMelhoria}
                      leftIcon={<FiPlus />}
                    >
                      Adicionar
                    </Button>
                  </div>
                  
                  {pontosMelhoriaFields.length === 0 ? (
                    <p className="text-gray-500 text-sm mb-4">Adicione pontos a melhorar do colaborador</p>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {pontosMelhoriaFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <FormField
                            control={control}
                            name={`pontos_melhoria.${index}`}
                            render={({ field }) => (
                              <FormControl className="flex-1">
                                <Input {...field} placeholder="Ponto a melhorar" />
                              </FormControl>
                            )}
                          />
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon={<FiTrash2 />}
                            onClick={() => removePontoMelhoria(index)}
                            aria-label="Remover ponto de melhoria"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <FormField
                    control={control}
                    name="plano_desenvolvimento"
                    render={({ field }) => (
                      <div>
                        <FormLabel>Plano de Desenvolvimento</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            as="textarea" 
                            rows={4} 
                            placeholder="Descreva o plano de desenvolvimento para o colaborador" 
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
                
                <div className="mb-6">
                  <FormField
                    control={control}
                    name="feedback_geral"
                    render={({ field }) => (
                      <div>
                        <FormLabel>Feedback Geral</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            as="textarea" 
                            rows={4} 
                            placeholder="Feedback geral sobre o desempenho do colaborador" 
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePreviousTab}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
                  </Button>
                </div>
              </div>
            </Card>
          </Tab>
        </Tabs>
      </form>
    </div>
  );
};

export default NovaAvaliacaoPage; 