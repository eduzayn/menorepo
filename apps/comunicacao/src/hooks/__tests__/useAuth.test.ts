import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { supabase } from '../../services/supabase';

// Mock do cliente Supabase
jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

describe('useAuth', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    user_metadata: {
      role: 'admin',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it('handles successful session check', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: mockUser } },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles auth state change', async () => {
    const mockSubscription = {
      unsubscribe: jest.fn(),
    };

    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValueOnce({
      data: { subscription: mockSubscription },
    });

    const { result, unmount } = renderHook(() => useAuth());

    await act(async () => {
      const callback = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0];
      callback('SIGNED_IN', { session: { user: mockUser } });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);

    unmount();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('handles successful sign in', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('handles sign in error', async () => {
    const error = new Error('Invalid credentials');
    (supabase.auth.signInWithPassword as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.signIn('test@example.com', 'wrongpassword')).rejects.toThrow(error);
    });
  });

  it('handles successful sign out', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('handles sign out error', async () => {
    const error = new Error('Sign out failed');
    (supabase.auth.signOut as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.signOut()).rejects.toThrow(error);
    });
  });
}); 