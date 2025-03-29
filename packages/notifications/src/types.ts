/**
 * Tipos para o sistema de notificações da Edunéxia
 */

/**
 * Tipos de notificação
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Status de leitura da notificação
 */
export type NotificationStatus = 'read' | 'unread';

/**
 * Canais de entrega de notificações
 */
export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'push';

/**
 * Interface básica da notificação
 */
export interface Notification {
  /** Identificador único da notificação */
  id: string;
  
  /** Título da notificação */
  title: string;
  
  /** Mensagem de conteúdo */
  message: string;
  
  /** Tipo de notificação */
  type: NotificationType;
  
  /** Status de leitura */
  read: boolean;
  
  /** Data de criação */
  createdAt: Date | string;
  
  /** Link associado (opcional) */
  link?: string;
  
  /** Módulo de origem (opcional) */
  module?: string;
  
  /** Data de leitura (opcional) */
  readAt?: Date | string;
  
  /** Detalhes adicionais (opcional) */
  details?: Record<string, any>;
  
  /** Canais para os quais essa notificação foi enviada */
  channels?: NotificationChannel[];
}

/**
 * Interface para o provedor de notificações
 */
export interface NotificationProviderProps {
  children: React.ReactNode;
  
  /** Ativar polling para novas notificações */
  polling?: boolean;
  
  /** Intervalo de polling em milissegundos */
  pollingInterval?: number;
  
  /** Função personalizada para buscar notificações */
  fetchNotificationsFunction?: () => Promise<Notification[]>;
}

/**
 * Interface para o contexto de notificações
 */
export interface NotificationContextType {
  /** Lista de notificações */
  notifications: Notification[];
  
  /** Quantidade de notificações não lidas */
  unreadCount: number;
  
  /** Estado de carregamento */
  loading: boolean;
  
  /** Mensagem de erro, se houver */
  error: string | null;
  
  /** Busca notificações do servidor */
  fetchNotifications: () => Promise<void>;
  
  /** Marca uma notificação como lida */
  markAsRead: (id: string) => Promise<void>;
  
  /** Marca todas as notificações como lidas */
  markAllAsRead: () => Promise<void>;
  
  /** Deleta uma notificação */
  deleteNotification: (id: string) => Promise<void>;
  
  /** Exibe uma notificação como alerta */
  showNotificationAlert: (notification: Notification) => void;
} 