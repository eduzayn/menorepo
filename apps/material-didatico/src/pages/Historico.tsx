import { Button } from '@edunexia/ui-components'
import { History, Users, Clock, FileCheck } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@edunexia/ui-components'

const historico = [
  {
    id: 1,
    titulo: 'Introdução à Álgebra Linear',
    curso: 'Matemática Básica',
    disciplina: 'Álgebra Linear',
    autor: 'João Silva',
    versao: '2.1',
    data: '2024-03-26',
    tipo: 'Atualização',
  },
  {
    id: 2,
    titulo: 'Fundamentos de Cálculo',
    curso: 'Matemática Básica',
    disciplina: 'Cálculo Diferencial',
    autor: 'Maria Santos',
    versao: '1.0',
    data: '2024-03-25',
    tipo: 'Criação',
  },
  {
    id: 3,
    titulo: 'Geometria no Plano',
    curso: 'Matemática Básica',
    disciplina: 'Geometria Analítica',
    autor: 'Pedro Oliveira',
    versao: '1.2',
    data: '2024-03-24',
    tipo: 'Atualização',
  },
]

export default function Historico() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico</h2>
          <p className="text-muted-foreground">
            Acompanhe o histórico de alterações
          </p>
        </div>
        <Button>
          <History className="mr-2 h-4 w-4" />
          Ver Todas
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total de Versões</span>
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
            <span className="text-sm font-medium">Última Atualização</span>
          </div>
          <div className="mt-2 text-2xl font-bold">Hoje</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Versões Ativas</span>
          </div>
          <div className="mt-2 text-2xl font-bold">3</div>
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
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historico.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.titulo}</TableCell>
                <TableCell>{item.curso}</TableCell>
                <TableCell>{item.disciplina}</TableCell>
                <TableCell>{item.autor}</TableCell>
                <TableCell>{item.versao}</TableCell>
                <TableCell>{item.data}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Restaurar
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