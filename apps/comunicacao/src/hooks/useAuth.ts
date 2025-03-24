import { useAuth as useUnifiedAuth } from '@edunexia/auth';

export function useAuth() {
  const auth = useUnifiedAuth();

  return {
    user: auth.user,
    loading: auth.loading,
    signIn: auth.signIn,
    signOut: auth.signOut,
    signUp: auth.signUp,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
  };
} 