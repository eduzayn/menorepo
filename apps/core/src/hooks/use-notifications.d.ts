/**
 * Interface da notificação
 */
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date | string;
    link?: string;
}
/**
 * Hook para gerenciar notificações do usuário
 */
export declare function useNotifications(): {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    showNotificationAlert: (notification: Notification) => void;
};
//# sourceMappingURL=use-notifications.d.ts.map