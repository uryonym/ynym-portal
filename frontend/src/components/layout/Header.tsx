import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, Leaf, LogOut, User } from 'lucide-react'

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
    return { title: 'ノート編集', parent: { title: 'ノート', url: '/notes' } }
  }
  if (pathname.startsWith('/notes')) return { title: 'ノート' }
  if (pathname.startsWith('/note-categories')) return { title: 'カテゴリ' }
  if (pathname.startsWith('/vehicles')) return { title: 'クルマ' }
  if (pathname.startsWith('/fuel-records')) return { title: '給油・燃費' }
  if (pathname.startsWith('/users')) return { title: 'ユーザー管理' }
  if (pathname.startsWith('/trash')) return { title: 'ゴミ箱' }
  if (pathname.startsWith('/calendar')) return { title: 'カレンダー' }
  return { title: 'ホーム' }
}

export function Header() {
  const { data: user, isLoading } = useAuthUserQuery()
  const logoutMutation = useLogoutMutation()
  const location = useLocation()
  const pageInfo = getPageInfo(location.pathname)

  return (
    <header className="sticky top-0 z-40 h-14 bg-background/85 backdrop-blur-md border-b border-border/80 flex items-center justify-between px-4 sm:px-6 gap-4">
      <div className="flex items-center gap-3">
        {/* モバイル表示: サイドバートグル + アプリ名 */}
        <div className="flex md:hidden items-center gap-2.5">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              ynym portal
            </span>
          </Link>
        </div>

        {/* デスクトップ表示: パンくずリスト */}
        <div className="hidden md:flex items-center gap-1.5 text-sm">
          {pageInfo.parent ? (
            <div className="flex items-center gap-1.5 text-xs">
              <Link
                to={pageInfo.parent.url}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {pageInfo.parent.title}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="font-semibold text-foreground">
                {pageInfo.title}
              </span>
            </div>
          ) : (
            <span className="font-semibold text-foreground text-sm">
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
                className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
            <span className="text-xs sm:text-sm font-medium text-foreground/85 hidden sm:inline">
              {user.name}
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors gap-1.5 rounded-lg cursor-pointer"
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
