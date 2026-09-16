import type { Metadata, Viewport } from 'next'

import { AuthProvider } from '@/providers/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: 'Ynym Portal',
  description: 'Ynym Family Portal Site.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={cn('font-sans', inter.variable, notoSansJP.variable)}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
