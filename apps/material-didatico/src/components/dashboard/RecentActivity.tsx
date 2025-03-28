import { Card } from '@edunexia/ui-components'
import { Avatar } from '@edunexia/ui-components'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Activity {
  id: string
  type: 'create' | 'edit' | 'publish' | 'review'
  title: string
  author: {
    name: string
    avatar?: string
  }
  timestamp: Date
  details?: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return '✨'
      case 'edit':
        return '✏️'
      case 'publish':
        return '📢'
      case 'review':
        return '👀'
      default:
        return '📝'
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Atividades Recentes</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Avatar
                  src={activity.author.avatar}
                  alt={activity.author.name}
                  className="h-6 w-6"
                />
                <span className="text-sm font-medium">{activity.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
              <p className="text-sm">{activity.title}</p>
              {activity.details && (
                <p className="text-sm text-muted-foreground">{activity.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 