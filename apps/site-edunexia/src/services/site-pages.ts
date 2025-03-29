import { ApiClient } from '@edunexia/api-client/src/client';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';
import { ApiError } from '@edunexia/api-client/src/types';
import { mockPages } from './mock-data';

// Flag para habilitar modo de teste com dados mockados
const USE_MOCK_DATA = true;

/**
 * Dados para criar ou atualizar uma página
 */
export interface PageInput {
  slug: string;
  title: string;
  content: Record<string, any>;
  meta_description?: string | null;
  meta_keywords?: string | null;
  status?: 'published' | 'draft' | 'archived';
  featured_image_url?: string | null;
  published_at?: string | null;
}

/**
 * Busca uma página pelo slug
 * @param client Cliente da API
 * @param slug Slug da página
 * @returns Página encontrada ou erro
 */
export async function getPageBySlug(
  client: ApiClient,
  slug: string
): Promise<{ page: SitePage | null; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    const mockPage = mockPages.find(page => page.slug === slug);
    return { 
      page: mockPage || null, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_pages')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    return { page: data as SitePage, error: null };
  } catch (error) {
    return {
      page: null,
      error: client.handleError(error, 'site-pages.getPageBySlug')
    };
  }
}

/**
 * Busca todas as páginas publicadas
 * @param client Cliente da API
 * @returns Lista de páginas ou erro
 */
export async function getPublishedPages(
  client: ApiClient
): Promise<{ pages: SitePage[]; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    const publishedMockPages = mockPages.filter(page => page.status === 'published');
    return { 
      pages: publishedMockPages, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_pages')
      .select('*')
      .eq('status', 'published')
      .order('title', { ascending: true });
    
    if (error) throw error;
    
    return { pages: data as SitePage[], error: null };
  } catch (error) {
    return {
      pages: [],
      error: client.handleError(error, 'site-pages.getPublishedPages')
    };
  }
}

/**
 * Busca todas as páginas (admin)
 * @param client Cliente da API
 * @returns Lista de páginas ou erro
 */
export async function getAllPages(
  client: ApiClient
): Promise<{ pages: SitePage[]; error: ApiError | null }> {
  // Retornar dados mockados se estiver no modo de teste
  if (USE_MOCK_DATA) {
    return { 
      pages: mockPages, 
      error: null 
    };
  }

  try {
    const { data, error } = await client.from('site_pages')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return { pages: data as SitePage[], error: null };
  } catch (error) {
    return {
      pages: [],
      error: client.handleError(error, 'site-pages.getAllPages')
    };
  }
}

/**
 * Cria uma nova página
 * @param client Cliente da API
 * @param data Dados da página
 * @returns Página criada ou erro
 */
export async function createPage(
  client: ApiClient,
  data: PageInput
): Promise<{ page: SitePage | null; error: ApiError | null }> {
  // Emular criação com dados mockados
  if (USE_MOCK_DATA) {
    const newPage: SitePage = {
      id: `mock-${Date.now()}`,
      ...data,
      status: data.status || 'draft',
      published_at: data.status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      meta_description: data.meta_description || null,
      meta_keywords: data.meta_keywords || null,
      featured_image_url: data.featured_image_url || null
    };
    
    return { 
      page: newPage, 
      error: null 
    };
  }

  try {
    const { data: page, error } = await client.from('site_pages')
      .insert({
        ...data,
        status: data.status || 'draft',
        published_at: data.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { page: page as SitePage, error: null };
  } catch (error) {
    return {
      page: null,
      error: client.handleError(error, 'site-pages.createPage')
    };
  }
}

/**
 * Atualiza uma página existente
 * @param client Cliente da API
 * @param id ID da página
 * @param data Dados a serem atualizados
 * @returns Sucesso ou erro
 */
export async function updatePage(
  client: ApiClient,
  id: string,
  data: Partial<PageInput>
): Promise<{ success: boolean; error: ApiError | null }> {
  // Emular atualização com dados mockados
  if (USE_MOCK_DATA) {
    return { 
      success: true, 
      error: null 
    };
  }

  try {
    // Se estiver publicando uma página, adicione a data de publicação
    const updateData = { ...data };
    if (data.status === 'published' && !data.published_at) {
      updateData.published_at = new Date().toISOString();
    }
    
    const { error } = await client.from('site_pages')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'site-pages.updatePage')
    };
  }
}

/**
 * Remove uma página
 * @param client Cliente da API
 * @param id ID da página
 * @returns Sucesso ou erro
 */
export async function deletePage(
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
    const { error } = await client.from('site_pages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'site-pages.deletePage')
    };
  }
} 