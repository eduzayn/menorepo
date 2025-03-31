import { ModulePermission, User, UserRole } from '@edunexia/auth';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  featured_image?: string;
  author_id?: string;
  parent_id?: string;
  order?: number;
  template?: string;
  settings?: Record<string, any>;
}

export interface SiteBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
  author: SiteBlogAuthor;
  category: SiteBlogCategory;
}

export interface SiteBlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SiteBlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface SiteMenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  parent_id?: string;
  children?: SiteMenuItem[];
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select';
  options?: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  status: 'new' | 'contacted' | 'converted';
  created_at: string;
  updated_at: string;
}

export interface AsaasPaymentResponse {
  id: string;
  dateCreated: string;
  dueDate: string;
  value: number;
  status: string;
  billingType: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
}

export interface CheckoutPageParams {
  planId: string;
  couponCode?: string;
}

export interface TrialPageParams {
  planId: string;
  institutionId: string;
}

export interface PortalConfig {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: ModulePermission) => boolean;
  hasAnyPermission: (permissions: ModulePermission[]) => boolean;
  hasAllPermissions: (permissions: ModulePermission[]) => boolean;
}

export interface AuthContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
} 