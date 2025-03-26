-- Criar bucket para documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', true);

-- Criar política para upload de documentos
CREATE POLICY "Alunos podem fazer upload de seus próprios documentos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documentos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Criar política para visualização de documentos
CREATE POLICY "Alunos podem visualizar seus próprios documentos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documentos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Criar política para deleção de documentos
CREATE POLICY "Alunos podem deletar seus próprios documentos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documentos' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 