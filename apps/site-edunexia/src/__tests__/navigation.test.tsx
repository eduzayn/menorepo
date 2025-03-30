import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@edunexia/test-config';
import { HashRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PlanosPage from '../pages/PlanosPage';
import { DynamicPage } from '../pages/DynamicPage';
import App from '../App';
import DynamicMenu from '../components/DynamicMenu';

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
  usePageBySlug: (slug: string) => ({
    data: {
      id: '1',
      title: 'Página de Teste',
      content: { 
        blocks: [
          { type: 'paragraph', content: 'Conteúdo de teste' }
        ] 
      },
      slug: slug || 'teste-pagina',
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

// Mock do hook useAllMenuItems para o menu
vi.mock('../hooks/useMenu', () => ({
  useAllMenuItems: () => ({
    data: [
      {
        id: '1',
        parent_id: null,
        title: 'Início',
        link: '/',
        order_index: 0,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        parent_id: null,
        title: 'Soluções',
        link: '#',
        order_index: 3,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        parent_id: '4',
        title: 'Sistema de Matrículas',
        link: '/pagina/sistema-matriculas',
        order_index: 0,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        parent_id: '4',
        title: 'Portal do Aluno',
        link: '/pagina/portal-aluno',
        order_index: 1,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        parent_id: '4',
        title: 'Gestão Financeira',
        link: '/pagina/gestao-financeira',
        order_index: 2,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    isLoading: false,
    error: null
  }),
  useActiveMenuItems: () => ({
    data: [
      {
        id: '1',
        parent_id: null,
        title: 'Início',
        link: '/',
        order_index: 0,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        parent_id: null,
        title: 'Soluções',
        link: '#',
        order_index: 3,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        children: [
          {
            id: '5',
            parent_id: '4',
            title: 'Sistema de Matrículas',
            link: '/pagina/sistema-matriculas',
            order_index: 0,
            is_active: true,
            open_in_new_tab: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '6',
            parent_id: '4',
            title: 'Portal do Aluno',
            link: '/pagina/portal-aluno',
            order_index: 1,
            is_active: true,
            open_in_new_tab: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '7',
            parent_id: '4',
            title: 'Gestão Financeira',
            link: '/pagina/gestao-financeira',
            order_index: 2,
            is_active: true,
            open_in_new_tab: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
    ],
    isLoading: false,
    error: null
  }),
  useMenuTree: () => ({
    tree: [
      {
        id: '1',
        parent_id: null,
        title: 'Início',
        link: '/',
        order_index: 0,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        children: []
      },
      {
        id: '4',
        parent_id: null,
        title: 'Soluções',
        link: '#',
        order_index: 3,
        is_active: true,
        open_in_new_tab: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        children: [
          {
            id: '5',
            parent_id: '4',
            title: 'Sistema de Matrículas',
            link: '/pagina/sistema-matriculas',
            order_index: 0,
            is_active: true,
            open_in_new_tab: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            children: []
          },
          {
            id: '6',
            parent_id: '4',
            title: 'Portal do Aluno',
            link: '/pagina/portal-aluno',
            order_index: 1,
            is_active: true,
            open_in_new_tab: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            children: []
          },
          {
            id: '7',
            parent_id: '4',
            title: 'Gestão Financeira',
            link: '/pagina/gestao-financeira',
            order_index: 2,
            is_active: true,
            open_in_new_tab: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            children: []
          }
        ]
      }
    ],
    isLoading: false,
    error: null
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

// Mock para useMenu com fallback
const mockFallbackUseMenu = () => ({
  useAllMenuItems: () => ({
    data: null,
    isLoading: false,
    error: true
  }),
  useActiveMenuItems: () => ({
    data: null,
    isLoading: false,
    error: true
  }),
  useMenuTree: () => ({
    tree: [],
    isLoading: false,
    error: true
  })
});

describe('Navegação do Site Edunéxia', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    vi.clearAllMocks();
  });

  describe('Homepage - Navegação', () => {
    it('deve navegar para a página de planos ao clicar no botão "Conheça nossos planos"', async () => {
      const user = userEvent.setup();
      
      render(
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planos" element={<PlanosPage />} />
          </Routes>
        </HashRouter>
      );

      // Encontrar e clicar no botão
      const planosButton = screen.getByText('Conheça nossos planos');
      await user.click(planosButton);
      
      // Verificar se o botão tem o atributo to="/planos"
      const linkElement = planosButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '#/planos');
    });

    it('deve navegar para a página de contato ao clicar no botão "Agende uma demonstração"', async () => {
      const user = userEvent.setup();
      
      render(
        <HashRouter>
          <HomePage />
        </HashRouter>
      );

      // Encontrar e clicar no botão
      const agendarButton = screen.getByText('Agende uma demonstração');
      await user.click(agendarButton);
      
      // Verificar se o link tem o atributo correto
      const linkElement = agendarButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '#/contato');
    });

    it('deve navegar para páginas de produtos ao clicar nos links "Saiba mais"', async () => {
      const user = userEvent.setup();
      
      render(
        <HashRouter>
          <HomePage />
        </HashRouter>
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
        
        expect(matriculasLink).toHaveAttribute('href', '#/pagina/sistema-matriculas');
        expect(portalAlunoLink).toHaveAttribute('href', '#/pagina/portal-aluno');
        expect(gestaoFinanceiraLink).toHaveAttribute('href', '#/pagina/gestao-financeira');
      }
    });

    it('deve navegar para o blog ao clicar no botão "Ver todos os artigos"', async () => {
      const user = userEvent.setup();
      
      render(
        <HashRouter>
          <HomePage />
        </HashRouter>
      );

      // Encontrar e verificar o botão do blog
      const blogButton = screen.getByText('Ver todos os artigos');
      const linkElement = blogButton.closest('a');
      expect(linkElement).not.toBeNull();
      expect(linkElement).toHaveAttribute('href', '#/blog');
    });

    it('deve ter botões funcionais com links corretos na página inicial', async () => {
      render(
        <HashRouter>
          <HomePage />
        </HashRouter>
      );

      // Botões principais da seção Hero
      const agendarButton = screen.getByText('Agende uma demonstração');
      const planosButton = screen.getByText('Conheça nossos planos');
      
      // Verificar links corretamente configurados
      expect(agendarButton).toBeInTheDocument();
      expect(planosButton).toBeInTheDocument();
      
      // Verificar se os links têm a URL correta
      expect(agendarButton.closest('a')).toHaveAttribute('href', '#/contato');
      expect(planosButton.closest('a')).toHaveAttribute('href', '#/planos');
      
      // Verificar links para páginas de produtos (podem não estar presentes se o mock não estiver correto)
      const saibaMaisLinks = screen.queryAllByText('Saiba mais');
      saibaMaisLinks.forEach(link => {
        expect(link.closest('a')).toHaveAttribute('href', expect.stringMatching(/^\#\/pagina\//));
      });
      
      // CTA final
      const ctaButton = screen.getByText('Fale com um especialista');
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton.closest('a')).toHaveAttribute('href', '#/contato');
    });
  });

  describe('Menu Principal - Navegação', () => {
    it('deve exibir o menu de Soluções completo com todos os módulos ao clicar', async () => {
      const user = userEvent.setup();
      
      render(
        <HashRouter>
          <DynamicMenu />
        </HashRouter>
      );

      // Encontrar o menu Soluções
      const solucoesMenu = screen.getByText('Soluções');
      expect(solucoesMenu).toBeInTheDocument();
      
      // Simular hover (não há método específico para isso, mas podemos simular um click)
      await user.click(solucoesMenu);
      
      // Verificar se os itens do submenu são exibidos
      expect(screen.getByText('Sistema de Matrículas')).toBeInTheDocument();
      expect(screen.getByText('Portal do Aluno')).toBeInTheDocument();
      expect(screen.getByText('Gestão Financeira')).toBeInTheDocument();
      
      // Verificar se todos os links do submenu estão corretos
      const matriculasLink = screen.getByText('Sistema de Matrículas').closest('a');
      const portalAlunoLink = screen.getByText('Portal do Aluno').closest('a');
      const gestaoFinanceiraLink = screen.getByText('Gestão Financeira').closest('a');
      
      expect(matriculasLink).toHaveAttribute('href', '#/pagina/sistema-matriculas');
      expect(portalAlunoLink).toHaveAttribute('href', '#/pagina/portal-aluno');
      expect(gestaoFinanceiraLink).toHaveAttribute('href', '#/pagina/gestao-financeira');
    });
    
    it('deve mostrar todos os módulos no menu Soluções mesmo quando os dados estão incompletos', async () => {
      // Teste para garantir que nosso fallback funciona
      vi.mock('../hooks/useMenu', mockFallbackUseMenu);
      
      render(
        <HashRouter>
          <DynamicMenu />
        </HashRouter>
      );
      
      // Encontrar o menu Soluções
      const solucoesMenu = screen.getByText('Soluções');
      expect(solucoesMenu).toBeInTheDocument();
      
      // Verificar se todos os módulos estão sendo exibidos mesmo com erro
      const SOLUCOES_MODULES = [
        'Sistema de Matrículas',
        'Portal do Aluno',
        'Gestão Financeira',
        'Material Didático',
        'Comunicação',
        'Portal do Polo',
        'Portal do Parceiro'
      ];
      
      SOLUCOES_MODULES.forEach(modulo => {
        expect(screen.getByText(modulo)).toBeInTheDocument();
      });
    });
  });

  describe('Navegação com HashRouter', () => {
    it('deve funcionar com HashRouter para a navegação interna', async () => {
      const user = userEvent.setup();
      
      render(
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/contato" element={<div>Página de Contato</div>} />
            <Route path="/pagina/:slug" element={<DynamicPage />} />
          </Routes>
        </HashRouter>
      );
      
      // Verificar navegação da página inicial
      const planosButton = screen.getByText('Conheça nossos planos');
      expect(planosButton.closest('a')).toHaveAttribute('href', '#/planos');
      
      // Testar click e mudança de rota
      await user.click(planosButton);
      
      // Como estamos em teste, o HashRouter não muda a URL real,
      // mas podemos verificar se o link está corretamente configurado
      expect(planosButton.closest('a')).toHaveAttribute('href', '#/planos');
    });
  });
}); 