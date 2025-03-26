import { Bell, Search, User } from 'lucide-react'
import { Input } from '@edunexia/ui-components'

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-muted">
          <Bell className="h-5 w-5" />
        </button>
        <button className="flex items-center gap-2 rounded-full p-2 hover:bg-muted">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
} 