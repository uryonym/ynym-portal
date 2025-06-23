import type { Metadata } from 'next'
import './globals.css'

import AppSidebar from '@/components/AppSidebar'
import Header from '@/components/Header'
import { SidebarProvider } from '@/components/ui/sidebar'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ynym-portal',
  description: '米山家のポータルサイト',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="ja">
      <body>
        <SidebarProvider defaultOpen>
          <AppSidebar />
          <div className="w-full">
            <Header />
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

export default RootLayout
