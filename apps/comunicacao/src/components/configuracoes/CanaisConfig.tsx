import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnvelopeIcon, DevicePhoneMobileIcon, BellIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

export function CanaisConfig() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('email');
  
  // Estado para configurações de email
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [emailConfig, setEmailConfig] = useState({
    smtp: {
      host: '',
      port: '587',
      secure: false,
      user: '',
      password: '',
      from: ''
    },
    sendgrid: {
      apiKey: '',
      from: ''
    },
    mailgun: {
      apiKey: '',
      domain: '',
      from: ''
    }
  });
  
  // Estado para configurações de SMS
  const [smsProvider, setSmsProvider] = useState('twilio');
  const [smsConfig, setSmsConfig] = useState({
    twilio: {
      accountSid: '',
      authToken: '',
      from: ''
    },
    infobip: {
      apiKey: '',
      from: ''
    },
    totalvoice: {
      apiKey: '',
      from: ''
    }
  });
  
  // Estado para configurações de Push
  const [pushProvider, setPushProvider] = useState('firebase');
  const [pushConfig, setPushConfig] = useState({
    firebase: {
      apiKey: '',
      projectId: '',
      applicationId: ''
    },
    onesignal: {
      appId: '',
      apiKey: ''
    }
  });
  
  // Handlers para atualizações de configurações
  const updateEmailConfig = (provider: string, field: string, value: string | boolean) => {
    setEmailConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const updateSmsConfig = (provider: string, field: string, value: string) => {
    setSmsConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const updatePushConfig = (provider: string, field: string, value: string) => {
    setPushConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  // Envio de configurações
  const handleSaveEmailConfig = () => {
    console.log('Salvando configuração de email:', emailProvider, emailConfig[emailProvider as keyof typeof emailConfig]);
    toast({
      title: 'Configuração salva',
      description: `Configurações de email para ${emailProvider} foram salvas com sucesso.`,
    });
  };
  
  const handleSaveSmsConfig = () => {
    console.log('Salvando configuração de SMS:', smsProvider, smsConfig[smsProvider as keyof typeof smsConfig]);
    toast({
      title: 'Configuração salva',
      description: `Configurações de SMS para ${smsProvider} foram salvas com sucesso.`,
    });
  };
  
  const handleSavePushConfig = () => {
    console.log('Salvando configuração de Push:', pushProvider, pushConfig[pushProvider as keyof typeof pushConfig]);
    toast({
      title: 'Configuração salva',
      description: `Configurações de Push para ${pushProvider} foram salvas com sucesso.`,
    });
  };
  
  // Envio de teste
  const handleTestEmail = () => {
    toast({
      title: 'Teste enviado',
      description: 'Um email de teste foi enviado. Verifique sua caixa de entrada.',
    });
  };
  
  const handleTestSms = () => {
    toast({
      title: 'Teste enviado',
      description: 'Um SMS de teste foi enviado para o número configurado.',
    });
  };
  
  const handleTestPush = () => {
    toast({
      title: 'Teste enviado',
      description: 'Uma notificação push de teste foi enviada.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Configuração de Canais</h2>
        <p className="text-sm text-neutral-500">
          Configure os provedores de serviço para cada canal de comunicação.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <DevicePhoneMobileIcon className="h-4 w-4" />
            <span>SMS</span>
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            <span>Push Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Configuração de Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Email</CardTitle>
              <CardDescription>
                Configure o serviço que será utilizado para envio de emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailProvider">Provedor</Label>
                <Select value={emailProvider} onValueChange={setEmailProvider}>
                  <SelectTrigger id="emailProvider">
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {emailProvider === 'smtp' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">Servidor SMTP</Label>
                      <Input 
                        id="smtpHost" 
                        value={emailConfig.smtp.host} 
                        onChange={(e) => updateEmailConfig('smtp', 'host', e.target.value)} 
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">Porta</Label>
                      <Input 
                        id="smtpPort" 
                        value={emailConfig.smtp.port} 
                        onChange={(e) => updateEmailConfig('smtp', 'port', e.target.value)} 
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">Usuário</Label>
                      <Input 
                        id="smtpUser" 
                        value={emailConfig.smtp.user} 
                        onChange={(e) => updateEmailConfig('smtp', 'user', e.target.value)} 
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Senha</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password" 
                        value={emailConfig.smtp.password} 
                        onChange={(e) => updateEmailConfig('smtp', 'password', e.target.value)} 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpFrom">Email de Origem</Label>
                    <Input 
                      id="smtpFrom" 
                      value={emailConfig.smtp.from} 
                      onChange={(e) => updateEmailConfig('smtp', 'from', e.target.value)} 
                      placeholder="no-reply@edunexia.com"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="smtpSecure" 
                      checked={emailConfig.smtp.secure} 
                      onCheckedChange={(checked) => updateEmailConfig('smtp', 'secure', checked)} 
                    />
                    <Label htmlFor="smtpSecure">Usar conexão segura (SSL/TLS)</Label>
                  </div>
                </div>
              )}

              {emailProvider === 'sendgrid' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sendgridApiKey">API Key</Label>
                    <Input 
                      id="sendgridApiKey" 
                      value={emailConfig.sendgrid.apiKey} 
                      onChange={(e) => updateEmailConfig('sendgrid', 'apiKey', e.target.value)} 
                      placeholder="SG.xxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sendgridFrom">Email de Origem</Label>
                    <Input 
                      id="sendgridFrom" 
                      value={emailConfig.sendgrid.from} 
                      onChange={(e) => updateEmailConfig('sendgrid', 'from', e.target.value)} 
                      placeholder="no-reply@edunexia.com"
                    />
                  </div>
                </div>
              )}

              {emailProvider === 'mailgun' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailgunApiKey">API Key</Label>
                    <Input 
                      id="mailgunApiKey" 
                      value={emailConfig.mailgun.apiKey} 
                      onChange={(e) => updateEmailConfig('mailgun', 'apiKey', e.target.value)} 
                      placeholder="key-xxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mailgunDomain">Domínio</Label>
                    <Input 
                      id="mailgunDomain" 
                      value={emailConfig.mailgun.domain} 
                      onChange={(e) => updateEmailConfig('mailgun', 'domain', e.target.value)} 
                      placeholder="edunexia.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mailgunFrom">Email de Origem</Label>
                    <Input 
                      id="mailgunFrom" 
                      value={emailConfig.mailgun.from} 
                      onChange={(e) => updateEmailConfig('mailgun', 'from', e.target.value)} 
                      placeholder="no-reply@edunexia.com"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestEmail}>Enviar teste</Button>
              <Button onClick={handleSaveEmailConfig}>Salvar configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configuração de SMS */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de SMS</CardTitle>
              <CardDescription>
                Configure o serviço que será utilizado para envio de SMS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider">Provedor</Label>
                <Select value={smsProvider} onValueChange={setSmsProvider}>
                  <SelectTrigger id="smsProvider">
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="infobip">Infobip</SelectItem>
                    <SelectItem value="totalvoice">TotalVoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {smsProvider === 'twilio' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twilioAccountSid">Account SID</Label>
                    <Input 
                      id="twilioAccountSid" 
                      value={smsConfig.twilio.accountSid} 
                      onChange={(e) => updateSmsConfig('twilio', 'accountSid', e.target.value)} 
                      placeholder="ACxxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twilioAuthToken">Auth Token</Label>
                    <Input 
                      id="twilioAuthToken" 
                      type="password" 
                      value={smsConfig.twilio.authToken} 
                      onChange={(e) => updateSmsConfig('twilio', 'authToken', e.target.value)} 
                      placeholder="xxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twilioFrom">Número de Origem</Label>
                    <Input 
                      id="twilioFrom" 
                      value={smsConfig.twilio.from} 
                      onChange={(e) => updateSmsConfig('twilio', 'from', e.target.value)} 
                      placeholder="+5511999999999"
                    />
                  </div>
                </div>
              )}

              {smsProvider === 'infobip' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="infobipApiKey">API Key</Label>
                    <Input 
                      id="infobipApiKey" 
                      value={smsConfig.infobip.apiKey} 
                      onChange={(e) => updateSmsConfig('infobip', 'apiKey', e.target.value)} 
                      placeholder="xxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="infobipFrom">Remetente</Label>
                    <Input 
                      id="infobipFrom" 
                      value={smsConfig.infobip.from} 
                      onChange={(e) => updateSmsConfig('infobip', 'from', e.target.value)} 
                      placeholder="Edunexia"
                    />
                  </div>
                </div>
              )}

              {smsProvider === 'totalvoice' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalvoiceApiKey">API Key</Label>
                    <Input 
                      id="totalvoiceApiKey" 
                      value={smsConfig.totalvoice.apiKey} 
                      onChange={(e) => updateSmsConfig('totalvoice', 'apiKey', e.target.value)} 
                      placeholder="xxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalvoiceFrom">Número de Origem</Label>
                    <Input 
                      id="totalvoiceFrom" 
                      value={smsConfig.totalvoice.from} 
                      onChange={(e) => updateSmsConfig('totalvoice', 'from', e.target.value)} 
                      placeholder="+5511999999999"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestSms}>Enviar teste</Button>
              <Button onClick={handleSaveSmsConfig}>Salvar configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configuração de Push Notifications */}
        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Push Notifications</CardTitle>
              <CardDescription>
                Configure o serviço que será utilizado para envio de notificações push.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pushProvider">Provedor</Label>
                <Select value={pushProvider} onValueChange={setPushProvider}>
                  <SelectTrigger id="pushProvider">
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firebase">Firebase (FCM)</SelectItem>
                    <SelectItem value="onesignal">OneSignal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pushProvider === 'firebase' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firebaseApiKey">API Key</Label>
                    <Input 
                      id="firebaseApiKey" 
                      value={pushConfig.firebase.apiKey} 
                      onChange={(e) => updatePushConfig('firebase', 'apiKey', e.target.value)} 
                      placeholder="AIzaxxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firebaseProjectId">Project ID</Label>
                    <Input 
                      id="firebaseProjectId" 
                      value={pushConfig.firebase.projectId} 
                      onChange={(e) => updatePushConfig('firebase', 'projectId', e.target.value)} 
                      placeholder="edunexia-app"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firebaseAppId">Application ID</Label>
                    <Input 
                      id="firebaseAppId" 
                      value={pushConfig.firebase.applicationId} 
                      onChange={(e) => updatePushConfig('firebase', 'applicationId', e.target.value)} 
                      placeholder="1:123456789:web:abcdef"
                    />
                  </div>
                </div>
              )}

              {pushProvider === 'onesignal' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="onesignalAppId">App ID</Label>
                    <Input 
                      id="onesignalAppId" 
                      value={pushConfig.onesignal.appId} 
                      onChange={(e) => updatePushConfig('onesignal', 'appId', e.target.value)} 
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="onesignalApiKey">API Key</Label>
                    <Input 
                      id="onesignalApiKey" 
                      value={pushConfig.onesignal.apiKey} 
                      onChange={(e) => updatePushConfig('onesignal', 'apiKey', e.target.value)} 
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestPush}>Enviar teste</Button>
              <Button onClick={handleSavePushConfig}>Salvar configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 