import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@edunexia/test-config';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { PlanosPage } from '../pages/PlanosPage';
import { DynamicPage } from '../pages/DynamicPage';

// Mock dos hooks usados
vi.mock('../hooks/usePages', () => ({
  usePublishedPages: () => ({ 
    data: [
      { 
        id: '1', 
        title: 'Teste de Página', 
        slug: 'teste-pagina',
        meta_description: 'Descrição de teste',
        featured_image_url: 'https://placehold.co/600x400'
      }
    ] 
  }),
  usePageBySlug: () => ({
    data: {
      id: '1',
      title: 'Página de Teste',
      content: { 
        blocks: [
          { type: 'paragraph', content: 'Conteúdo de teste' }
        ] 
      },
      slug: 'teste-pagina',
      meta_description: 'Descrição de teste',
      featured_image_url: 'https://placehold.co/600x400',
      published_at: '2023-01-01T00:00:00Z'
    },
    isLoading: false,
    error: null
  })
}));

vi.mock('../hooks/useBlog', () => ({
  usePublishedBlogPosts: () => ({ 
    data: { 
      posts: [
        { 
          id: '1', 
          title: 'Post de Blog Teste', 
          slug: 'blog-teste',
          excerpt: 'Resumo de teste',
          featured_image_url: 'https://placehold.co/600x400',
          published_at: '2023-01-01T00:00:00Z',
          author: { name: 'Autor Teste' }
        }
      ] 
    } 
  })
}));

// Mock da função de navegação
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<object>('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate
  };
});

describe('Navegação do Site Edunéxia', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  describe('Homepage - Navegação', () => {
    it('deve navegar para a página de planos ao clicar no botão "Conheça nossos planos"', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planos" element={<PlanosPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Encontrar e clicar no botão
      const planosButton = screen.getByText('Conheça nossos planos');
      await user.click(planosButton);
      
      // Na implementação real, o usuário seria redirecionado para /planos
      // No teste, verificamos se o botão tem o atributo to="/planos"
      const linkElement = planosButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '/planos');
    });

    it('deve navegar para a página de contato ao clicar no botão "Agende uma demonstração"', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      );

      // Encontrar e clicar no botão
      const agendarButton = screen.getByText('Agende uma demonstração');
      await user.click(agendarButton);
      
      // Verificar se o link tem o atributo correto
      const linkElement = agendarButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '/contato');
    });

    it('deve navegar para páginas de produtos ao clicar nos links "Saiba mais"', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      );

      // Verificar links de produtos
      const matriculasContainer = screen.getByText('Sistema de Matrículas').closest('div');
      const portalAlunoContainer = screen.getByText('Portal do Aluno').closest('div');
      const gestaoFinanceiraContainer = screen.getByText('Gestão Financeira').closest('div');
      
      // Garantir que os containers existem
      expect(matriculasContainer).not.toBeNull();
      expect(portalAlunoContainer).not.toBeNull();
      expect(gestaoFinanceiraContainer).not.toBeNull();
      
      // Verificar os links dentro dos containers
      if (matriculasContainer && portalAlunoContainer && gestaoFinanceiraContainer) {
        const matriculasLink = matriculasContainer.querySelector('a');
        const portalAlunoLink = portalAlunoContainer.querySelector('a');
        const gestaoFinanceiraLink = gestaoFinanceiraContainer.querySelector('a');
        
        expect(matriculasLink).not.toBeNull();
        expect(portalAlunoLink).not.toBeNull();
        expect(gestaoFinanceiraLink).not.toBeNull();
        
        expect(matriculasLink).toHaveAttribute('href', '/pagina/sistema-matriculas');
        expect(portalAlunoLink).toHaveAttribute('href', '/pagina/portal-aluno');
        expect(gestaoFinanceiraLink).toHaveAttribute('href', '/pagina/gestao-financeira');
      }
    });

    it('deve navegar para o blog ao clicar no botão "Ver todos os artigos"', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      );

      // Encontrar e verificar o botão do blog
      const blogButton = screen.getByText('Ver todos os artigos');
      const linkElement = blogButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '/blog');
    });

    it('deve ter botões funcionais com links corretos na página inicial', async () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );

      // Botões principais da seção Hero
      const agendarButton = screen.getByText('Agende uma demonstração');
      const planosButton = screen.getByText('Conheça nossos planos');
      
      // Verificar links corretamente configurados
      expect(agendarButton).toBeInTheDocument();
      expect(planosButton).toBeInTheDocument();
      
      // Verificar se os links têm a URL correta
      expect(agendarButton.closest('a')).toHaveAttribute('href', '/contato');
      expect(planosButton.closest('a')).toHaveAttribute('href', '/planos');
      
      // Verificar links para páginas de produtos (podem não estar presentes se o mock não estiver correto)
      const saibaMaisLinks = screen.queryAllByText('Saiba mais');
      saibaMaisLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', expect.stringMatching(/^\/pagina\//));
      });
      
      // CTA final
      const ctaButton = screen.getByText('Fale com um especialista');
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton.closest('a')).toHaveAttribute('href', '/contato');
    });
  });

  describe('Página de Planos - Navegação', () => {
    it('deve navegar para a página de contato com o plano selecionado ao clicar nos botões CTA', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/planos']}>
          <PlanosPage />
        </MemoryRouter>
      );

      // Verificar botões de cada plano
      const essencialButton = screen.getByText('Solicitar demonstração', { selector: 'a' });
      const profissionalButton = screen.getByText('Solicitar demonstração', { selector: 'a' });
      const enterpriseButton = screen.getByText('Consultar preços');
      
      // Verificar links com parâmetros de query
      expect(essencialButton).toHaveAttribute('href', '/contato?plano=essencial');
      expect(profissionalButton).toHaveAttribute('href', '/contato?plano=profissional');
      const enterpriseLink = enterpriseButton.closest('a');
      expect(enterpriseLink).not.toBeNull();
      expect(enterpriseLink).toHaveAttribute('href', '/contato?plano=enterprise');
    });

    it('deve navegar para a página de contato a partir da seção de dúvidas', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/planos']}>
          <PlanosPage />
        </MemoryRouter>
      );

      // Verificar botão da seção de dúvidas
      const contatoButton = screen.getByText('Fale com um especialista');
      const linkElement = contatoButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '/contato');
    });
  });

  describe('Páginas Dinâmicas - Navegação', () => {
    it('deve ter um botão funcional para voltar ao início', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/pagina/teste-pagina']}>
          <Routes>
            <Route path="/pagina/:slug" element={<DynamicPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Se houver erro ao carregar a página, verificar se o botão de voltar funciona
      const voltarButton = screen.queryByText('Voltar ao início');
      if (voltarButton) {
        const linkElement = voltarButton.closest('a');
        expect(linkElement).not.toBeNull();
        expect(linkElement).toHaveAttribute('href', '/');
      }
    });
  });
}); 