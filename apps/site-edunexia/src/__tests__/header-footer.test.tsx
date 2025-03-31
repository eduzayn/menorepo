import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@edunexia/test-config';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DynamicMenu } from '../components/DynamicMenu';

// Mock do hook para o menu dinâmico
vi.mock('../hooks/useMenu', () => ({
  useActiveMenuItems: () => ({
    tree: [
      { id: '1', title: 'Início', link: '/', order_index: 0, is_active: true, open_in_new_tab: false },
      { id: '2', title: 'Sobre', link: '/sobre', order_index: 1, is_active: true, open_in_new_tab: false },
      { id: '3', title: 'Blog', link: '/blog', order_index: 2, is_active: true, open_in_new_tab: false },
      { 
        id: '4', 
        title: 'Soluções', 
        link: '#', 
        order_index: 3, 
        is_active: true, 
        open_in_new_tab: false,
        children: [
          { id: '5', title: 'Sistema de Matrículas', link: '/pagina/sistema-matriculas', order_index: 0, is_active: true, open_in_new_tab: false, parent_id: '4' },
          { id: '6', title: 'Portal do Aluno', link: '/pagina/portal-aluno', order_index: 1, is_active: true, open_in_new_tab: false, parent_id: '4' },
          { id: '7', title: 'Gestão Financeira', link: '/pagina/gestao-financeira', order_index: 2, is_active: true, open_in_new_tab: false, parent_id: '4' },
        ]
      },
      { id: '8', title: 'Contato', link: '/contato', order_index: 4, is_active: true, open_in_new_tab: false },
    ],
    isLoading: false,
    error: null
  })
}));

describe('Navegação - Header & Footer', () => {
  describe('Menu Principal', () => {
    it('deve renderizar corretamente o menu principal com todos os links', () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      // Verificar logo e links principais
      expect(screen.getByText('Edunéxia')).toBeInTheDocument();
      
      // No desktop, o menu é renderizado normalmente
      const inicio = screen.getByText('Início');
      const sobre = screen.getByText('Sobre');
      const blog = screen.getByText('Blog');
      const solucoes = screen.getByText('Soluções');
      const contato = screen.getByText('Contato');
      
      expect(inicio).toBeInTheDocument();
      expect(sobre).toBeInTheDocument();
      expect(blog).toBeInTheDocument();
      expect(solucoes).toBeInTheDocument();
      expect(contato).toBeInTheDocument();
      
      // Verificar se os links têm as URLs corretas
      expect(inicio.closest('a')).toHaveAttribute('href', '/');
      expect(sobre.closest('a')).toHaveAttribute('href', '/sobre');
      expect(blog.closest('a')).toHaveAttribute('href', '/blog');
      expect(contato.closest('a')).toHaveAttribute('href', '/contato');
    });
    
    it('deve renderizar o menu dinâmico com todos os itens', () => {
      render(
        <MemoryRouter>
          <DynamicMenu />
        </MemoryRouter>
      );
      
      // Verificar todos os itens do menu principal
      expect(screen.getByText('Início')).toBeInTheDocument();
      expect(screen.getByText('Sobre')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Soluções')).toBeInTheDocument();
      expect(screen.getByText('Contato')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('deve renderizar corretamente o rodapé com todas as seções e links', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      // Verificar seções do rodapé
      expect(screen.getByText('Edunéxia', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByText('Soluções', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByText('Suporte', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByText('Empresa', { selector: 'h3' })).toBeInTheDocument();
      
      // Verificar links da seção Soluções
      expect(screen.getByText('Sistema de Matrículas', { selector: 'a' })).toHaveAttribute('href', '/matriculas');
      expect(screen.getByText('Portal do Aluno', { selector: 'a' })).toHaveAttribute('href', '/portal-do-aluno');
      expect(screen.getByText('Material Didático', { selector: 'a' })).toHaveAttribute('href', '/material-didatico');
      expect(screen.getByText('Comunicação', { selector: 'a' })).toHaveAttribute('href', '/comunicacao');
      expect(screen.getByText('Financeiro', { selector: 'a' })).toHaveAttribute('href', '/financeiro');
      
      // Verificar links da seção Suporte
      expect(screen.getByText('Central de Ajuda', { selector: 'a' })).toHaveAttribute('href', '/ajuda');
      expect(screen.getByText('Documentação', { selector: 'a' })).toHaveAttribute('href', '/documentacao');
      expect(screen.getByText('Status do Sistema', { selector: 'a' })).toHaveAttribute('href', '/status');
      
      // Verificar links da seção Empresa
      expect(screen.getByText('Sobre Nós', { selector: 'a' })).toHaveAttribute('href', '/sobre');
      expect(screen.getByText('Blog', { selector: 'a' })).toHaveAttribute('href', '/blog');
      expect(screen.getByText('Carreiras', { selector: 'a' })).toHaveAttribute('href', '/carreiras');
      expect(screen.getByText('Parceiros', { selector: 'a' })).toHaveAttribute('href', '/parceiros');
      
      // Verificar links do rodapé
      expect(screen.getByText('Política de Privacidade')).toHaveAttribute('href', '/privacidade');
      expect(screen.getByText('Termos de Uso')).toHaveAttribute('href', '/termos');
      expect(screen.getByText('Cookies')).toHaveAttribute('href', '/cookies');
      
      // Verificar direitos autorais
      const anoAtual = new Date().getFullYear();
      expect(screen.getByText(`© ${anoAtual} Edunéxia. Todos os direitos reservados.`)).toBeInTheDocument();
    });
  });
});

describe('Header and Footer', () => {
  it('should render DynamicMenu with items', () => {
    const items = [
      { id: '1', title: 'Home', url: '/' },
      { id: '2', title: 'About', url: '/about' }
    ];
    render(<DynamicMenu items={items} />);
  });
}); 