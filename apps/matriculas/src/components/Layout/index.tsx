import { Outlet, useLocation, Link } from 'react-router-dom'
import { DashboardLayout } from '@edunexia/ui-components'
import { useUser } from '../../hooks/useUser'

// Itens de navegação específicos do módulo de matrículas
const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Planos', href: '/planos' },
  { name: 'Inscrições', href: '/inscricoes' },
  { name: 'Documentos', href: '/documentos' },
  { name: 'Contratos', href: '/contratos' },
  { name: 'Configurações', href: '/configuracoes' },
]

export const Layout = () => {
  const location = useLocation()
  const { user, logout } = useUser()

  // Menu lateral personalizado para o módulo de matrículas
  const MatriculasSidebar = (
    <aside className="bg-white w-64 min-h-screen shadow-sm">
      <div className="p-4 border-b">
        <img className="h-8 w-auto" src="/logo.png" alt="EduNexia" />
      </div>
      <nav className="mt-5 px-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <DashboardLayout
      title="Módulo de Matrículas"
      sidebar={MatriculasSidebar}
      user={user}
      onLogout={logout}
    >
      <Outlet />
    </DashboardLayout>
  )
}

export default Layout 