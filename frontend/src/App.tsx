import { useState } from 'react'
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ynym Portal (Vite SPA)
          </h1>
          <p className="text-sm text-slate-500">
            Step 2-1: Vite + React 19 + Tailwind CSS v4 基盤セットアップ完了
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Vite 6 + React 19 基盤</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Tailwind CSS v4 スタイル適用</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>shadcn/ui コンポーネント統合</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>/api リバースプロキシ設定</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setCount((c) => c + 1)}
            className="flex-1 cursor-pointer"
          >
            カウント: {count}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.open('http://localhost:8000/docs', '_blank')}
          >
            <span>FastAPI Docs</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
