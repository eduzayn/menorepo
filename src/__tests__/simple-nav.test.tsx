import React from 'react';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DynamicMenu from '../components/DynamicMenu';

// Mocks
vi.mock('../hooks/useMenu', () => ({
  useAllMenuItems: () => ({
    data: [
      { id: '1', parent_id: null, title: 'Início', link: '/' },
      { id: '2', parent_id: null, title: 'Soluções', link: '#' }
    ],
    isLoading: false,
    error: null
  }),
  useActiveMenuItems: () => ({
    data: [
      { id: '1', parent_id: null, title: 'Início', link: '/' },
      { id: '2', parent_id: null, title: 'Soluções', link: '#' }
    ],
    isLoading: false,
    error: null
  }),
  useMenuTree: () => ({
    tree: [
      { id: '1', parent_id: null, title: 'Início', link: '/', children: [] },
      { id: '2', parent_id: null, title: 'Soluções', link: '#', children: [] }
    ],
    isLoading: false,
    error: null
  })
}));

// Testes básicos
describe('Navegação Básica', () => {
  it('deve renderizar o menu principal', () => {
    render(
      <HashRouter>
        <DynamicMenu />
      </HashRouter>
    );
    
    // Verificar se os itens do menu estão presentes
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Soluções')).toBeInTheDocument();
  });
}); 