'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const perfilSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  cargo: z.string().min(2, 'Cargo deve ter no mínimo 2 caracteres'),
  departamento: z.string().min(2, 'Departamento deve ter no mínimo 2 caracteres'),
  assinatura: z.string().optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

export default function PerfilConfig() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      telefone: '(11) 99999-9999',
      cargo: 'Analista',
      departamento: 'TI',
      assinatura: 'Atenciosamente,\nJoão Silva\nAnalista de TI',
    },
  });

  const onSubmit = async (data: PerfilFormData) => {
    try {
      // Aqui você implementaria a lógica para salvar os dados
      console.log('Dados do perfil:', data);
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informações Pessoais</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nome">Nome</Label>
          <input
            {...register('nome')}
            id="nome"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.nome && (
            <p className="text-sm text-destructive">{errors.nome.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="telefone">Telefone</Label>
          <input
            {...register('telefone')}
            id="telefone"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.telefone && (
            <p className="text-sm text-destructive">{errors.telefone.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cargo">Cargo</Label>
          <input
            {...register('cargo')}
            id="cargo"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.cargo && (
            <p className="text-sm text-destructive">{errors.cargo.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="departamento">Departamento</Label>
          <input
            {...register('departamento')}
            id="departamento"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.departamento && (
            <p className="text-sm text-destructive">
              {errors.departamento.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="assinatura">Assinatura de Email</Label>
          <textarea
            {...register('assinatura')}
            id="assinatura"
            rows={4}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.assinatura && (
            <p className="text-sm text-destructive">
              {errors.assinatura.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Salvar Alterações
      </button>
    </form>
  );
} 