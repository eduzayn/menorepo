import { Button } from '@edunexia/ui-components'
import { Plus, FileTemplate, Users, Clock, FileCheck } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@edunexia/ui-components'

const templates = [
  {
    id: 1,
    nome: 'Aula Teórica',
    descricao: 'Template padrão para aulas teóricas',
    blocos: 5,
    autores: 2,
    status: 'Ativo',
    uso: 12,
  },
  {
    id: 2,
    nome: 'Aula Prática',
    descricao: 'Template para aulas com exercícios',
    blocos: 7,
    autores: 3,
    status: 'Ativo',
    uso: 8,
  },
  {
    id: 3,
    nome: 'Avaliação',
    descricao: 'Template para avaliações e provas',
    blocos: 4,
    autores: 2,
    status: 'Ativo',
    uso: 15,
  },
]

export default function Templates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
          <p className="text-muted-foreground">
            Gerencie seus templates de conteúdo
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <FileTemplate className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total de Templates</span>
          </div>
          <div className="mt-2 text-2xl font-bold">3</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Autores Ativos</span>
          </div>
          <div className="mt-2 text-2xl font-bold">7</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Em Uso</span>
          </div>
          <div className="mt-2 text-2xl font-bold">35</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Blocos Totais</span>
          </div>
          <div className="mt-2 text-2xl font-bold">16</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Blocos</TableHead>
              <TableHead>Autores</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Em Uso</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.nome}</TableCell>
                <TableCell>{template.descricao}</TableCell>
                <TableCell>{template.blocos}</TableCell>
                <TableCell>{template.autores}</TableCell>
                <TableCell>{template.status}</TableCell>
                <TableCell>{template.uso}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 