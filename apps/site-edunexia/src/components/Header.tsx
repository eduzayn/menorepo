import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary-600 text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
              <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
            </svg>
          </span>
          Edunéxia
        </Link>

        {/* Versão desktop do menu */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="hover:text-primary-200 transition-colors font-medium">Início</Link>
            </li>
            <li>
              <Link to="/sobre" className="hover:text-primary-200 transition-colors font-medium">Sobre</Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary-200 transition-colors font-medium">Blog</Link>
            </li>
            <li>
              <Link to="/contato" className="hover:text-primary-200 transition-colors font-medium">Contato</Link>
            </li>
            <li className="relative group">
              <span className="hover:text-primary-200 transition-colors font-medium cursor-pointer flex items-center">
                Soluções
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <li>
                  <Link to="/pagina/sistema-matriculas" className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600">
                    Sistema de Matrículas
                  </Link>
                </li>
                <li>
                  <Link to="/pagina/portal-aluno" className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600">
                    Portal do Aluno
                  </Link>
                </li>
                <li>
                  <Link to="/pagina/gestao-financeira" className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600">
                    Gestão Financeira
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Botão de menu móvel */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu móvel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-700 px-4 pt-2 pb-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="block py-2 text-primary-100 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
            </li>
            <li>
              <Link 
                to="/sobre" 
                className="block py-2 text-primary-100 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className="block py-2 text-primary-100 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/contato" 
                className="block py-2 text-primary-100 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </Link>
            </li>
            <li className="py-2">
              <div className="text-primary-100 mb-1 font-medium">Soluções</div>
              <ul className="pl-4 space-y-2 border-l border-primary-500">
                <li>
                  <Link 
                    to="/pagina/sistema-matriculas" 
                    className="block py-1 text-primary-200 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sistema de Matrículas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pagina/portal-aluno" 
                    className="block py-1 text-primary-200 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Portal do Aluno
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pagina/gestao-financeira" 
                    className="block py-1 text-primary-200 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gestão Financeira
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header; 