import { Button } from '@edunexia/ui-components'
import { Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@edunexia/ui-components'

const cursos = [
  {
    id: 1,
    nome: 'Matemática Básica',
    descricao: 'Fundamentos da matemática para ensino médio',
    disciplinas: 4,
    autores: 2,
    status: 'Em produção',
  },
  {
    id: 2,
    nome: 'Física Quântica',
    descricao: 'Introdução à física quântica para ensino superior',
    disciplinas: 6,
    autores: 3,
    status: 'Em revisão',
  },
  {
    id: 3,
    nome: 'Biologia Celular',
    descricao: 'Estrutura e função das células',
    disciplinas: 5,
    autores: 2,
    status: 'Publicado',
  },
]

export default function Cursos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">
            Gerencie seus cursos e conteúdo
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Disciplinas</TableHead>
              <TableHead>Autores</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id}>
                <TableCell className="font-medium">{curso.nome}</TableCell>
                <TableCell>{curso.descricao}</TableCell>
                <TableCell>{curso.disciplinas}</TableCell>
                <TableCell>{curso.autores}</TableCell>
                <TableCell>{curso.status}</TableCell>
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