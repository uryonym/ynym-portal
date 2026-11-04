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
  Leaf,
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
    title: 'カテゴリ',
    url: '/note-categories',
    icon: Folder,
  },
  {
    title: 'クルマ',
    url: '/vehicles',
    icon: Car,
  },
  {
    title: '給油・燃費',
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
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-4 py-4 border-b border-sidebar-border/60">
        <Link
          to="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-2.5 px-1.5 py-1 rounded-lg transition-opacity hover:opacity-80"
        >
          <div className="w-7 h-7 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground tracking-tight text-base leading-none">
            ynym portal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
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
                      className={`h-9 px-3 text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-3 ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          : 'text-muted-foreground font-medium hover:text-foreground hover:bg-muted/70'
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-primary' : 'text-muted-foreground/80'
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
          <SidebarGroup className="mt-3 pt-3 border-t border-sidebar-border/60">
            <SidebarGroupLabel className="px-3 mb-1 text-[11px] font-medium text-muted-foreground">
              管理
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {adminMenuItems.map((item) => {
                  const isActive = pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link to={item.url} />}
                        isActive={isActive}
                        onClick={() => setOpenMobile(false)}
                        className={`h-9 px-3 text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-3 ${
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            : 'text-muted-foreground font-medium hover:text-foreground hover:bg-muted/70'
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground/80'
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
        <SidebarFooter className="border-t border-sidebar-border/60 p-3">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-card/70 border border-border/60">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-border shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-foreground truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-muted-foreground truncate mt-0.5">
                {user.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
