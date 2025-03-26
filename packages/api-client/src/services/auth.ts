import { ApiClient } from '../client';
import { ApiError } from '../types';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  } | null;
  error: ApiError | null;
}

/**
 * Efetua login com email e senha
 * @param client Cliente de API
 * @param credentials Credenciais do usuário
 * @returns Resposta da autenticação
 */
export async function signIn(
  client: ApiClient,
  credentials: AuthCredentials
): Promise<AuthResponse> {
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      throw { 
        message: error.message,
        code: 'auth_error',
        operation: 'signIn'
      };
    }

    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email!,
        role: (data.user.app_metadata?.role || 'user') as string,
      } : null,
      session: data.session ? {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      } : null,
      error: null
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: client.handleError(error, 'auth.signIn')
    };
  }
}

/**
 * Efetua logout da sessão atual
 * @param client Cliente de API
 * @returns Confirmação de sucesso ou erro
 */
export async function signOut(client: ApiClient): Promise<{ success: boolean; error: ApiError | null }> {
  try {
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: client.handleError(error, 'auth.signOut')
    };
  }
}

/**
 * Recupera o usuário atual da sessão
 * @param client Cliente de API
 * @returns Dados do usuário ou null
 */
export async function getCurrentUser(client: ApiClient) {
  try {
    const { data, error } = await client.auth.getUser();

    if (error) {
      throw error;
    }

    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email!,
        role: (data.user.app_metadata?.role || 'user') as string,
      } : null,
      error: null
    };
  } catch (error) {
    return {
      user: null,
      error: client.handleError(error, 'auth.getCurrentUser')
    };
  }
} 