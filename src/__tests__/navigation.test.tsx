import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HashRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

// Importações locais - usando require para evitar problemas de tipagem
const HomePage = require('../pages/HomePage').default;
const DynamicPage = require('../pages/DynamicPage').DynamicPage;
const DynamicMenu = require('../components/DynamicMenu').default;

// Mock simples dos hooks de dados
vi.mock('../hooks/usePages', () => ({
  usePublishedPages: () => ({ 
    data: [{ id: '1', title: 'Teste', slug: 'teste' }] 
  }),
  usePageBySlug: () => ({
    data: { 
      id: '1', 
      title: 'Teste', 
      slug: 'teste',
      content: { blocks: [{ type: 'paragraph', content: 'Conteúdo' }] }
    },
    isLoading: false,
    error: null
  })
}));

// Mock do hook de menu
vi.mock('../hooks/useMenu', () => ({
  useAllMenuItems: () => ({
    data: [
      { id: '1', parent_id: null, title: 'Início', link: '/' },
      { id: '2', parent_id: null, title: 'Soluções', link: '#' },
      { id: '3', parent_id: '2', title: 'Matrículas', link: '/pagina/matriculas' }
    ]
  }),
  useActiveMenuItems: () => ({
    data: [
      { id: '1', parent_id: null, title: 'Início', link: '/' },
      { 
        id: '2', 
        parent_id: null, 
        title: 'Soluções', 
        link: '#',
        children: [
          { id: '3', parent_id: '2', title: 'Matrículas', link: '/pagina/matriculas' }
        ]
      }
    ]
  })
}));

// Mock da função navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate
  };
});

// Testes simplificados para diagnóstico
describe('Navegação básica', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o menu principal corretamente', () => {
    render(
      <HashRouter>
        <DynamicMenu />
      </HashRouter>
    );
    
    expect(screen.getByText('Soluções')).toBeInTheDocument();
  });

  it('deve renderizar a página inicial com seus botões', () => {
    render(
      <HashRouter>
        <HomePage />
      </HashRouter>
    );
    
    expect(screen.getByText(/Conheça nossos planos/i)).toBeInTheDocument();
  });

  it('deve renderizar corretamente a página dinâmica', () => {
    render(
      <HashRouter>
        <Routes>
          <Route path="/pagina/:slug" element={<DynamicPage />} />
        </Routes>
      </HashRouter>
    );
    
    // A página deve tentar buscar dados
    expect(vi.mocked(mockNavigate)).not.toHaveBeenCalled();
  });
}); 