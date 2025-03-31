import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Button, 
  Input,
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Label,
  Textarea,
  Switch,
  Alert,
  AlertDescription,
  AlertTitle
} from '@edunexia/ui-components';
import { ChromePicker } from 'react-color';
import ChatWidget from '../components/widget/ChatWidget';
import WidgetEmbed from '../components/widget/WidgetEmbed';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { AlertCircle, Check, Info, Save } from 'lucide-react';

interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
}

function WidgetConfigPage() {
  const { user } = useAuth();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para configuração do widget
  const [config, setConfig] = useState({
    title: 'Atendimento Edunéxia',
    subtitle: 'Estamos online e prontos para ajudar',
    primaryColor: '#2563EB',
    logoUrl: '/logo.svg',
    position: 'bottom-right',
    greeting: 'Olá! Como posso ajudar você hoje?',
    departamentoId: '',
    autoFocus: true
  });

  // Carrega departamentos
  React.useEffect(() => {
    const carregarDepartamentos = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('departamentos')
          .select('id, nome, descricao')
          .eq('ativo', true);
          
        if (error) throw error;
        setDepartamentos(data || []);
      } catch (err) {
        console.error('Erro ao carregar departamentos:', err);
        setError('Erro ao carregar departamentos');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarDepartamentos();
    
    // Carregar configuração salva
    const carregarConfiguracao = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('valor')
          .eq('chave', 'widget_config')
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            throw error;
          }
          return; // Config não existe ainda
        }
        
        if (data?.valor) {
          setConfig(JSON.parse(data.valor));
        }
      } catch (err) {
        console.error('Erro ao carregar configuração do widget:', err);
      }
    };
    
    carregarConfiguracao();
  }, []);

  // Salvar configurações
  const salvarConfiguracao = async () => {
    setIsLoading(true);
    setSavedSuccess(false);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({
          chave: 'widget_config',
          valor: JSON.stringify(config),
          atualizado_por: user?.id,
          atualizado_em: new Date().toISOString()
        }, {
          onConflict: 'chave'
        });
        
      if (error) throw error;
      
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError('Falha ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar configuração
  const handleConfigChange = (
    field: keyof typeof config,
    value: string | boolean
  ) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Widget de Chat</h1>
        <p className="text-gray-600">
          Configure e obtenha o código do widget para integrar em seu site.
        </p>
      </div>
      
      {savedSuccess && (
        <Alert variant="success" className="mb-6">
          <Check className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Configurações salvas com sucesso!</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Tabs defaultValue="aparencia" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="aparencia">Aparência</TabsTrigger>
              <TabsTrigger value="comportamento">Comportamento</TabsTrigger>
              <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
            </TabsList>
            
            <TabsContent value="aparencia" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Estilo do widget</h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="logoUrl">URL do logo</Label>
                    <Input
                      id="logoUrl"
                      value={config.logoUrl}
                      onChange={(e) => handleConfigChange('logoUrl', e.target.value)}
                      placeholder="https://seu-site.com/logo.png"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título do widget</Label>
                    <Input
                      id="title"
                      value={config.title}
                      onChange={(e) => handleConfigChange('title', e.target.value)}
                      placeholder="Atendimento"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input
                      id="subtitle"
                      value={config.subtitle}
                      onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                      placeholder="Estamos online"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Cor primária</Label>
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-12 h-8 rounded border"
                        style={{ backgroundColor: config.primaryColor }} 
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                        placeholder="#2563EB"
                      />
                    </div>
                    <ChromePicker
                      color={config.primaryColor}
                      onChange={(color) => handleConfigChange('primaryColor', color.hex)}
                      disableAlpha
                      className="mt-2 w-full"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="position">Posição</Label>
                    <Select
                      value={config.position}
                      onValueChange={(value) => handleConfigChange('position', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Inferior direito</SelectItem>
                        <SelectItem value="bottom-left">Inferior esquerdo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="comportamento" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Comportamento do widget</h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="departamentoId">Departamento padrão</Label>
                    <Select
                      value={config.departamentoId}
                      onValueChange={(value) => handleConfigChange('departamentoId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Automático (baseado nas palavras-chave)</SelectItem>
                        {departamentos.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id}>
                            {dep.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Define o departamento para onde as conversas serão encaminhadas automaticamente.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      id="autoFocus"
                      checked={config.autoFocus}
                      onCheckedChange={(checked) => handleConfigChange('autoFocus', checked)}
                    />
                    <Label htmlFor="autoFocus">Auto-foco no campo de mensagem</Label>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="mensagens" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Mensagens</h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="greeting">Mensagem de boas-vindas</Label>
                    <Textarea
                      id="greeting"
                      value={config.greeting}
                      onChange={(e) => handleConfigChange('greeting', e.target.value)}
                      placeholder="Olá! Como posso ajudar você hoje?"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button 
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={salvarConfiguracao}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar configurações
          </Button>
        </div>
        
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Pré-visualização</h3>
            <div className="h-96 border rounded-md relative">
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="p-4 text-center">
                  <p className="text-gray-600 mb-2">Simule como o widget aparecerá em seu site</p>
                  <ChatWidget {...config} />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <WidgetEmbed 
              config={config} 
              baseUrl={window.location.origin} 
            />
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Observações importantes:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>O widget será disponibilizado apenas para visitantes, não para usuários logados.</li>
                  <li>As conversas iniciadas pelo widget aparecerão na lista de atendimentos.</li>
                  <li>Certifique-se de que haja pelo menos um atendente disponível no departamento selecionado.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default WidgetConfigPage; 