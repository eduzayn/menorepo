import { Link, useLocation } from 'react-router-dom'
import { cn } from '@edunexia/ui-components'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileTemplate,
  Settings,
  History,
  FileCheck,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    title: 'Cursos',
    icon: BookOpen,
    href: '/cursos',
  },
  {
    title: 'Disciplinas',
    icon: GraduationCap,
    href: '/disciplinas',
  },
  {
    title: 'Templates',
    icon: FileTemplate,
    href: '/templates',
  },
  {
    title: 'Publicações',
    icon: FileCheck,
    href: '/publicacoes',
  },
  {
    title: 'Histórico',
    icon: History,
    href: '/historico',
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/configuracoes',
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold">Material Didático</h1>
      </div>
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
} 