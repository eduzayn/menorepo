-- Script para criar tabelas básicas para integração RH-Contabilidade
-- Executado por: Supabase CLI
-- Criado em: 2024-07-02

-- Verificar e criar tabelas essenciais para contabilidade
DO $$
BEGIN
  -- Tabela de contas contábeis (se não existir)
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'contabilidade' AND table_name = 'contas') THEN
    CREATE TABLE contabilidade.contas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      codigo VARCHAR(20) NOT NULL,
      nome VARCHAR(100) NOT NULL,
      descricao TEXT,
      tipo contabilidade.tipo_conta NOT NULL,
      natureza contabilidade.natureza_conta NOT NULL,
      conta_pai_id UUID REFERENCES contabilidade.contas(id),
      permite_lancamentos BOOLEAN NOT NULL DEFAULT FALSE,
      ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      
      CONSTRAINT uk_contas_codigo_instituicao UNIQUE (instituicao_id, codigo)
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_contas_instituicao ON contabilidade.contas(instituicao_id);
    CREATE INDEX idx_contas_pai ON contabilidade.contas(conta_pai_id);
    
    -- Trigger para atualizar o updated_at
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON contabilidade.contas
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
    
    -- RLS (Row Level Security)
    ALTER TABLE contabilidade.contas ENABLE ROW LEVEL SECURITY;
    
    -- Políticas de acesso
    CREATE POLICY "Usuários podem ver contas de suas instituições"
      ON contabilidade.contas
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
      ));
    
    CREATE POLICY "Apenas contadores podem gerenciar contas"
      ON contabilidade.contas
      FOR ALL
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
        AND perfil IN ('admin', 'contador')
      ));
  END IF;
  
  -- Tabela de lançamentos contábeis (se não existir)
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'contabilidade' AND table_name = 'lancamentos') THEN
    CREATE TABLE contabilidade.lancamentos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      numero_lancamento VARCHAR(20) NOT NULL,
      data_lancamento DATE NOT NULL,
      data_competencia DATE NOT NULL,
      tipo contabilidade.tipo_lancamento NOT NULL DEFAULT 'MANUAL',
      conta_debito_id UUID NOT NULL REFERENCES contabilidade.contas(id),
      conta_credito_id UUID NOT NULL REFERENCES contabilidade.contas(id),
      valor DECIMAL(15,2) NOT NULL CHECK (valor > 0),
      historico TEXT NOT NULL,
      documento_ref VARCHAR(50),
      integracao_id UUID,
      created_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      
      CONSTRAINT uk_lancamento_numero_instituicao UNIQUE (instituicao_id, numero_lancamento),
      CONSTRAINT check_different_accounts CHECK (conta_debito_id <> conta_credito_id)
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_lancamentos_instituicao ON contabilidade.lancamentos(instituicao_id);
    CREATE INDEX idx_lancamentos_competencia ON contabilidade.lancamentos(data_competencia);
    CREATE INDEX idx_lancamentos_contas ON contabilidade.lancamentos(conta_debito_id, conta_credito_id);
    CREATE INDEX idx_lancamentos_integracao ON contabilidade.lancamentos(integracao_id);
    
    -- RLS (Row Level Security)
    ALTER TABLE contabilidade.lancamentos ENABLE ROW LEVEL SECURITY;
    
    -- Políticas de acesso
    CREATE POLICY "Usuários podem ver lançamentos de suas instituições"
      ON contabilidade.lancamentos
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
      ));
    
    CREATE POLICY "Apenas contadores podem inserir lançamentos"
      ON contabilidade.lancamentos
      FOR INSERT
      WITH CHECK (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
        AND perfil IN ('admin', 'contador')
      ));
  END IF;
  
  -- Tabela de registros de integração (se não existir)
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'contabilidade' AND table_name = 'integracoes') THEN
    CREATE TABLE contabilidade.integracoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      modulo_origem VARCHAR(20) NOT NULL,
      modulo_destino VARCHAR(20) NOT NULL,
      referencia_origem VARCHAR(50) NOT NULL,
      referencia_destino VARCHAR(50),
      status contabilidade.status_integracao NOT NULL DEFAULT 'PENDENTE',
      mensagem TEXT,
      detalhes JSONB,
      data_integracao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      processado_por UUID REFERENCES auth.users(id),
      
      CONSTRAINT uk_integracao_ref UNIQUE (modulo_origem, referencia_origem, modulo_destino)
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_integracoes_instituicao ON contabilidade.integracoes(instituicao_id);
    CREATE INDEX idx_integracoes_status ON contabilidade.integracoes(status);
    CREATE INDEX idx_integracoes_origem ON contabilidade.integracoes(modulo_origem, referencia_origem);
    
    -- RLS (Row Level Security)
    ALTER TABLE contabilidade.integracoes ENABLE ROW LEVEL SECURITY;
    
    -- Políticas de acesso
    CREATE POLICY "Usuários podem ver integrações de suas instituições"
      ON contabilidade.integracoes
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
      ));
    
    CREATE POLICY "Integrações podem ser inseridas pelo sistema"
      ON contabilidade.integracoes
      FOR INSERT
      WITH CHECK (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
        AND perfil IN ('admin', 'contador', 'sistema')
      ));
  END IF;
  
  -- Tabela de relatórios (se não existir)
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'contabilidade' AND table_name = 'relatorios') THEN
    CREATE TABLE contabilidade.relatorios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      tipo contabilidade.tipo_relatorio NOT NULL,
      titulo VARCHAR(100) NOT NULL,
      descricao TEXT,
      periodo_inicio DATE NOT NULL,
      periodo_fim DATE NOT NULL,
      conteudo JSONB NOT NULL,
      parametros JSONB,
      gerado_por UUID REFERENCES auth.users(id),
      gerado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_relatorios_instituicao ON contabilidade.relatorios(instituicao_id);
    CREATE INDEX idx_relatorios_tipo ON contabilidade.relatorios(tipo);
    CREATE INDEX idx_relatorios_periodo ON contabilidade.relatorios(periodo_inicio, periodo_fim);
    
    -- RLS (Row Level Security)
    ALTER TABLE contabilidade.relatorios ENABLE ROW LEVEL SECURITY;
    
    -- Políticas de acesso
    CREATE POLICY "Usuários podem ver relatórios de suas instituições"
      ON contabilidade.relatorios
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
      ));
  END IF;
END $$;

-- Tabelas específicas para o RH
DO $$
BEGIN
  -- Tabela de pendências de contabilização (se não existir)
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'rh' AND table_name = 'pendencias_contabilizacao') THEN
    CREATE TABLE rh.pendencias_contabilizacao (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instituicao_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
      tipo rh.tipo_pendencia NOT NULL,
      referencia_id UUID NOT NULL,
      mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
      ano INTEGER NOT NULL CHECK (ano >= 2000),
      valor DECIMAL(15,2) NOT NULL,
      detalhes JSONB,
      status rh.status_pendencia NOT NULL DEFAULT 'PENDENTE',
      data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data_processamento TIMESTAMPTZ,
      processado_por UUID REFERENCES auth.users(id),
      
      CONSTRAINT uk_pendencia_ref UNIQUE (instituicao_id, tipo, referencia_id, mes, ano)
    );
    
    -- Índices para melhor performance
    CREATE INDEX idx_pendencias_instituicao ON rh.pendencias_contabilizacao(instituicao_id);
    CREATE INDEX idx_pendencias_status ON rh.pendencias_contabilizacao(status);
    CREATE INDEX idx_pendencias_periodo ON rh.pendencias_contabilizacao(mes, ano);
    
    -- RLS (Row Level Security)
    ALTER TABLE rh.pendencias_contabilizacao ENABLE ROW LEVEL SECURITY;
    
    -- Políticas de acesso
    CREATE POLICY "Usuários podem ver pendências de suas instituições"
      ON rh.pendencias_contabilizacao
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
      ));
    
    CREATE POLICY "Apenas RH e contadores podem gerenciar pendências"
      ON rh.pendencias_contabilizacao
      FOR ALL
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
        AND perfil IN ('admin', 'contador', 'rh')
      ));
  END IF;
  
  -- Criar tabela de logs de integração, se não existir
  IF NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'integration_logs') THEN
    CREATE TABLE public.integration_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      usuario_id UUID REFERENCES auth.users(id),
      instituicao_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
      modulo VARCHAR(50) NOT NULL,
      operacao VARCHAR(50) NOT NULL,
      parametros JSONB,
      resultado JSONB,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip_address VARCHAR(50)
    );
    
    -- Índices
    CREATE INDEX idx_logs_instituicao ON public.integration_logs(instituicao_id);
    CREATE INDEX idx_logs_modulo ON public.integration_logs(modulo, operacao);
    CREATE INDEX idx_logs_timestamp ON public.integration_logs(timestamp);
    
    -- RLS
    ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;
    
    -- Políticas
    CREATE POLICY "Apenas administradores podem ver todos os logs"
      ON public.integration_logs
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE perfil = 'admin'
      ));
    
    CREATE POLICY "Usuários podem ver logs de suas instituições"
      ON public.integration_logs
      FOR SELECT
      USING (auth.uid() IN (
        SELECT usuario_id FROM public.usuarios_instituicoes 
        WHERE instituicao_id = instituicao_id
      ));
    
    COMMENT ON TABLE public.integration_logs IS 'Logs de integração entre módulos';
  END IF;
END $$;

-- [Fim do arquivo] 