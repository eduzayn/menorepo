-- Criar buckets para armazenamento de arquivos
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documentos', 'documentos', true),
  ('contratos', 'contratos', true),
  ('pagamentos', 'pagamentos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para documentos
CREATE POLICY "Documentos acessíveis para usuários autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documentos');

CREATE POLICY "Upload de documentos permitido para usuários autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentos');

-- Políticas para contratos
CREATE POLICY "Contratos acessíveis para usuários autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contratos');

CREATE POLICY "Upload de contratos permitido para usuários autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contratos');

-- Políticas para pagamentos
CREATE POLICY "Comprovantes acessíveis para usuários autenticados"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'pagamentos');

CREATE POLICY "Upload de comprovantes permitido para usuários autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pagamentos'); 