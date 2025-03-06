import { Outlet } from 'react-router'
import type { Route } from '../+types/root'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/AppSidebar'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Ynym Portal' }, { name: 'description', content: 'Welcome to Ynym Portal!' }]
}

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="w-full">
        <header className="flex items-center h-12 bg-orange-100">
          <SidebarTrigger className="ms-2" />
          <span className="ms-2">ynym-portal</span>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
