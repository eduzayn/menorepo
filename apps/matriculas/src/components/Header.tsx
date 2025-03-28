import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                EduNexia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 