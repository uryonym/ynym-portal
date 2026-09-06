import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import Header from '@/components/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-50/60 min-h-screen">
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
