create type modalidade_curso as enum ('presencial', 'ead', 'hibrido');

create table cursos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  carga_horaria integer not null,
  duracao_meses integer not null,
  modalidade modalidade_curso not null,
  coordenador_id uuid not null references auth.users(id),
  institution_id uuid not null references institutions(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table cursos enable row level security;

create policy "Cursos são visíveis para usuários autenticados da mesma instituição"
  on cursos for select
  to authenticated
  using (institution_id = auth.jwt() ->> 'institution_id'::text);

create policy "Administradores podem criar cursos"
  on cursos for insert
  to authenticated
  with check (
    auth.jwt() ->> 'role' = 'admin'
    and institution_id = auth.jwt() ->> 'institution_id'::text
  );

create policy "Administradores podem atualizar cursos"
  on cursos for update
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin'
    and institution_id = auth.jwt() ->> 'institution_id'::text
  )
  with check (
    auth.jwt() ->> 'role' = 'admin'
    and institution_id = auth.jwt() ->> 'institution_id'::text
  );

create policy "Administradores podem excluir cursos"
  on cursos for delete
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'admin'
    and institution_id = auth.jwt() ->> 'institution_id'::text
  );

-- Trigger para atualizar o updated_at
create trigger handle_updated_at before update on cursos
  for each row execute procedure moddatetime (updated_at); 