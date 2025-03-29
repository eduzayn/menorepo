/**
 * Contextos do sistema
 */

// Contexto de tema
export { 
  default as ThemeProvider,
  useTheme,
  type Theme,
  type ThemeContextType,
  type ThemeProviderProps
} from './ThemeContext';

// Contexto de alertas
export { 
  default as AlertProvider,
  useAlerts,
  type AlertItem,
  type AlertContextType,
  type AlertProviderProps
} from './AlertContext'; 