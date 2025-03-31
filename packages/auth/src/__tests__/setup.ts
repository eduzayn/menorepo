import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      getSession: jest.fn()
    }
  }))
})); 