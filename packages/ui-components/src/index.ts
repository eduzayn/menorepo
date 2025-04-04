/**
 * @edunexia/ui-components
 * 
 * Biblioteca de componentes padronizados para a plataforma Edunéxia.
 * Centraliza componentes reutilizáveis e templates para uso em todos os módulos.
 */

// Data Display
export { default as StatsCard } from './components/data-display/StatsCard';
export type { StatsCardProps } from './components/data-display/StatsCard';
export { DashboardCard } from './components/data-display/DashboardCard';
export type { DashboardCardProps } from './components/data-display/DashboardCard';
export { default as CourseCard } from './components/data-display/CourseCard';
export type { CourseCardProps } from './components/data-display/CourseCard';
export { default as DisciplineCard } from './components/data-display/DisciplineCard';
export type { DisciplineCardProps } from './components/data-display/DisciplineCard';

// Layout
export { default as DashboardLayout } from './components/layout/DashboardLayout';
export type { DashboardLayoutProps } from './components/layout/DashboardLayout';

export { default as PageHeader } from './components/layout/PageHeader';
export type { PageHeaderProps } from './components/layout/PageHeader';

export { default as MainLayout } from './components/layout/MainLayout';
export type { MainLayoutProps, NavigationItem } from './components/layout/MainLayout';

// Forms
export { default as FormField } from './components/forms/FormField';
export type { FormFieldProps } from './components/forms/FormField';

export { default as Input } from './components/forms/Input';
export type { InputProps } from './components/forms/Input';

export { default as Select } from './components/forms/Select';
export type { SelectProps, SelectOption } from './components/forms/Select';

// Feedback
export { default as NotificationCard } from './components/feedback/NotificationCard';
export type { NotificationCardProps } from './components/feedback/NotificationCard';

export { default as Alert } from './components/feedback/Alert';
export type { AlertProps, AlertType } from './components/feedback/Alert';

export { default as Loader } from './components/feedback/Loader';
export type { LoaderProps } from './components/feedback/Loader';

// Templates
export { default as DashboardPageTemplate } from './templates/DashboardPage';
export type { DashboardPageTemplateProps } from './templates/DashboardPage';

export { default as SettingsPageTemplate } from './templates/SettingsPage';
export type { SettingsPageTemplateProps, SettingsTabProps } from './templates/SettingsPage';

// Card Components
export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from './components/card';

// Chat
export { default as ChatMessage } from './components/chat/ChatMessage';
export type { ChatMessageProps } from './components/chat/ChatMessage';

// Contextos
export {
  ThemeProvider,
  useTheme,
  type Theme,
  type ThemeContextType,
  type ThemeProviderProps,
  AlertProvider,
  useAlerts,
  type AlertItem,
  type AlertContextType,
  type AlertProviderProps
} from './contexts';
