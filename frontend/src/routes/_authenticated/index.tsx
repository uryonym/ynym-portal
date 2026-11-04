import { createFileRoute, Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  Calendar,
  CheckSquare,
  Car,
  Fuel,
  StickyNote,
  Folder,
  ChevronRight,
} from 'lucide-react'

import { useAuthUserQuery } from '@/hooks/queries/useAuth'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  const { data: user } = useAuthUserQuery()
  const todayText = format(new Date(), 'M月d日 (EEEE)', { locale: ja })

  const quickLinks = [
    {
      title: 'カレンダー',
      description: '予定・スケジュール',
      url: '/calendar',
      icon: Calendar,
    },
    {
      title: 'タスク',
      description: 'やることリスト',
      url: '/tasks',
      icon: CheckSquare,
    },
    {
      title: 'ノート',
      description: 'メモ・暮らしの記録',
      url: '/notes',
      icon: StickyNote,
    },
    {
      title: 'カテゴリ',
      description: 'ノートの分類',
      url: '/note-categories',
      icon: Folder,
    },
    {
      title: 'クルマ',
      description: '登録車両の確認',
      url: '/vehicles',
      icon: Car,
    },
    {
      title: '給油・燃費',
      description: '給油の記録と燃費',
      url: '/fuel-records',
      icon: Fuel,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex flex-col gap-1 pb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {todayText}
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {user ? `${user.name}さん、こんにちは` : 'こんにちは'}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border/80 shadow-2xs hover:border-primary/40 hover:bg-accent/25 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                  {item.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {item.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
