'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GoogleAuthButton } from '@/components/GoogleAuthButton'

export default function AuthPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      {/* Centered container */}
      <div className="container relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 bg-white shadow-xl">
          <CardHeader className="text-center space-y-3 pb-8">
            <div className="mx-auto mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Ynym Portalへようこそ
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Googleアカウントでログインしてください
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <div className="flex justify-center">
              <GoogleAuthButton />
            </div>

            <p className="text-center text-xs text-slate-500 leading-relaxed">
              ログインすることで、
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
              >
                利用規約
              </Link>
              および
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
              >
                プライバシーポリシー
              </Link>
              に同意したものとみなされます。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
