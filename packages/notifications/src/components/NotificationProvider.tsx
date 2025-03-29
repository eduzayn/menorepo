import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from '@edunexia/api-client';
import { useAlerts } from '@edunexia/ui-components';
import { 
  Notification, 
  NotificationContextType, 
  NotificationProviderProps 
} from '../types';

// Criar contexto com valor inicial undefined
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Provedor de contexto para notificações
 * 
 * @example
 * ```tsx
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  polling = true,
  pollingInterval = 60000,
  fetchNotificationsFunction
}) => {
  const { client } = useApi();
  const { addAlert } = useAlerts();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Busca notificações do usuário
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (fetchNotificationsFunction) {
        // Usar função personalizada se fornecida
        const notificationsData = await fetchNotificationsFunction();
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter(n => !n.read).length);
      } else {
        // Implementação padrão - simulada
        // Na implementação real, substituir por chamada à API
        const mockNotifications = [
          {
            id: '1',
            title: 'Bem-vindo(a) à Edunéxia',
            message: 'É um prazer ter você conosco. Explore todas as funcionalidades disponíveis.',
            type: 'info' as const,
            read: false,
            createdAt: new Date(),
            link: '/dashboard'
          },
          {
            id: '2',
            title: 'Matrícula confirmada',
            message: 'Sua matrícula foi confirmada com sucesso.',
            type: 'success' as const,
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            link: '/matriculas'
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError('Erro ao buscar notificações');
    } finally {
      setLoading(false);
    }
  }, [client, fetchNotificationsFunction]);
  
  /**
   * Marca uma notificação como lida
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      // Simulação - substituir por chamada à API em produção
      // const { error } = await client.from('notifications')
      //   .update({ read: true })
      //   .eq('id', id);
      
      // Atualiza estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true, readAt: new Date() } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  }, [client]);
  
  /**
   * Marca todas notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // Simulação - substituir por chamada à API em produção
      // const { error } = await client.from('notifications')
      //   .update({ read: true })
      //   .eq('read', false);
      
      // Atualiza estado local
      const now = new Date();
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          read: true,
          readAt: notification.read ? notification.readAt : now
        }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Erro ao marcar todas notificações como lidas:', err);
    }
  }, [client]);
  
  /**
   * Deleta uma notificação
   */
  const deleteNotification = useCallback(async (id: string) => {
    try {
      // Simulação - substituir por chamada à API em produção
      // const { error } = await client.from('notifications')
      //   .delete()
      //   .eq('id', id);
      
      // Atualiza estado local
      const notificationToDelete = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
    }
  }, [client, notifications]);
  
  /**
   * Mostra uma notificação como alerta na tela
   */
  const showNotificationAlert = useCallback((notification: Notification) => {
    addAlert({
      type: notification.type,
      title: notification.title,
      message: notification.message
    });
    
    // Marca como lida automaticamente quando exibida como alerta
    markAsRead(notification.id);
  }, [addAlert, markAsRead]);
  
  // Efeito para buscar notificações iniciais e configurar polling
  useEffect(() => {
    fetchNotifications();
    
    // Configurar polling se ativado
    let interval: NodeJS.Timeout | null = null;
    
    if (polling) {
      interval = setInterval(fetchNotifications, pollingInterval);
    }
    
    // Cleanup quando o componente for desmontado
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchNotifications, polling, pollingInterval]);
  
  // Contexto a ser compartilhado
  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showNotificationAlert
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de notificações
 * 
 * @returns Contexto de notificações
 * @throws Error se usado fora do NotificationProvider
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  
  return context;
};

export default NotificationProvider; 