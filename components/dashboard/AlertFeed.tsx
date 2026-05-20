import { AlertTriangle, Clock, CheckCircle, Bell } from 'lucide-react'
import { formatDate } from '@/lib/formulas'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  severity: string
  createdAt: Date | string
}

export default function AlertFeed({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return <p className="text-sm text-[#94A3B8] text-center py-8">No pending alerts</p>
  }

  const icon = (severity: string) => {
    if (severity === 'URGENT') return <AlertTriangle size={16} className="text-red-500" />
    if (severity === 'WARNING') return <Clock size={16} className="text-amber-500" />
    return <Bell size={16} className="text-blue-500" />
  }

  const bg = (severity: string) => {
    if (severity === 'URGENT') return 'bg-red-50 border-red-200'
    if (severity === 'WARNING') return 'bg-amber-50 border-amber-200'
    return 'bg-blue-50 border-blue-200'
  }

  return (
    <div className="space-y-2">
      {notifications.map(n => (
        <div key={n.id} className={`flex gap-3 p-3 rounded-lg border ${bg(n.severity)}`}>
          <div className="mt-0.5 shrink-0">{icon(n.severity)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#0F172A] truncate">{n.title}</p>
            <p className="text-xs text-[#475569] mt-0.5 line-clamp-2">{n.message}</p>
            <p className="text-xs text-[#94A3B8] mt-1">{formatDate(n.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
