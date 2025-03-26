import { Button } from '@edunexia/ui-components'
import { Plus, FileText, Users, Clock, FileCheck } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@edunexia/ui-components'

const publicacoes = [
  {
    id: 1,
    titulo: 'Introdução à Álgebra Linear',
    curso: 'Matemática Básica',
    disciplina: 'Álgebra Linear',
    autor: 'João Silva',
    status: 'Em Revisão',
    data: '2024-03-26',
  },
  {
    id: 2,
    titulo: 'Fundamentos de Cálculo',
    curso: 'Matemática Básica',
    disciplina: 'Cálculo Diferencial',
    autor: 'Maria Santos',
    status: 'Aprovado',
    data: '2024-03-25',
  },
  {
    id: 3,
    titulo: 'Geometria no Plano',
    curso: 'Matemática Básica',
    disciplina: 'Geometria Analítica',
    autor: 'Pedro Oliveira',
    status: 'Publicado',
    data: '2024-03-24',
  },
]

export default function Publicacoes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Publicações</h2>
          <p className="text-muted-foreground">
            Gerencie o fluxo de revisão e publicação
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Publicação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total de Publicações</span>
          </div>
          <div className="mt-2 text-2xl font-bold">3</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Autores Ativos</span>
          </div>
          <div className="mt-2 text-2xl font-bold">3</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Em Revisão</span>
          </div>
          <div className="mt-2 text-2xl font-bold">1</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Publicadas</span>
          </div>
          <div className="mt-2 text-2xl font-bold">2</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publicacoes.map((publicacao) => (
              <TableRow key={publicacao.id}>
                <TableCell className="font-medium">{publicacao.titulo}</TableCell>
                <TableCell>{publicacao.curso}</TableCell>
                <TableCell>{publicacao.disciplina}</TableCell>
                <TableCell>{publicacao.autor}</TableCell>
                <TableCell>{publicacao.status}</TableCell>
                <TableCell>{publicacao.data}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Revisar
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