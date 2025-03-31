import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // Fechar menu soluções ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !solutionsRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fechar menus ao apertar ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSolutionsOpen(false);
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <header style={{
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'white',
          textDecoration: 'none', 
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            style={{ width: '2rem', height: '2rem', marginRight: '0.5rem' }}
          >
            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
            <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
          </svg>
          Edunéxia
        </Link>

        {/* Desktop Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }} className="desktop-menu">
          {/* Links de navegação */}
          <nav style={{ 
            display: 'flex', 
            gap: '1rem' 
          }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Início</Link>
            
            {/* Dropdown Soluções */}
            <div style={{ position: 'relative' }} ref={solutionsRef}>
              <button 
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: 'inherit',
                  padding: 0
                }}
              >
                Soluções
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  style={{ 
                    transition: 'transform 0.2s ease',
                    transform: solutionsOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {solutionsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  width: '250px',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Link 
                      to="/matriculas" 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        color: '#4b5563', 
                        textDecoration: 'none',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => setSolutionsOpen(false)}
                    >
                      <span style={{ fontWeight: 'bold', display: 'block' }}>Sistema de Matrículas</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Automação do processo de matrícula online</span>
                    </Link>
                    <Link 
                      to="/portal-do-aluno" 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        color: '#4b5563', 
                        textDecoration: 'none',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => setSolutionsOpen(false)}
                    >
                      <span style={{ fontWeight: 'bold', display: 'block' }}>Portal do Aluno</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Acesso a notas, materiais e comunicação</span>
                    </Link>
                    <Link 
                      to="/material-didatico" 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        color: '#4b5563', 
                        textDecoration: 'none',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => setSolutionsOpen(false)}
                    >
                      <span style={{ fontWeight: 'bold', display: 'block' }}>Material Didático</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Biblioteca digital de conteúdos</span>
                    </Link>
                    <Link 
                      to="/comunicacao" 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        color: '#4b5563', 
                        textDecoration: 'none',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => setSolutionsOpen(false)}
                    >
                      <span style={{ fontWeight: 'bold', display: 'block' }}>Comunicação</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Mensagens e notificações institucionais</span>
                    </Link>
                    <Link 
                      to="/financeiro" 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        color: '#4b5563', 
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                      onClick={() => setSolutionsOpen(false)}
                    >
                      <span style={{ fontWeight: 'bold', display: 'block' }}>Gestão Financeira</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Controle de mensalidades e financeiro</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/sobre" style={{ color: 'white', textDecoration: 'none' }}>Sobre</Link>
            <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
            <Link to="/contato" style={{ color: 'white', textDecoration: 'none' }}>Contato</Link>
            <Link to="/planos" style={{ color: 'white', textDecoration: 'none' }}>Planos</Link>
          </nav>

          {/* Botão de Acesso */}
          {isAuthenticated ? (
            <Link 
              to="/portal-selector" 
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}
            >
              Acesso Unificado
            </Link>
          ) : (
            <Link 
              to="/login" 
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}
            >
              Acesso Unificado
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div style={{ display: 'flex', alignItems: 'center' }} className="mobile-controls">
          {/* Botão de Acesso Mobile */}
          {isAuthenticated ? (
            <Link 
              to="/portal-selector" 
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                marginRight: '0.5rem',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              Acesso
            </Link>
          ) : (
            <Link 
              to="/login" 
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                marginRight: '0.5rem',
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              Acesso
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            padding: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link 
              to="/" 
              style={{ color: '#4b5563', padding: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}
            >
              Início
            </Link>
            
            {/* Dropdown de Soluções na versão mobile */}
            <div style={{ padding: '0.5rem', color: '#4b5563', fontWeight: 'bold' }}>
              Soluções
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link 
                  to="/matriculas" 
                  style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sistema de Matrículas
                </Link>
                <Link 
                  to="/portal-do-aluno" 
                  style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Portal do Aluno
                </Link>
                <Link 
                  to="/material-didatico" 
                  style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Material Didático
                </Link>
                <Link 
                  to="/comunicacao" 
                  style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Comunicação
                </Link>
                <Link 
                  to="/financeiro" 
                  style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Gestão Financeira
                </Link>
              </div>
            </div>
            
            <Link 
              to="/sobre" 
              style={{ color: '#4b5563', padding: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/blog" 
              style={{ color: '#4b5563', padding: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/contato" 
              style={{ color: '#4b5563', padding: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </Link>
            <Link 
              to="/planos" 
              style={{ color: '#2563eb', padding: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}
            >
              Conheça nossos planos
            </Link>
            
            {/* Links institucionais no menu mobile */}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <div style={{ color: '#4b5563', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Suporte e Informações
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link 
                  to="/pagina/central-de-ajuda" 
                  style={{ color: '#6b7280', fontSize: '0.75rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Central de Ajuda
                </Link>
                <Link 
                  to="/pagina/documentacao" 
                  style={{ color: '#6b7280', fontSize: '0.75rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Documentação
                </Link>
                <Link 
                  to="/pagina/status-do-sistema" 
                  style={{ color: '#6b7280', fontSize: '0.75rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Status do Sistema
                </Link>
                <Link 
                  to="/trial" 
                  style={{ color: '#6b7280', fontSize: '0.75rem', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Teste Grátis
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 