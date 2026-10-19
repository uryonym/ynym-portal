import { Link, useLocation } from '@tanstack/react-router'
import {
  Calendar,
  Home,
  CheckSquare,
  StickyNote,
  Folder,
  Car,
  Fuel,
  Trash2,
  User,
  Users,
  Layers,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuthUserQuery } from '@/hooks/queries/useAuth'

const menuItems = [
  {
    title: 'ホーム',
    url: '/',
    icon: Home,
  },
  {
    title: 'カレンダー',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'タスク',
    url: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'ノート',
    url: '/notes',
    icon: StickyNote,
  },
  {
    title: 'ノートカテゴリ',
    url: '/note-categories',
    icon: Folder,
  },
  {
    title: '車両管理',
    url: '/vehicles',
    icon: Car,
  },
  {
    title: '燃費管理',
    url: '/fuel-records',
    icon: Fuel,
  },
  {
    title: 'ゴミ箱',
    url: '/trash',
    icon: Trash2,
  },
]

const adminMenuItems = [
  {
    title: 'ユーザー管理',
    url: '/users',
    icon: Users,
  },
]

export function AppSidebar() {
  const { data: user, isLoading } = useAuthUserQuery()
  const location = useLocation()
  const pathname = location.pathname
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white shadow-2xs">
      <SidebarHeader className="p-4 border-b border-slate-100/80">
        <Link
          to="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-3 px-1.5 py-1 rounded-xl transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-center shadow-xs ring-1 ring-black/10 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 tracking-tight text-sm leading-tight">
              Ynym Portal
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              Workspace
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  item.url === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.url)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      isActive={isActive}
                      onClick={() => setOpenMobile(false)}
                      className={`h-9 px-3 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-3 ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-xs hover:bg-slate-900 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isLoading && user?.is_admin && (
          <SidebarGroup className="mt-4 pt-3 border-t border-slate-100/80">
            <SidebarGroupLabel className="px-3 mb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              管理者メニュー
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminMenuItems.map((item) => {
                  const isActive = pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link to={item.url} />}
                        isActive={isActive}
                        onClick={() => setOpenMobile(false)}
                        className={`h-9 px-3 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-3 ${
                          isActive
                            ? 'bg-slate-900 text-white font-semibold shadow-xs hover:bg-slate-900 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {!isLoading && user && (
        <SidebarFooter className="border-t border-slate-100/80 p-3">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-200/50 shadow-2xs">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-2xs shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-400 truncate mt-0.5">
                {user.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
