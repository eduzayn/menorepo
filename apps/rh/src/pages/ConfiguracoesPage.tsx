import React from 'react';
import { 
  PageHeader, 
  Card, 
  Tabs, 
  Tab, 
  Form, 
  FormField, 
  Input, 
  Select, 
  Checkbox, 
  Button,
  Switch,
  Divider
} from '@edunexia/ui-components';

const ConfiguracoesPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do módulo de RH"
      />

      <Card>
        <Tabs>
          <Tab label="Geral">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>
              
              <Form onSubmit={(data) => console.log('Configurações salvas:', data)}>
                <div className="space-y-6">
                  <FormField 
                    label="Nome do Departamento" 
                    name="departamento_nome"
                    defaultValue="Recursos Humanos"
                  >
                    <Input placeholder="Nome do departamento" />
                  </FormField>
                  
                  <FormField 
                    label="Email para Notificações" 
                    name="email_notificacoes"
                    defaultValue="rh@edunexia.com.br"
                  >
                    <Input type="email" placeholder="Email para receber notificações" />
                  </FormField>
                  
                  <Divider />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Notificações</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novas candidaturas</p>
                        <p className="text-sm text-gray-500">Receba um email quando um novo candidato se inscrever</p>
                      </div>
                      <Switch defaultChecked name="notif_candidaturas" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Avalições pendentes</p>
                        <p className="text-sm text-gray-500">Receba lembretes sobre avaliações que precisam ser concluídas</p>
                      </div>
                      <Switch defaultChecked name="notif_avaliacoes" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Aniversários</p>
                        <p className="text-sm text-gray-500">Seja notificado sobre aniversários de colaboradores</p>
                      </div>
                      <Switch defaultChecked name="notif_aniversarios" />
                    </div>
                  </div>
                  
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </Form>
            </div>
          </Tab>
          
          <Tab label="Processo Seletivo">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Configurações do Processo Seletivo</h3>
              
              <Form onSubmit={(data) => console.log('Configurações do processo seletivo salvas:', data)}>
                <div className="space-y-6">
                  <FormField 
                    label="Etapas Padrão do Processo Seletivo" 
                    name="etapas_padrao"
                    helperText="As etapas serão aplicadas a todas as novas vagas"
                  >
                    <div className="space-y-2">
                      <Checkbox name="etapa_triagem" defaultChecked label="Triagem de Currículos" />
                      <Checkbox name="etapa_teste" defaultChecked label="Teste Técnico" />
                      <Checkbox name="etapa_entrevista_rh" defaultChecked label="Entrevista com RH" />
                      <Checkbox name="etapa_entrevista_gestor" defaultChecked label="Entrevista com Gestor" />
                      <Checkbox name="etapa_proposta" defaultChecked label="Proposta" />
                    </div>
                  </FormField>
                  
                  <FormField 
                    label="Período de Retenção de Currículos" 
                    name="retencao_curriculos"
                    defaultValue="6"
                  >
                    <Select>
                      <option value="3">3 meses</option>
                      <option value="6">6 meses</option>
                      <option value="12">1 ano</option>
                      <option value="24">2 anos</option>
                      <option value="0">Indefinidamente</option>
                    </Select>
                  </FormField>
                  
                  <FormField 
                    label="Email Automático para Candidatos" 
                    name="email_candidatos"
                    defaultValue="true"
                  >
                    <Checkbox 
                      name="enviar_emails_automaticos" 
                      defaultChecked 
                      label="Enviar emails automáticos aos candidatos após cada etapa do processo" 
                    />
                  </FormField>
                  
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </Form>
            </div>
          </Tab>
          
          <Tab label="Integrações">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">Integrações com Outros Sistemas</h3>
              
              <Form onSubmit={(data) => console.log('Configurações de integrações salvas:', data)}>
                <div className="space-y-6">
                  <FormField 
                    label="Integração com Folha de Pagamento" 
                    name="integracao_folha"
                  >
                    <div className="flex items-center space-x-2">
                      <Switch name="ativar_integracao_folha" />
                      <span>Ativar integração</span>
                    </div>
                  </FormField>
                  
                  <FormField 
                    label="API Key" 
                    name="api_key_folha"
                    disabled={true}
                  >
                    <Input 
                      type="password" 
                      placeholder="Sua API key" 
                      defaultValue="****************************************" 
                    />
                  </FormField>
                  
                  <FormField 
                    label="URL do Serviço" 
                    name="url_folha"
                    disabled={true}
                  >
                    <Input 
                      placeholder="URL da API" 
                      defaultValue="https://api.folhapagamento.com/v1" 
                    />
                  </FormField>
                  
                  <Divider />
                  
                  <FormField 
                    label="Integração com Sistemas de Treinamento" 
                    name="integracao_treinamento"
                  >
                    <div className="flex items-center space-x-2">
                      <Switch name="ativar_integracao_treinamento" />
                      <span>Ativar integração</span>
                    </div>
                  </FormField>
                  
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </Form>
            </div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default ConfiguracoesPage; 