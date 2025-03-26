import { Button } from '@edunexia/ui-components'
import { Plus, BookOpen, Users, Clock, FileCheck } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@edunexia/ui-components'
import { useParams } from 'react-router-dom'

const disciplinas = [
  {
    id: 1,
    nome: 'Álgebra Linear',
    descricao: 'Fundamentos de álgebra linear e matrizes',
    aulas: 12,
    autores: 2,
    status: 'Em produção',
    progresso: 75,
  },
  {
    id: 2,
    nome: 'Cálculo Diferencial',
    descricao: 'Limites, derivadas e integrais',
    aulas: 15,
    autores: 3,
    status: 'Em revisão',
    progresso: 90,
  },
  {
    id: 3,
    nome: 'Geometria Analítica',
    descricao: 'Geometria no plano e no espaço',
    aulas: 10,
    autores: 2,
    status: 'Publicado',
    progresso: 100,
  },
]

export default function Disciplinas() {
  const { cursoId } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Disciplinas</h2>
          <p className="text-muted-foreground">
            Gerencie as disciplinas do curso
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Disciplina
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total de Aulas</span>
          </div>
          <div className="mt-2 text-2xl font-bold">37</div>
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
            <span className="text-sm font-medium">Em Produção</span>
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
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Aulas</TableHead>
              <TableHead>Autores</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplinas.map((disciplina) => (
              <TableRow key={disciplina.id}>
                <TableCell className="font-medium">{disciplina.nome}</TableCell>
                <TableCell>{disciplina.descricao}</TableCell>
                <TableCell>{disciplina.aulas}</TableCell>
                <TableCell>{disciplina.autores}</TableCell>
                <TableCell>{disciplina.status}</TableCell>
                <TableCell>
                  <div className="w-full rounded-full bg-gray-200">
                    <div
                      className="rounded-full bg-primary px-2 py-1 text-xs text-white"
                      style={{ width: `${disciplina.progresso}%` }}
                    >
                      {disciplina.progresso}%
                    </div>
                  </div>
                </TableCell>
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