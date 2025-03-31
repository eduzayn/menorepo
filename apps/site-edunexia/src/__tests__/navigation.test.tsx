import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@edunexia/test-config';
import { MemoryRouter } from 'react-router-dom';
import { DynamicMenu } from '../components/DynamicMenu';

// Mock dos hooks necessários
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
      content: { blocks: [] },
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
          excerpt: 'Resumo do post',
          featured_image_url: 'https://placehold.co/600x400',
          published_at: '2023-01-01T00:00:00Z'
        }
      ]
    }
  }),
  useBlogCategories: () => ({
    data: [
      {
        id: '1',
        name: 'Categoria Teste',
        slug: 'categoria-teste'
      }
    ]
  })
}));

describe('Navegação', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Menu Principal', () => {
    it('deve renderizar o menu principal com todos os links', () => {
      const menuItems = [
        { id: '1', title: 'Início', link: '/' },
        { id: '2', title: 'Sobre', link: '/sobre' },
        { id: '3', title: 'Blog', link: '/blog' },
        { id: '4', title: 'Contato', link: '/contato' }
      ];

      render(
        <MemoryRouter>
          <DynamicMenu items={menuItems} />
        </MemoryRouter>
      );

      // Verificar links principais
      expect(screen.getByText('Início')).toBeInTheDocument();
      expect(screen.getByText('Sobre')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contato')).toBeInTheDocument();
    });
  });
}); 