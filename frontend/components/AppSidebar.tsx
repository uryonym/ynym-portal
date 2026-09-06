'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Home, CheckSquare, Car, Fuel, User } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const menuItems = [
  {
    title: 'ホーム',
    url: '/',
    icon: Home,
  },
  {
    title: 'タスク',
    url: '/tasks',
    icon: CheckSquare,
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
]

export function AppSidebar() {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white">
      <SidebarHeader className="p-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight text-base">
            Ynym Portal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
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
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      className="h-10 px-3 text-sm font-medium rounded-lg transition-colors"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!isLoading && user && (
        <SidebarFooter className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-50/60">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-600" />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 truncate">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-500 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
