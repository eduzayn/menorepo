import { BookOpen, GraduationCap, FileText, Users } from 'lucide-react'
import { StatsCard, RecentActivity, ProgressChart } from '@/components/dashboard'

const stats = [
  {
    title: 'Cursos',
    value: '12',
    icon: BookOpen,
    description: 'Total de cursos criados',
    trend: { value: 8, isPositive: true }
  },
  {
    title: 'Disciplinas',
    value: '48',
    icon: GraduationCap,
    description: 'Total de disciplinas',
    trend: { value: 12, isPositive: true }
  },
  {
    title: 'Templates',
    value: '8',
    icon: FileText,
    description: 'Templates disponíveis',
    trend: { value: 2, isPositive: true }
  },
  {
    title: 'Autores',
    value: '24',
    icon: Users,
    description: 'Autores ativos',
    trend: { value: 4, isPositive: true }
  },
]

const recentActivities = [
  {
    id: '1',
    type: 'create' as const,
    title: 'Novo curso de Programação Web',
    author: {
      name: 'João Silva',
      avatar: 'https://github.com/joao.png'
    },
    timestamp: new Date(),
    details: 'Criado curso com 6 disciplinas'
  },
  {
    id: '2',
    type: 'edit' as const,
    title: 'Atualização na disciplina Matemática',
    author: {
      name: 'Maria Santos',
      avatar: 'https://github.com/maria.png'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    details: 'Adicionados novos exercícios'
  },
  {
    id: '3',
    type: 'publish' as const,
    title: 'Publicação do curso de Física',
    author: {
      name: 'Pedro Oliveira',
      avatar: 'https://github.com/pedro.png'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    details: 'Curso publicado com sucesso'
  }
]

const progressData = [
  {
    label: 'Conteúdo em Produção',
    value: 8,
    total: 12
  },
  {
    label: 'Conteúdo em Revisão',
    value: 3,
    total: 8
  },
  {
    label: 'Conteúdo Publicado',
    value: 15,
    total: 20
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu material didático
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ProgressChart
            title="Progresso de Produção"
            data={progressData}
            description="Status atual da produção de conteúdo"
          />
        </div>
        <div className="col-span-3">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  )
} 