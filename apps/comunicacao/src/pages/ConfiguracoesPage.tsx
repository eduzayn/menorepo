import React, { useState } from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { 
  BellIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  CogIcon, 
  LinkIcon, 
  ArrowPathIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ConfiguracoesPage() {
  // Estado para armazenar configurações
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  const [notificacoesNovoLead, setNotificacoesNovoLead] = useState(true);
  const [notificacoesNovaConversa, setNotificacoesNovaConversa] = useState(true);
  const [notificacoesCampanha, setNotificacoesCampanha] = useState(true);
  
  // Estado para configurações de integrações
  const [whatsappAtivo, setWhatsappAtivo] = useState(false);
  const [whatsappNumero, setWhatsappNumero] = useState('');
  const [telegramAtivo, setTelegramAtivo] = useState(false);
  const [telegramToken, setTelegramToken] = useState('');
  const [apiToken, setApiToken] = useState('edx_tk_1234567890abcdef');
  
  // Estado para configurações do módulo
  const [respostasAutomaticas, setRespostasAutomaticas] = useState(true);
  const [tempoInatividade, setTempoInatividade] = useState('30');
  const [limiteMensagens, setLimiteMensagens] = useState('100');
  const [temaVisual, setTemaVisual] = useState('light');
  
  // Estado para configurações de equipe
  const [atribuicaoAutomatica, setAtribuicaoAutomatica] = useState(true);
  const [horariosAtendimento, setHorariosAtendimento] = useState({
    inicio: '09:00',
    fim: '18:00'
  });
  const [diasAtendimento, setDiasAtendimento] = useState(['1', '2', '3', '4', '5']);

  // Função para salvar configurações
  const handleSaveSettings = (section: string) => {
    // Simulação de salvamento
    toast.success(`Configurações de ${section} salvas com sucesso!`);
  };

  // Função para regenerar token da API
  const handleRegenerateToken = () => {
    const newToken = 'edx_tk_' + Math.random().toString(36).substring(2, 15);
    setApiToken(newToken);
    toast.success('Token da API regenerado com sucesso!');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Personalize as configurações do módulo de comunicação.
          </p>
        </div>

        <Tabs defaultValue="notificacoes" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <BellIcon className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="integracao" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>Integrações</span>
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <LockClosedIcon className="h-4 w-4" />
              <span>Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="equipe" className="flex items-center gap-2">
              <UserGroupIcon className="h-4 w-4" />
              <span>Equipe</span>
            </TabsTrigger>
            <TabsTrigger value="geral" className="flex items-center gap-2">
              <CogIcon className="h-4 w-4" />
              <span>Geral</span>
            </TabsTrigger>
          </TabsList>

          {/* Configurações de Notificações */}
          <TabsContent value="notificacoes" className="mt-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Preferências de Notificações</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações por E-mail</h3>
                    <p className="text-sm text-muted-foreground">Receba notificações por e-mail</p>
                  </div>
                  <Switch 
                    checked={notificacoesEmail} 
                    onCheckedChange={setNotificacoesEmail} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações Push</h3>
                    <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                  </div>
                  <Switch 
                    checked={notificacoesPush} 
                    onCheckedChange={setNotificacoesPush} 
                  />
                </div>
                
                <Separator />
                
                <h3 className="font-medium">Eventos para notificação</h3>
                
                <div className="space-y-4 ml-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Novo Lead</h4>
                      <p className="text-sm text-muted-foreground">Quando um novo lead for registrado</p>
                    </div>
                    <Switch 
                      checked={notificacoesNovoLead} 
                      onCheckedChange={setNotificacoesNovoLead} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Nova Conversa</h4>
                      <p className="text-sm text-muted-foreground">Quando uma conversa for iniciada</p>
                    </div>
                    <Switch 
                      checked={notificacoesNovaConversa} 
                      onCheckedChange={setNotificacoesNovaConversa} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Campanhas</h4>
                      <p className="text-sm text-muted-foreground">Atualizações sobre campanhas</p>
                    </div>
                    <Switch 
                      checked={notificacoesCampanha} 
                      onCheckedChange={setNotificacoesCampanha} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => handleSaveSettings('notificações')}>Salvar Configurações</Button>
              </div>
            </div>
          </TabsContent>

          {/* Configurações de Integração */}
          <TabsContent value="integracao" className="mt-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Integrações com Serviços Externos</h2>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">WhatsApp Business API</h3>
                      <p className="text-sm text-muted-foreground">Integração com WhatsApp para mensagens</p>
                    </div>
                    <Switch 
                      checked={whatsappAtivo} 
                      onCheckedChange={setWhatsappAtivo} 
                    />
                  </div>
                  
                  {whatsappAtivo && (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp-numero">Número do WhatsApp</Label>
                          <Input 
                            id="whatsapp-numero" 
                            value={whatsappNumero} 
                            onChange={(e) => setWhatsappNumero(e.target.value)} 
                            placeholder="+5511999999999" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp-tipo">Tipo de Integração</Label>
                          <Select defaultValue="cloud">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cloud">Cloud API</SelectItem>
                              <SelectItem value="on-premise">On-Premise API</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Telegram Bot</h3>
                      <p className="text-sm text-muted-foreground">Integração com Telegram para mensagens</p>
                    </div>
                    <Switch 
                      checked={telegramAtivo} 
                      onCheckedChange={setTelegramAtivo} 
                    />
                  </div>
                  
                  {telegramAtivo && (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="telegram-token">Token do Bot</Label>
                        <Input 
                          id="telegram-token" 
                          value={telegramToken} 
                          onChange={(e) => setTelegramToken(e.target.value)} 
                          type="password" 
                          placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Google Calendar</h3>
                      <p className="text-sm text-muted-foreground">Sincronize reuniões com o Google Calendar</p>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Zapier</h3>
                      <p className="text-sm text-muted-foreground">Conecte outras ferramentas via Zapier</p>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => handleSaveSettings('integrações')}>Salvar Configurações</Button>
              </div>
            </div>
          </TabsContent>

          {/* Configurações de Segurança */}
          <TabsContent value="seguranca" className="mt-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Segurança e Privacidade</h2>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">API Token</h3>
                  <div className="flex items-center space-x-4">
                    <Input 
                      value={apiToken} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      onClick={handleRegenerateToken}
                      variant="outline"
                      size="icon"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use este token para acessar a API. Mantenha-o seguro.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Histórico de Acesso</h3>
                  <div className="rounded-md border">
                    <div className="px-4 py-3 bg-muted/50 flex items-center gap-4 text-sm font-medium">
                      <div className="w-1/4">Usuário</div>
                      <div className="w-1/4">Endereço IP</div>
                      <div className="w-1/4">Data/Hora</div>
                      <div className="w-1/4">Ação</div>
                    </div>
                    <div className="divide-y">
                      <div className="px-4 py-3 flex items-center gap-4 text-sm">
                        <div className="w-1/4">admin@edunexia.com</div>
                        <div className="w-1/4">192.168.1.1</div>
                        <div className="w-1/4">12/05/2023 15:30</div>
                        <div className="w-1/4">Login</div>
                      </div>
                      <div className="px-4 py-3 flex items-center gap-4 text-sm">
                        <div className="w-1/4">admin@edunexia.com</div>
                        <div className="w-1/4">192.168.1.1</div>
                        <div className="w-1/4">10/05/2023 09:45</div>
                        <div className="w-1/4">Alteração de configurações</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Autenticação de Dois Fatores</h3>
                    <p className="text-sm text-muted-foreground">Adiciona uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Política de Privacidade</h3>
                    <p className="text-sm text-muted-foreground">Visualize e aceite as políticas</p>
                  </div>
                  <Button variant="outline">Visualizar</Button>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => handleSaveSettings('segurança')}>Salvar Configurações</Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Configurações de Equipe */}
          <TabsContent value="equipe" className="mt-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Gerenciamento de Equipe</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Atribuição Automática de Leads</h3>
                    <p className="text-sm text-muted-foreground">Distribua leads automaticamente entre a equipe</p>
                  </div>
                  <Switch 
                    checked={atribuicaoAutomatica} 
                    onCheckedChange={setAtribuicaoAutomatica} 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Horários de Atendimento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="horario-inicio">Horário de Início</Label>
                      <Input 
                        id="horario-inicio" 
                        type="time" 
                        value={horariosAtendimento.inicio} 
                        onChange={(e) => setHorariosAtendimento({...horariosAtendimento, inicio: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horario-fim">Horário de Término</Label>
                      <Input 
                        id="horario-fim" 
                        type="time" 
                        value={horariosAtendimento.fim} 
                        onChange={(e) => setHorariosAtendimento({...horariosAtendimento, fim: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Dias de Atendimento</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia, index) => (
                      <Button
                        key={index}
                        variant={diasAtendimento.includes(String(index)) ? "default" : "outline"}
                        onClick={() => {
                          const indexStr = String(index);
                          setDiasAtendimento(
                            diasAtendimento.includes(indexStr)
                              ? diasAtendimento.filter(d => d !== indexStr)
                              : [...diasAtendimento, indexStr]
                          );
                        }}
                        className="px-4"
                      >
                        {dia}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Mensagem de Ausência</h3>
                  <textarea 
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="Digite a mensagem que será exibida quando a equipe estiver ausente..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => handleSaveSettings('equipe')}>Salvar Configurações</Button>
              </div>
            </div>
          </TabsContent>

          {/* Configurações Gerais */}
          <TabsContent value="geral" className="mt-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Configurações Gerais do Módulo</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Respostas Automáticas</h3>
                    <p className="text-sm text-muted-foreground">Ativar respostas automáticas para mensagens</p>
                  </div>
                  <Switch 
                    checked={respostasAutomaticas} 
                    onCheckedChange={setRespostasAutomaticas} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tempo-inatividade">Tempo de Inatividade (minutos)</Label>
                    <Input 
                      id="tempo-inatividade" 
                      type="number" 
                      value={tempoInatividade} 
                      onChange={(e) => setTempoInatividade(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">Tempo após o qual um usuário é considerado inativo</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="limite-mensagens">Limite de Mensagens</Label>
                    <Input 
                      id="limite-mensagens" 
                      type="number" 
                      value={limiteMensagens} 
                      onChange={(e) => setLimiteMensagens(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">Número máximo de mensagens exibidas por conversa</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tema-visual">Tema Visual</Label>
                  <Select 
                    value={temaVisual} 
                    onValueChange={setTemaVisual}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Backups</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline">Exportar Dados</Button>
                    <Button variant="outline">Importar Dados</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Limpeza de Dados</h3>
                  <Button variant="destructive">Limpar Cache</Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Isso irá remover dados temporários e limpar o cache. Não afeta conversas ou leads.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => handleSaveSettings('gerais')}>Salvar Configurações</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 