import type { Database as BaseDatabase } from '../index';

export type PageStatus = 'published' | 'draft' | 'archived';

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  content: Record<string, any>;
  meta_description: string | null;
  meta_keywords: string | null;
  status: PageStatus;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface SiteBlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Record<string, any>;
  featured_image_url: string | null;
  author_id: string;
  category_ids: string[];
  status: PageStatus;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface SitePostCategory {
  post_id: string;
  category_id: string;
}

export interface SiteLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SiteTestimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  is_featured: boolean;
  created_at: string;
  published_at: string | null;
}

export interface SiteSetting {
  id: string;
  value: Record<string, any>;
  updated_at: string;
  updated_by: string | null;
}

export interface SiteSection {
  id: string;
  name: string;
  type: string;
  content: Record<string, any>;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SiteFeaturedCourse {
  id: string;
  course_id: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteMenuItem {
  id: string;
  parent_id: string | null;
  title: string;
  link: string;
  order_index: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteBlogAuthor {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

// Extenda o tipo Database para incluir as tabelas do site-edunexia
export interface SiteDatabase {
  public: {
    Tables: BaseDatabase['public']['Tables'] & {
      site_pages: {
        Row: SitePage;
        Insert: Omit<SitePage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SitePage, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_blog_posts: {
        Row: SiteBlogPost;
        Insert: Omit<SiteBlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteBlogPost, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_blog_categories: {
        Row: SiteBlogCategory;
        Insert: Omit<SiteBlogCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteBlogCategory, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_menu_items: {
        Row: SiteMenuItem;
        Insert: Omit<SiteMenuItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteMenuItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_blog_authors: {
        Row: SiteBlogAuthor;
        Insert: Omit<SiteBlogAuthor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteBlogAuthor, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Enums: BaseDatabase['public']['Enums'];
  };
  financeiro: BaseDatabase['financeiro'];
} 