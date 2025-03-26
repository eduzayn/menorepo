CREATE OR REPLACE FUNCTION validar_documento(
  p_documento_id UUID
)
RETURNS validacao_documentos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_documento documentos;
  v_validacao validacao_documentos;
BEGIN
  -- Buscar documento
  SELECT * INTO v_documento
  FROM documentos
  WHERE id = p_documento_id;

  -- Criar registro de validação
  INSERT INTO validacao_documentos (
    documento_id,
    status,
    feedback,
    data_validacao
  ) VALUES (
    p_documento_id,
    'EM_ANALISE',
    'Documento em análise pelo sistema de IA',
    NOW()
  ) RETURNING * INTO v_validacao;

  -- Chamar Edge Function para validação por IA
  PERFORM net.http_post(
    url := 'https://seu-dominio.com/validar-documento',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'documento_id', p_documento_id,
      'url', v_documento.url,
      'tipo', v_documento.tipo
    )::text
  );

  RETURN v_validacao;
END;
$$; 