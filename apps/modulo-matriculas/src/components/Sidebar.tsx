import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="w-64 bg-white shadow-lg">
      <nav className="mt-5 px-2">
        <Link
          to="/matriculas"
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/matriculas')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Lista de Matrículas
        </Link>
        <Link
          to="/matriculas/nova"
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
            isActive('/matriculas/nova')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Nova Matrícula
        </Link>
      </nav>
    </div>
  )
} 