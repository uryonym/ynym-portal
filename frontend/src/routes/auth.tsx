import { createFileRoute, redirect } from '@tanstack/react-router'
import { AlertCircle, Leaf } from 'lucide-react'
import { z } from 'zod'

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { authQueries } from '@/hooks/queries/useAuth'

const authSearchSchema = z.object({
  error: z.string().optional(),
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/auth')({
  validateSearch: (search) => authSearchSchema.parse(search),
  beforeLoad: async ({ context, search }) => {
    // すでにログインしている場合はリダイレクト先またはホームへ
    try {
      const user = await context.queryClient.ensureQueryData(authQueries.user())
      if (user) {
        throw redirect({
          to: search.redirect || '/',
        })
      }
    } catch (e) {
      // 未認証エラー(401等)ならそのままログイン画面を表示
      if (e && typeof e === 'object' && 'isRedirect' in e) {
        throw e
      }
    }
  },
  component: AuthPage,
})

function AuthPage() {
  const currentYear = new Date().getFullYear()
  const { error, redirect: redirectParam } = Route.useSearch()

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background font-sans">
      <div className="w-full max-w-sm space-y-6">
        <div className="bg-card rounded-2xl border border-border shadow-2xs p-8 space-y-6 text-center">
          <div className="space-y-3">
            <div className="mx-auto w-11 h-11 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                ynym portal
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                家族のポータルサイト
              </p>
            </div>
          </div>

          {error === 'unauthorized' && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs text-left flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <p className="leading-relaxed">
                このアカウントではログインできません。登録状況を確認してください。
              </p>
            </div>
          )}

          <div className="pt-1">
            <GoogleAuthButton redirectTo={redirectParam} />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/70">
          © {currentYear} ynym
        </p>
      </div>
    </main>
  )
}
