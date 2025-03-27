import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useWhatsAppIntegration, WhatsAppConfig } from '../../hooks/useWhatsAppIntegration';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function WhatsAppIntegrationConfig() {
  const {
    loading,
    config,
    templates,
    error,
    loadConfig,
    saveConfig,
    testConnection,
    listTemplates,
    sendMessage
  } = useWhatsAppIntegration();

  const [activeTab, setActiveTab] = useState('config');
  
  // Campos para configuração da API
  const [apiKey, setApiKey] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  // Campos para teste de envio
  const [testPhone, setTestPhone] = useState('');
  const [testMessageType, setTestMessageType] = useState('text');
  const [testMessageContent, setTestMessageContent] = useState('');
  const [testMessageTemplate, setTestMessageTemplate] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  
  // Estado para manipulação da interface
  const [copied, setCopied] = useState(false);

  // Carregar configuração ao montar o componente
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Atualizar formulário quando a configuração for carregada
  useEffect(() => {
    if (config) {
      setApiKey(config.api_key);
      setPhoneNumberId(config.phone_number_id);
      setBusinessAccountId(config.business_account_id);
      setWebhookSecret(config.webhook_secret);
      setIsActive(config.ativo);
    }
  }, [config]);

  // Carregar templates quando acessar a aba de templates
  useEffect(() => {
    if (activeTab === 'templates' && config?.ativo) {
      listTemplates();
    }
  }, [activeTab, config, listTemplates]);

  // Manipular o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await saveConfig({
      id: config?.id,
      api_key: apiKey,
      phone_number_id: phoneNumberId,
      business_account_id: businessAccountId,
      webhook_secret: webhookSecret,
      ativo: isActive
    });
    
    if (activeTab === 'templates') {
      listTemplates();
    }
  };

  // Testar a conexão com o WhatsApp API
  const handleTestConnection = async () => {
    await testConnection();
  };

  // Enviar mensagem de teste
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testPhone || !testMessageContent) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setSendingTest(true);
      
      // Formatar o número de telefone (adicionar código do país se necessário)
      let formattedPhone = testPhone;
      if (!testPhone.startsWith('+')) {
        formattedPhone = `+55${testPhone.replace(/\D/g, '')}`;
      }
      
      // Enviar mensagem com base no tipo selecionado
      if (testMessageType === 'text') {
        await sendMessage({
          to: formattedPhone,
          type: 'text',
          content: testMessageContent
        });
      } else if (testMessageType === 'template' && testMessageTemplate) {
        await sendMessage({
          to: formattedPhone,
          type: 'template',
          content: 'Template message',
          template_name: testMessageTemplate,
          template_params: { 
            1: testMessageContent 
          }
        });
      }
      
      toast.success('Mensagem de teste enviada com sucesso');
      
      // Limpar o formulário
      setTestMessageContent('');
    } catch (error) {
      console.error('Erro ao enviar mensagem de teste:', error);
      toast.error('Erro ao enviar mensagem de teste');
    } finally {
      setSendingTest(false);
    }
  };

  // Copiar a URL do webhook para a área de transferência
  const copyWebhookUrl = () => {
    // URL atualizada para apontar para a Edge Function
    const webhookUrl = `https://npiyusbnaaibibcucspv.supabase.co/functions/v1/whatsapp-functions/handle-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    
    toast.success('URL copiada para a área de transferência');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading && !config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuração do WhatsApp</CardTitle>
          <CardDescription>Carregando configurações...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração com WhatsApp Business</CardTitle>
        <CardDescription>
          Configure a integração com WhatsApp para envio de mensagens automatizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="config" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="test">Testes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Chave da API do WhatsApp Business"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                    <Input
                      id="phoneNumberId"
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      placeholder="ID do número de telefone"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAccountId">Business Account ID</Label>
                    <Input
                      id="businessAccountId"
                      value={businessAccountId}
                      onChange={(e) => setBusinessAccountId(e.target.value)}
                      placeholder="ID da conta comercial"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="Chave secreta para verificação do webhook"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Ativo</Label>
                    <p className="text-sm text-gray-500">
                      Ativar a integração com WhatsApp
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <div className="pt-2">
                  <Label>URL do Webhook</Label>
                  <div className="mt-1 flex">
                    <Input
                      value="https://npiyusbnaaibibcucspv.supabase.co/functions/v1/whatsapp-functions/handle-webhook"
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={copyWebhookUrl}
                    >
                      {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Configure esta URL nas configurações do webhook do WhatsApp Business
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestConnection} 
                  disabled={loading}
                >
                  Testar Conexão
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="templates">
            <div className="space-y-4">
              {!config?.ativo ? (
                <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
                  <div className="text-center">
                    <h3 className="mt-2 text-sm font-semibold">Integração Inativa</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ative a integração para visualizar os templates disponíveis
                    </p>
                    <div className="mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('config')}
                      >
                        Ir para Configurações
                      </Button>
                    </div>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex justify-center p-6">
                  <p>Carregando templates...</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold">Nenhum template encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Crie templates na plataforma do WhatsApp Business
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => listTemplates()}
                      disabled={loading}
                    >
                      Atualizar Templates
                    </Button>
                  </div>
                  <div className="border rounded-md divide-y">
                    {templates.map((template) => (
                      <div key={template.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-500">{template.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              template.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : template.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {template.status}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                              {template.language}
                            </span>
                          </div>
                        </div>
                        {template.components_text && template.components_text.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p className="font-medium">Conteúdo:</p>
                            <ul className="list-disc pl-5 mt-1">
                              {template.components_text.map((text, index) => (
                                <li key={index}>{text}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="test">
            {!config?.ativo ? (
              <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
                <div className="text-center">
                  <h3 className="mt-2 text-sm font-semibold">Integração Inativa</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ative a integração para testar o envio de mensagens
                  </p>
                  <div className="mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('config')}
                    >
                      Ir para Configurações
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">Testar Envio de Mensagem</h3>
                  
                  <form onSubmit={handleSendTestMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="testPhone">Número de Telefone</Label>
                      <Input
                        id="testPhone"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        placeholder="Ex: +5511999999999"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Inclua o código do país (+55 para Brasil)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="testMessageType">Tipo de Mensagem</Label>
                      <Select
                        value={testMessageType}
                        onValueChange={(value) => setTestMessageType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {testMessageType === 'template' && (
                      <div className="space-y-2">
                        <Label htmlFor="testMessageTemplate">Template</Label>
                        <Select
                          value={testMessageTemplate}
                          onValueChange={(value) => setTestMessageTemplate(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.length === 0 ? (
                              <SelectItem value="" disabled>
                                Nenhum template disponível
                              </SelectItem>
                            ) : (
                              templates.map((template) => (
                                <SelectItem key={template.id} value={template.name}>
                                  {template.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="testMessageContent">
                        {testMessageType === 'text' ? 'Mensagem' : 'Parâmetro do Template'}
                      </Label>
                      <Textarea
                        id="testMessageContent"
                        value={testMessageContent}
                        onChange={(e) => setTestMessageContent(e.target.value)}
                        placeholder={testMessageType === 'text' ? 'Digite sua mensagem' : 'Valor do parâmetro'}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" disabled={sendingTest || !config?.ativo}>
                        {sendingTest ? 'Enviando...' : 'Enviar Mensagem de Teste'}
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-medium mb-2">Webhook Status</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    O webhook está configurado para receber notificações do WhatsApp.
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Ativo e funcionando</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 