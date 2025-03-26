import { Card } from '@edunexia/ui-components'
import { Progress } from '@edunexia/ui-components'

interface ProgressData {
  label: string
  value: number
  total: number
}

interface ProgressChartProps {
  title: string
  data: ProgressData[]
  description?: string
}

export function ProgressChart({ title, data, description }: ProgressChartProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value}/{item.total}
                </span>
              </div>
              <Progress
                value={(item.value / item.total) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
} 