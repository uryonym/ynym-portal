import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CheckSquare,
  Car,
  Fuel,
  StickyNote,
  Folder,
  ArrowRight,
  Sparkles,
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
      color:
        'text-indigo-600 bg-indigo-50/80 border-indigo-100/60 group-hover:bg-indigo-600 group-hover:text-white',
    },
    {
      title: 'ノート',
      description: '日々のメモや記録',
      url: '/notes',
      icon: StickyNote,
      color:
        'text-amber-600 bg-amber-50/80 border-amber-100/60 group-hover:bg-amber-600 group-hover:text-white',
    },
    {
      title: 'カテゴリ',
      description: 'ノートの分類整理',
      url: '/note-categories',
      icon: Folder,
      color:
        'text-purple-600 bg-purple-50/80 border-purple-100/60 group-hover:bg-purple-600 group-hover:text-white',
    },
    {
      title: '車両管理',
      description: '愛車の情報・車検確認',
      url: '/vehicles',
      icon: Car,
      color:
        'text-emerald-600 bg-emerald-50/80 border-emerald-100/60 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      title: '燃費管理',
      description: '給油と燃費の記録',
      url: '/fuel-records',
      icon: Fuel,
      color:
        'text-sky-600 bg-sky-50/80 border-sky-100/60 group-hover:bg-sky-600 group-hover:text-white',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/5 text-slate-700 text-xs font-medium">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>ダッシュボード</span>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {user ? `こんにちは、${user.name}さん` : 'こんにちは'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          利用するメニューを選択してください
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className="group relative block p-5 bg-white rounded-2xl border border-slate-200/70 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-2xs ${item.color}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {item.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
