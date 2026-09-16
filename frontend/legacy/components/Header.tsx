'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'

export default function Header() {
  const { user, logout, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/90 backdrop-blur-xs border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 gap-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
        <Separator orientation="vertical" className="h-5 bg-slate-200" />
        <span className="text-base font-semibold text-slate-900 tracking-tight">
          Ynym Portal
        </span>
      </div>

      {!isLoading && user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="h-8 text-xs text-slate-500 hover:text-slate-900 gap-1.5 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ログアウト</span>
          </Button>
        </div>
      )}
    </header>
  )
}
