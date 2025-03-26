'use client'

import { useAuth } from '@edunexia/auth'
import { Button } from '@edunexia/ui-components/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/perfil', label: 'Perfil' },
  { href: '/estudos', label: 'Área de Estudos' },
  { href: '/financeiro', label: 'Financeiro' },
  { href: '/documentos', label: 'Documentos' },
  { href: '/certificados', label: 'Certificados' },
  { href: '/calendario', label: 'Calendário' },
  { href: '/recursos', label: 'Recursos e Biblioteca' },
  { href: '/gamificacao', label: 'Gamificação' },
  { href: '/avaliacoes', label: 'Feedbacks e Avaliações' },
  { href: '/suporte', label: 'Suporte' },
]

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut } = useAuth()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Menu Lateral */}
        <aside className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900">Portal do Aluno</h1>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          <header className="bg-white shadow">
            <div className="px-4 py-4 flex justify-end">
              <Button variant="outline" onClick={() => signOut()}>
                Sair
              </Button>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 