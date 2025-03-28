// Aqui serão exportados os hooks do core

// Hook temporário para exemplo
export const useUser = () => {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {}
  };
};

export const useTheme = () => {
  return {
    theme: 'light',
    setTheme: (theme: string) => {}
  };
};

export const useAlert = () => {
  return {
    showAlert: (message: string) => {},
    hideAlert: () => {}
  };
}; 