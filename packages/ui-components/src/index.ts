/**
 * @edunexia/ui-components
 * 
 * Biblioteca de componentes padronizados para a plataforma Edunéxia.
 * Centraliza componentes reutilizáveis e templates para uso em todos os módulos.
 */

// Data Display
export { default as StatsCard } from './components/data-display/StatsCard';
export type { StatsCardProps } from './components/data-display/StatsCard';

// Layout
export { default as DashboardLayout } from './components/layout/DashboardLayout';
export type { DashboardLayoutProps } from './components/layout/DashboardLayout';

// Templates
export { default as DashboardPageTemplate } from './templates/DashboardPage';
export type { DashboardPageTemplateProps } from './templates/DashboardPage';

export { default as SettingsPageTemplate } from './templates/SettingsPage';
export type { SettingsPageTemplateProps, SettingsTabProps } from './templates/SettingsPage';
