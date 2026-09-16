import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CheckSquare,
  Car,
  Fuel,
  StickyNote,
  Folder,
  ArrowRight,
} from 'lucide-react'
import { useAuthUserQuery } from '@/hooks/queries/useAuth'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  const { data: user } = useAuthUserQuery()

  const quickLinks = [
    {
      title: 'タスク',
      description: '日々のやることリスト',
      url: '/tasks',
      icon: CheckSquare,
    },
    {
      title: 'ノート',
      description: '日々のメモや記録',
      url: '/notes',
      icon: StickyNote,
    },
    {
      title: 'カテゴリ',
      description: 'ノートの分類整理',
      url: '/note-categories',
      icon: Folder,
    },
    {
      title: '車両管理',
      description: '愛車の情報・車検確認',
      url: '/vehicles',
      icon: Car,
    },
    {
      title: '燃費管理',
      description: '給油と燃費の記録',
      url: '/fuel-records',
      icon: Fuel,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Greeting */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {user ? `こんにちは、${user.name}さん` : 'こんにちは'}
        </h1>
        <p className="text-sm text-slate-500">
          利用するメニューを選択してください
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className="group block p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              {item.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
