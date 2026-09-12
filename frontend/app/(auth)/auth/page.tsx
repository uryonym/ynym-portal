'use client'

import { Suspense } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { GoogleAuthButton } from '@/components/GoogleAuthButton'

function AuthContent() {
  const currentYear = new Date().getFullYear()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
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

        {error === 'unauthorized' && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">
                アクセスが制限されています
              </p>
              <p className="mt-0.5 leading-relaxed">
                このGoogleアカウントは事前登録されていないか、利用が停止されています。管理者に問い合わせてください。
              </p>
            </div>
          </div>
        )}

        {/* Login Button */}
        <div className="pt-2">
          <GoogleAuthButton />
        </div>
      </div>

      {/* Minimal Footer */}
      <p className="text-center text-xs text-slate-400">© {currentYear} Ynym</p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-50 font-sans">
      <Suspense
        fallback={<div className="text-slate-400 text-sm">読み込み中...</div>}
      >
        <AuthContent />
      </Suspense>
    </main>
  )
}
