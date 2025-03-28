import { supabase } from '../lib/supabase'

export type Contrato = {
  id: string;
  aluno_id: string;
  matricula_id: string;
  html_content: string;
  assinado: boolean;
  data_assinatura?: string;
  assinatura_url?: string;
  assinatura_aluno?: string;
  assinatura_instituicao?: string;
  created_at: string;
  updated_at: string;
};

export const contratoService = {
  async buscarContratos(matriculaId?: string, alunoId?: string) {
    let query = supabase
      .from('contratos')
      .select('*');
    
    if (matriculaId) {
      query = query.eq('matricula_id', matriculaId);
    }
    
    if (alunoId) {
      query = query.eq('aluno_id', alunoId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar contratos:', error);
      throw new Error('Não foi possível buscar os contratos.');
    }
    
    return data || [];
  },
  
  async buscarContrato(id: string) {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar contrato:', error);
      throw new Error('Não foi possível buscar o contrato.');
    }
    
    return data as Contrato;
  },
  
  async criarContrato(contrato: Partial<Contrato>) {
    const { data, error } = await supabase
      .from('contratos')
      .insert(contrato)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar contrato:', error);
      throw new Error('Não foi possível criar o contrato.');
    }
    
    return data as Contrato;
  },
  
  async assinarContrato(id: string, dadosAssinatura: {
    assinado: boolean;
    data_assinatura: string;
    assinatura_url: string;
    assinatura_aluno: string;
  }) {
    const { data, error } = await supabase
      .from('contratos')
      .update(dadosAssinatura)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao assinar contrato:', error);
      throw new Error('Não foi possível assinar o contrato.');
    }
    
    return data as Contrato;
  },
  
  async gerarContratoHTML(matriculaId: string) {
    // Em uma implementação real, aqui teríamos uma chamada para gerar HTML a partir de template
    // Simulação para desenvolvimento
    const template = `
      <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS</h2>
      <p>
        Pelo presente instrumento particular de contrato de prestação de serviços educacionais, de um lado,
        <strong>EDUNÉXIA EDUCACIONAL LTDA</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob 
        nº XX.XXX.XXX/0001-XX, com sede na Rua dos Educadores, nº 1000, Bairro Centro, CEP XXXXX-XXX, 
        neste ato representada por seu representante legal, doravante denominada <strong>CONTRATADA</strong>,
        e de outro lado, o(a) aluno(a) qualificado(a) na ficha de matrícula, doravante denominado(a) 
        <strong>CONTRATANTE</strong>, têm entre si justo e contratado o seguinte:
      </p>
      
      <h3>CLÁUSULA PRIMEIRA - DO OBJETO</h3>
      <p>
        O presente contrato tem por objeto a prestação de serviços educacionais pela CONTRATADA ao CONTRATANTE,
        referente ao curso escolhido pelo CONTRATANTE, de acordo com o plano de pagamento selecionado.
      </p>
      
      <h3>CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA</h3>
      <p>
        A CONTRATADA se obriga a:
        <ul>
          <li>Disponibilizar acesso às aulas, materiais didáticos e demais recursos educacionais conforme o curso contratado;</li>
          <li>Manter a plataforma educacional funcionando adequadamente;</li>
          <li>Fornecer suporte técnico e pedagógico ao CONTRATANTE;</li>
          <li>Emitir certificado de conclusão, desde que atendidos os requisitos mínimos de aproveitamento e frequência.</li>
        </ul>
      </p>
      
      <h3>CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE</h3>
      <p>
        O CONTRATANTE se obriga a:
        <ul>
          <li>Efetuar o pagamento das parcelas nos prazos estabelecidos;</li>
          <li>Utilizar os recursos educacionais de forma ética e responsável;</li>
          <li>Não compartilhar seu acesso com terceiros;</li>
          <li>Cumprir com as atividades propostas dentro dos prazos estabelecidos.</li>
        </ul>
      </p>
      
      <h3>CLÁUSULA QUARTA - DO VALOR E FORMA DE PAGAMENTO</h3>
      <p>
        O valor total do curso, forma de pagamento, quantidade de parcelas e datas de vencimento estão
        estabelecidos no plano de pagamento selecionado pelo CONTRATANTE no momento da matrícula.
      </p>
      
      <h3>CLÁUSULA QUINTA - DA VIGÊNCIA</h3>
      <p>
        O presente contrato terá início na data de sua assinatura e permanecerá em vigor até a conclusão
        do curso contratado ou até que haja manifestação expressa de cancelamento por qualquer das partes.
      </p>
      
      <h3>CLÁUSULA SEXTA - DA RESCISÃO</h3>
      <p>
        O presente contrato poderá ser rescindido:
        <ul>
          <li>Pelo CONTRATANTE, mediante formalização por escrito, com antecedência mínima de 30 dias;</li>
          <li>Pela CONTRATADA, em caso de inadimplência superior a 60 dias ou descumprimento de cláusulas contratuais.</li>
        </ul>
      </p>
      
      <h3>CLÁUSULA SÉTIMA - DISPOSIÇÕES GERAIS</h3>
      <p>
        Os casos omissos serão resolvidos pela direção da CONTRATADA.
        O CONTRATANTE declara ter lido e compreendido todas as cláusulas deste contrato, concordando integralmente com seus termos.
      </p>
      
      <p class="date-signature">
        Local e data: ___________________________, _____ de _______________ de _________.
      </p>
    `;
    
    return template;
  },

  async uploadContrato(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('contratos')
      .upload(path, file)

    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('contratos')
      .getPublicUrl(data.path)

    return publicUrl
  }
} 