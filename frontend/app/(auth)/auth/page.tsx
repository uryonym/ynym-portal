'use client'

import { Home } from 'lucide-react'
import { GoogleAuthButton } from '@/components/GoogleAuthButton'

export default function AuthPage() {
  const currentYear = new Date().getFullYear()

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-50 font-sans">
      <div className="w-full max-w-sm space-y-6">
        {/* Simple Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 space-y-6 text-center">
          {/* App Icon & Title */}
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Ynym Portal
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                ログインして利用を開始
              </p>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <GoogleAuthButton />
          </div>
        </div>

        {/* Minimal Footer */}
        <p className="text-center text-xs text-slate-400">
          © {currentYear} Ynym
        </p>
      </div>
    </main>
  )
}
