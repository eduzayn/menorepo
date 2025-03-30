import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';

// Importando o DynamicMenu novamente para garantir que está atualizado
import DynamicMenu from './DynamicMenu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Fechar menu móvel ao navegar para outra página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Manipular navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-primary-600 text-white py-4 sticky top-0 z-50 shadow-md" onKeyDown={handleKeyDown}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
              <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
              <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
            </svg>
          </span>
          <span>Edunéxia</span>
        </Link>

        {/* Versão desktop do menu */}
        <div className="hidden md:flex items-center space-x-3">
          <nav className="flex items-center space-x-6 mr-6" aria-label="Menu Principal">
            <Link to="/" className="text-sm font-medium text-white hover:text-primary-100">Início</Link>
            <Link to="/sobre" className="text-sm font-medium text-white hover:text-primary-100">Sobre</Link>
            <Link to="/blog" className="text-sm font-medium text-white hover:text-primary-100">Blog</Link>
            <Link to="/contato" className="text-sm font-medium text-white hover:text-primary-100">Contato</Link>
            
            {/* Dropdown Soluções */}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-white hover:text-primary-100 focus:outline-none">
                <span>Soluções</span>
                <svg className="ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                <div className="py-1">
                  <Link to="/matriculas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sistema de Matrículas</Link>
                  <Link to="/portal-do-aluno" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Portal do Aluno</Link>
                  <Link to="/material-didatico" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Material Didático</Link>
                  <Link to="/comunicacao" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Comunicação</Link>
                  <Link to="/financeiro" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Gestão Financeira</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link to="/planos" className="block px-4 py-2 text-sm text-primary-600 font-medium hover:bg-gray-100">Conheça nossos planos</Link>
                </div>
              </div>
            </div>
          </nav>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-white">
                Olá, {user?.nome || 'Usuário'}
              </span>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-white text-primary-600 font-medium rounded-md hover:bg-primary-50 transition font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                Minha Conta
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="px-4 py-2 bg-white text-primary-600 font-medium rounded-md hover:bg-primary-50 transition font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                Entrar
              </Link>
              <Link 
                to="/criar-conta" 
                className="px-4 py-2 border border-white text-white font-medium rounded-md hover:bg-primary-500 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>

        {/* Botão de menu móvel */}
        <div className="flex items-center md:hidden">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="px-3 py-1 bg-white text-primary-600 font-medium rounded-md hover:bg-primary-50 transition mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400"
            >
              Minha Conta
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-3 py-1 bg-white text-primary-600 font-medium rounded-md hover:bg-primary-50 transition mr-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400"
            >
              Entrar
            </Link>
          )}
          
          <button
            className="text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400 p-1 rounded-md"
            onClick={handleMobileMenuToggle}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Menu móvel */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-md rounded-b-lg mt-1 border-t border-gray-200"
          >
            <div className="p-4">
              <nav className="space-y-1">
                <Link 
                  to="/" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleMobileMenuClose}
                >
                  Início
                </Link>
                <Link 
                  to="/sobre" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleMobileMenuClose}
                >
                  Sobre
                </Link>
                <Link 
                  to="/blog" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleMobileMenuClose}
                >
                  Blog
                </Link>
                <Link 
                  to="/contato" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleMobileMenuClose}
                >
                  Contato
                </Link>
                
                <div className="py-2 px-3">
                  <div className="font-medium text-gray-800 mb-2">Soluções</div>
                  <div className="pl-3 space-y-1 border-l-2 border-gray-100">
                    <Link 
                      to="/matriculas" 
                      className="block py-1 text-sm text-gray-600 hover:text-primary-600"
                      onClick={handleMobileMenuClose}
                    >
                      Sistema de Matrículas
                    </Link>
                    <Link 
                      to="/portal-do-aluno" 
                      className="block py-1 text-sm text-gray-600 hover:text-primary-600"
                      onClick={handleMobileMenuClose}
                    >
                      Portal do Aluno
                    </Link>
                    <Link 
                      to="/material-didatico" 
                      className="block py-1 text-sm text-gray-600 hover:text-primary-600"
                      onClick={handleMobileMenuClose}
                    >
                      Material Didático
                    </Link>
                    <Link 
                      to="/comunicacao" 
                      className="block py-1 text-sm text-gray-600 hover:text-primary-600"
                      onClick={handleMobileMenuClose}
                    >
                      Comunicação
                    </Link>
                    <Link 
                      to="/financeiro" 
                      className="block py-1 text-sm text-gray-600 hover:text-primary-600"
                      onClick={handleMobileMenuClose}
                    >
                      Gestão Financeira
                    </Link>
                  </div>
                </div>
                
                <Link 
                  to="/planos" 
                  className="block py-2 px-3 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50"
                  onClick={handleMobileMenuClose}
                >
                  Conheça nossos planos
                </Link>
              </nav>
              
              {!isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link 
                    to="/criar-conta" 
                    className="block w-full text-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                    onClick={handleMobileMenuClose}
                  >
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 