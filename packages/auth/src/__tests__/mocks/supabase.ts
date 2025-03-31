import { Session, User } from '@supabase/supabase-js';
import { jest } from '@jest/globals';
import { AuthError, MockSupabaseClient } from '../types';

export const mockSupabaseClient: MockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    getSession: jest.fn()
  }
}; 