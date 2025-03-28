import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestBody {
  apiKey: string;
  businessAccountId: string;
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obter dados da solicitação
    const requestData: RequestBody = await req.json()
    
    // Validar dados de entrada
    if (!requestData.apiKey || !requestData.businessAccountId) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos para listar templates' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Buscar templates na API do WhatsApp
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${requestData.businessAccountId}/message_templates?limit=50`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${requestData.apiKey}`
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Falha ao obter templates do WhatsApp',
          details: errorData
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const templatesData = await response.json()
    
    // Processar os templates para extrair dados relevantes
    const processedTemplates = templatesData.data.map((template: any) => {
      // Extrair textos dos componentes para exibição
      const componentsText: string[] = [];
      
      if (template.components) {
        template.components.forEach((component: any) => {
          if (component.type === 'BODY' && component.text) {
            componentsText.push(component.text);
          } else if (component.type === 'HEADER' && component.text) {
            componentsText.push(`Cabeçalho: ${component.text}`);
          } else if (component.type === 'FOOTER' && component.text) {
            componentsText.push(`Rodapé: ${component.text}`);
          } else if (component.type === 'BUTTONS' && component.buttons) {
            component.buttons.forEach((button: any, index: number) => {
              componentsText.push(`Botão ${index + 1}: ${button.text}`);
            });
          }
        });
      }
      
      return {
        id: template.id,
        name: template.name,
        status: template.status,
        category: template.category,
        language: template.language,
        components_text: componentsText,
      };
    });

    // Armazenar os templates localmente no banco de dados para fácil acesso
    for (const template of processedTemplates) {
      await supabaseClient
        .from('comunicacao_whatsapp_templates')
        .upsert({
          whatsapp_template_id: template.id,
          name: template.name,
          status: template.status,
          category: template.category,
          language: template.language,
          components_text: template.components_text,
          atualizado_at: new Date().toISOString()
        }, {
          onConflict: 'whatsapp_template_id'
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        templates: processedTemplates,
        count: processedTemplates.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao listar templates:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro interno ao listar templates',
        details: error.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 