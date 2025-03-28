// Aqui serão exportados os componentes reutilizáveis do core
// Por enquanto, exportamos apenas um componente de exemplo

export const ApiProvider = ({ children, options }: { children: React.ReactNode, options: any }) => {
  return children;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export const ThemeProvider = ({ children, defaultTheme }: { children: React.ReactNode, defaultTheme: string }) => {
  return children;
};

export const AlertProvider = ({ children, position }: { children: React.ReactNode, position: string }) => {
  return children;
}; 