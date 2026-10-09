import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, Layers, LogOut, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthUserQuery, useLogoutMutation } from '@/hooks/queries/useAuth'

function getPageInfo(pathname: string): {
  title: string
  parent?: { title: string; url: string }
} {
  if (pathname === '/') return { title: 'ホーム' }
  if (pathname.startsWith('/tasks')) return { title: 'タスク' }
  if (pathname === '/notes/new') {
    return { title: '新規作成', parent: { title: 'ノート', url: '/notes' } }
  }
  if (pathname.startsWith('/notes/') && pathname !== '/notes') {
    return { title: '詳細・編集', parent: { title: 'ノート', url: '/notes' } }
  }
  if (pathname.startsWith('/notes')) return { title: 'ノート' }
  if (pathname.startsWith('/note-categories'))
    return { title: 'ノートカテゴリ' }
  if (pathname.startsWith('/vehicles')) return { title: '車両管理' }
  if (pathname.startsWith('/fuel-records')) return { title: '燃費管理' }
  if (pathname.startsWith('/users')) return { title: 'ユーザー管理' }
  if (pathname.startsWith('/trash')) return { title: 'ゴミ箱' }
  return { title: 'ホーム' }
}

export function Header() {
  const { data: user, isLoading } = useAuthUserQuery()
  const logoutMutation = useLogoutMutation()
  const location = useLocation()
  const pageInfo = getPageInfo(location.pathname)

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between px-4 sm:px-6 gap-4">
      <div className="flex items-center gap-3">
        {/* モバイル表示: サイドバートグル + アプリ名 */}
        <div className="flex md:hidden items-center gap-2.5">
          <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-center shadow-xs">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Ynym Portal
            </span>
          </Link>
        </div>

        {/* デスクトップ表示: パンくずリスト（アプリ名はサイドバーにあるため非表示にして重複防止） */}
        <div className="hidden md:flex items-center gap-1.5 text-sm">
          {pageInfo.parent ? (
            <div className="flex items-center gap-1.5 text-xs">
              <Link
                to={pageInfo.parent.url}
                className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                {pageInfo.parent.title}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {pageInfo.title}
              </span>
            </div>
          ) : (
            <span className="font-semibold text-slate-900 text-sm">
              {pageInfo.title}
            </span>
          )}
        </div>
      </div>

      {!isLoading && user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200/80"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="h-4 w-4" />
              </div>
            )}
            <span className="text-xs sm:text-sm font-medium text-slate-700 hidden sm:inline">
              {user.name}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="h-8 px-2.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 transition-colors gap-1.5 rounded-lg cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {logoutMutation.isPending ? 'ログアウト中...' : 'ログアウト'}
            </span>
          </Button>
        </div>
      )}
    </header>
  )
}
