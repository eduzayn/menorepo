-- Criar bucket para documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false);

-- Políticas de acesso ao bucket
CREATE POLICY "Alunos podem fazer upload de seus documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Alunos podem ver seus próprios documentos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Sistema pode acessar documentos para validação"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'documentos');

-- Função para gerar URL segura do documento
CREATE OR REPLACE FUNCTION storage.get_documento_url(
  p_documento_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_documento documentos;
  v_url TEXT;
BEGIN
  -- Verificar se o documento pertence ao usuário
  SELECT * INTO v_documento
  FROM documentos
  WHERE id = p_documento_id
  AND aluno_id = auth.uid();

  IF v_documento IS NULL THEN
    RAISE EXCEPTION 'Documento não encontrado ou acesso não autorizado';
  END IF;

  -- Gerar URL segura
  SELECT storage.create_signed_url(
    'documentos',
    v_documento.caminho,
    3600 -- URL válida por 1 hora
  ) INTO v_url;

  RETURN v_url;
END;
$$; 