import React, { useState } from 'react';
import { NotificationCard } from '@edunexia/ui-components';
import { Button } from '@edunexia/ui-components';
import { toast } from 'sonner';

export const NotificationExample: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Nova mensagem recebida',
      content: 'Você recebeu uma nova mensagem de João Silva.',
      type: 'info',
      date: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
      unread: true
    },
    {
      id: '2',
      title: 'Campanha finalizada',
      content: 'A campanha "Matrícula 2023" foi finalizada com sucesso.',
      type: 'success',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      unread: false
    },
    {
      id: '3',
      title: 'Alerta de sistema',
      content: 'O limite de envios diários está próximo de ser atingido.',
      type: 'warning',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      unread: true
    }
  ]);

  const handleNotificationClose = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notificação removida com sucesso');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const addRandomNotification = () => {
    const types = ['success', 'info', 'warning', 'error', 'default'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newNotification = {
      id: Date.now().toString(),
      title: `Nova notificação ${randomType}`,
      content: `Esta é uma notificação de exemplo do tipo ${randomType}`,
      type: randomType,
      date: new Date(),
      unread: true
    };

    setNotifications([newNotification, ...notifications]);
    toast.success('Nova notificação adicionada');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Exemplo de Notificações</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => n.unread)}
          >
            Marcar todas como lidas
          </Button>
          <Button onClick={addRandomNotification}>
            Adicionar notificação
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma notificação para exibir</p>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              title={notification.title}
              message={notification.content}
              date={notification.date.toLocaleString()}
              isRead={!notification.unread}
              onRead={() => handleNotificationClose(notification.id)}
              onDelete={() => handleNotificationClose(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}; 