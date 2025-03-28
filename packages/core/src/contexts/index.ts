// Aqui serão exportados os contextos do core
import React from 'react';

// Implementações temporárias para suportar módulos em desenvolvimento
export const UserProvider = ({ children }: { children: React.ReactNode }) => children;

export const ThemeProvider = ({ children, defaultTheme }: { children: React.ReactNode, defaultTheme?: string }) => children;

export const AlertProvider = ({ children, position }: { children: React.ReactNode, position?: string }) => children;

export const ApiProvider = ({ children, options }: { children: React.ReactNode, options: any }) => children;

// Contextos stubbados
export const UserContext = {
  Provider: UserProvider
};

export const ThemeContext = {
  Provider: ThemeProvider
};

export const AlertContext = {
  Provider: AlertProvider
}; 