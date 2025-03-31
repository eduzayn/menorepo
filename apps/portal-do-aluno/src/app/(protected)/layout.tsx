'use client'

import { useAuth } from '@edunexia/auth'
import { Button } from '@edunexia/ui-components/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'home' },
  { href: '/perfil', label: 'Perfil', icon: 'user' },
  { href: '/estudos', label: 'Área de Estudos', icon: 'book' },
  { href: '/financeiro', label: 'Financeiro', icon: 'dollar-sign' },
  { href: '/documentos', label: 'Documentos', icon: 'file-text' },
  { href: '/certificados', label: 'Certificados', icon: 'award' },
  { href: '/calendario', label: 'Calendário', icon: 'calendar' },
  { href: '/recursos', label: 'Recursos e Biblioteca', icon: 'book-open' },
  { href: '/gamificacao', label: 'Gamificação', icon: 'award' },
  { href: '/avaliacoes', label: 'Feedbacks e Avaliações', icon: 'star' },
  { href: '/suporte', label: 'Suporte', icon: 'help-circle' },
]

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Botão de menu mobile - visível apenas em telas pequenas */}
      <div className="lg:hidden p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Portal do Aluno</h1>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Menu Lateral */}
        <aside 
          id="mobile-menu"
          className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:min-h-screen bg-white shadow-lg`}
          aria-label="Menu de navegação principal"
        >
          <div className="p-4 lg:block hidden">
            <h1 className="text-xl font-bold text-gray-900">Portal do Aluno</h1>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900 font-medium border-l-4 border-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.icon && (
                  <span className="mr-3 w-5 h-5 flex items-center justify-center" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                )}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          <header className="bg-white shadow">
            <div className="px-4 py-4 flex justify-end items-center">
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Sair
              </Button>
            </div>
          </header>
          <main className="p-6" role="main" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 