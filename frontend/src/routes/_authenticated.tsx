import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AppSidebar } from '@/components/AppSidebar'
import { Header } from '@/components/Header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { authQueries } from '@/hooks/queries/useAuth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    try {
      const user = await context.queryClient.ensureQueryData(authQueries.user())
      if (!user) {
        throw redirect({
          to: '/auth',
          search: {
            redirect: location.href,
          },
        })
      }
      return { user }
    } catch (e) {
      if (e && typeof e === 'object' && 'isRedirect' in e) {
        throw e
      }
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-slate-50">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
