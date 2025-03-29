import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@edunexia/api-client';
import { useAlerts } from '@edunexia/ui-components';
import { Notification } from '../types';

/**
 * Hook para gerenciar notificações do usuário
 * 
 * @example
 * ```tsx
 * const { 
 *   notifications, 
 *   unreadCount, 
 *   markAsRead 
 * } = useNotifications();
 * ```
 */
export function useNotifications() {
  const { client } = useApi();
  const { addAlert } = useAlerts();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Busca todas as notificações do usuário
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada à API - substituir por chamada real quando disponível
      // const { data, error } = await client.from('notifications')
      //   .select('*')
      //   .order('createdAt', { ascending: false });
      
      // Simulação de resposta da API
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
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError('Erro ao buscar notificações');
    } finally {
      setLoading(false);
    }
  }, [client]);
  
  /**
   * Marca uma notificação como lida
   * @param id ID da notificação
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      // Simulação de chamada à API - substituir por chamada real quando disponível
      // const { error } = await client.from('notifications')
      //   .update({ read: true })
      //   .eq('id', id);
      
      // Atualiza estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  }, [client]);
  
  /**
   * Marca todas as notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // Simulação de chamada à API - substituir por chamada real quando disponível
      // const { error } = await client.from('notifications')
      //   .update({ read: true })
      //   .eq('read', false);
      
      // Atualiza estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Erro ao marcar todas notificações como lidas:', err);
    }
  }, [client]);
  
  /**
   * Deleta uma notificação
   * @param id ID da notificação
   */
  const deleteNotification = useCallback(async (id: string) => {
    try {
      // Simulação de chamada à API - substituir por chamada real quando disponível
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
   * Mostra uma notificação como alerta
   * @param notification Notificação a ser exibida
   */
  const showNotificationAlert = useCallback((notification: Notification) => {
    addAlert({
      type: notification.type,
      title: notification.title,
      message: notification.message
    });
    
    // Marca como lida automaticamente
    markAsRead(notification.id);
  }, [addAlert, markAsRead]);
  
  // Carrega notificações ao inicializar
  useEffect(() => {
    fetchNotifications();
    
    // Simulação de polling - substituir por websockets quando disponível
    const interval = setInterval(fetchNotifications, 60000); // 1 minuto
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);
  
  return {
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
} 