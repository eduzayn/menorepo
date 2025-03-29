import { ApiClient } from '@edunexia/api-client/src/client';
import { 
  SiteBlogPost, 
  SiteBlogCategory, 
  SiteBlogAuthor 
} from '@edunexia/database-schema/src/site-edunexia';
import { ApiError } from '@edunexia/api-client/src/types';
import { mockBlogPosts, mockBlogCategories, mockBlogAuthors } from './mock-blog-data';

// Flag para habilitar modo de teste com dados mockados
const USE_MOCK_DATA = true;

/**
 * Dados para criar ou atualizar um post
 */
export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: Record<string, any>;
  featured_image_url?: string | null;
  author_id: string;
  category_ids: string[];
  status?: 'published' | 'draft' | 'archived';
  meta_description?: string | null;
  meta_keywords?: string | null;
  published_at?: string | null;
}

/**
 * Dados para criar ou atualizar uma categoria
 */
export interface BlogCategoryInput {
  name: string;
  slug: string;
  description?: string | null;
}

/**
 * Dados para criar ou atualizar um autor
 */
export interface BlogAuthorInput {
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  social_links?: Record<string, string> | null;
}

// ===== POSTS =====

/**
 * Busca um post pelo slug
 * @param client Cliente da API
 * @param slug Slug do post
 * @returns Post encontrado ou erro
 */
export async function getBlogPostBySlug(
  client: ApiClient,
  slug: string
): Promise<{ post: SiteBlogPost | null; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    const mockPost = mockBlogPosts.find(post => post.slug === slug);
    return { 
      post: mockPost || null, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    return { post: data as SiteBlogPost, error: null };
  } catch (error) {
    return {
      post: null,
      error: client.handleError(error, 'blog-service.getBlogPostBySlug')
    };
  }
}

/**
 * Busca os posts publicados (com paginação)
 * @param client Cliente da API
 * @param limit Número máximo de posts por página
 * @param offset Posição inicial para paginação
 * @param categoryId Opcional - Filtrar por categoria
 * @returns Lista de posts ou erro
 */
export async function getPublishedBlogPosts(
  client: ApiClient,
  limit: number = 10,
  offset: number = 0,
  categoryId?: string
): Promise<{ posts: SiteBlogPost[]; total: number; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    const filtered = categoryId 
      ? mockBlogPosts.filter(post => post.status === 'published' && post.category_ids.includes(categoryId))
      : mockBlogPosts.filter(post => post.status === 'published');
    
    const paginatedPosts = filtered
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
      .slice(offset, offset + limit);
    
    return { 
      posts: paginatedPosts, 
      total: filtered.length,
      error: null 
    };
  }

  try {
    let query = client.from('site_blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (categoryId) {
      query = query.contains('category_ids', [categoryId]);
    }
    
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return { 
      posts: data as SiteBlogPost[], 
      total: count || 0,
      error: null 
    };
  } catch (error) {
    return {
      posts: [],
      total: 0,
      error: client.handleError(error, 'blog-service.getPublishedBlogPosts')
    };
  }
}

/**
 * Busca todos os posts (admin)
 * @param client Cliente da API
 * @returns Lista de posts ou erro
 */
export async function getAllBlogPosts(
  client: ApiClient
): Promise<{ posts: SiteBlogPost[]; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    return { 
      posts: mockBlogPosts, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return { posts: data as SiteBlogPost[], error: null };
  } catch (error) {
    return {
      posts: [],
      error: client.handleError(error, 'blog-service.getAllBlogPosts')
    };
  }
}

/**
 * Cria um novo post
 * @param client Cliente da API
 * @param data Dados do post
 * @returns Post criado ou erro
 */
export async function createBlogPost(
  client: ApiClient,
  data: BlogPostInput
): Promise<{ post: SiteBlogPost | null; error: ApiError | null }> {
  // Emular criação com dados mockados
  if (USE_MOCK_DATA) {
    const newPost: SiteBlogPost = {
      id: `mock-${Date.now()}`,
      ...data,
      status: data.status || 'draft',
      published_at: data.status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      excerpt: data.excerpt || null,
      meta_description: data.meta_description || null,
      meta_keywords: data.meta_keywords || null,
      featured_image_url: data.featured_image_url || null
    };
    
    return { 
      post: newPost, 
      error: null 
    };
  }

  try {
    const { data: post, error } = await client.from('site_blog_posts')
      .insert({
        ...data,
        status: data.status || 'draft',
        published_at: data.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { post: post as SiteBlogPost, error: null };
  } catch (error) {
    return {
      post: null,
      error: client.handleError(error, 'blog-service.createBlogPost')
    };
  }
}

/**
 * Atualiza um post existente
 * @param client Cliente da API
 * @param id ID do post
 * @param data Dados a serem atualizados
 * @returns Sucesso ou erro
 */
export async function updateBlogPost(
  client: ApiClient,
  id: string,
  data: Partial<BlogPostInput>
): Promise<{ success: boolean; error: ApiError | null }> {
  // Emular atualização com dados mockados
  if (USE_MOCK_DATA) {
    return { 
      success: true, 
      error: null 
    };
  }

  try {
    // Se estiver publicando um post, adicione a data de publicação
    const updateData = { ...data };
    if (data.status === 'published' && !data.published_at) {
      updateData.published_at = new Date().toISOString();
    }
    
    const { error } = await client.from('site_blog_posts')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'blog-service.updateBlogPost')
    };
  }
}

/**
 * Remove um post
 * @param client Cliente da API
 * @param id ID do post
 * @returns Sucesso ou erro
 */
export async function deleteBlogPost(
  client: ApiClient,
  id: string
): Promise<{ success: boolean; error: ApiError | null }> {
  // Emular exclusão com dados mockados
  if (USE_MOCK_DATA) {
    return { 
      success: true, 
      error: null 
    };
  }

  try {
    const { error } = await client.from('site_blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'blog-service.deleteBlogPost')
    };
  }
}

// ===== CATEGORIAS =====

/**
 * Busca uma categoria pelo slug
 * @param client Cliente da API
 * @param slug Slug da categoria
 * @returns Categoria encontrada ou erro
 */
export async function getBlogCategoryBySlug(
  client: ApiClient,
  slug: string
): Promise<{ category: SiteBlogCategory | null; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    const mockCategory = mockBlogCategories.find(category => category.slug === slug);
    return { 
      category: mockCategory || null, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_blog_categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    return { category: data as SiteBlogCategory, error: null };
  } catch (error) {
    return {
      category: null,
      error: client.handleError(error, 'blog-service.getBlogCategoryBySlug')
    };
  }
}

/**
 * Busca todas as categorias
 * @param client Cliente da API
 * @returns Lista de categorias ou erro
 */
export async function getAllBlogCategories(
  client: ApiClient
): Promise<{ categories: SiteBlogCategory[]; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    return { 
      categories: mockBlogCategories, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_blog_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return { categories: data as SiteBlogCategory[], error: null };
  } catch (error) {
    return {
      categories: [],
      error: client.handleError(error, 'blog-service.getAllBlogCategories')
    };
  }
}

/**
 * Cria uma nova categoria
 * @param client Cliente da API
 * @param data Dados da categoria
 * @returns Categoria criada ou erro
 */
export async function createBlogCategory(
  client: ApiClient,
  data: BlogCategoryInput
): Promise<{ category: SiteBlogCategory | null; error: ApiError | null }> {
  // Emular criação com dados mockados
  if (USE_MOCK_DATA) {
    const newCategory: SiteBlogCategory = {
      id: `mock-${Date.now()}`,
      ...data,
      description: data.description || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return { 
      category: newCategory, 
      error: null 
    };
  }

  try {
    const { data: category, error } = await client.from('site_blog_categories')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    
    return { category: category as SiteBlogCategory, error: null };
  } catch (error) {
    return {
      category: null,
      error: client.handleError(error, 'blog-service.createBlogCategory')
    };
  }
}

// ===== AUTORES =====

/**
 * Busca um autor pelo ID
 * @param client Cliente da API
 * @param id ID do autor
 * @returns Autor encontrado ou erro
 */
export async function getBlogAuthorById(
  client: ApiClient,
  id: string
): Promise<{ author: SiteBlogAuthor | null; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    const mockAuthor = mockBlogAuthors.find(author => author.id === id);
    return { 
      author: mockAuthor || null, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_blog_authors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { author: data as SiteBlogAuthor, error: null };
  } catch (error) {
    return {
      author: null,
      error: client.handleError(error, 'blog-service.getBlogAuthorById')
    };
  }
}

/**
 * Busca todos os autores
 * @param client Cliente da API
 * @returns Lista de autores ou erro
 */
export async function getAllBlogAuthors(
  client: ApiClient
): Promise<{ authors: SiteBlogAuthor[]; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    return { 
      authors: mockBlogAuthors, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_blog_authors')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return { authors: data as SiteBlogAuthor[], error: null };
  } catch (error) {
    return {
      authors: [],
      error: client.handleError(error, 'blog-service.getAllBlogAuthors')
    };
  }
}

/**
 * Cria um novo autor
 * @param client Cliente da API
 * @param data Dados do autor
 * @returns Autor criado ou erro
 */
export async function createBlogAuthor(
  client: ApiClient,
  data: BlogAuthorInput
): Promise<{ author: SiteBlogAuthor | null; error: ApiError | null }> {
  // Emular criação com dados mockados
  if (USE_MOCK_DATA) {
    const newAuthor: SiteBlogAuthor = {
      id: `mock-${Date.now()}`,
      ...data,
      bio: data.bio || null,
      avatar_url: data.avatar_url || null,
      email: data.email || null,
      social_links: data.social_links || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return { 
      author: newAuthor, 
      error: null 
    };
  }

  try {
    const { data: author, error } = await client.from('site_blog_authors')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    
    return { author: author as SiteBlogAuthor, error: null };
  } catch (error) {
    return {
      author: null,
      error: client.handleError(error, 'blog-service.createBlogAuthor')
    };
  }
} 