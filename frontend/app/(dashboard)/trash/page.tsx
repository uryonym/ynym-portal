'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrashResourceType, TrashSummary } from '@/lib/types/trash'
import {
  fetchTrashSummary,
  fetchTrashItems,
  restoreTrashItem,
  purgeTrashItem,
  emptyTrash,
} from '@/lib/api/trash'
import { ApiError } from '@/lib/api/client'
import { TrashTable } from '@/components/trash/TrashTable'
import { PurgeConfirmDialog } from '@/components/trash/PurgeConfirmDialog'
import { Button } from '@/components/ui/button'
import { Trash2, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { BaseTrashItem } from '@/components/trash/TrashTable'
import { useAuth } from '@/providers/AuthProvider'
import Link from 'next/link'

const TABS: { id: TrashResourceType; label: string }[] = [
  { id: 'tasks', label: 'タスク' },
  { id: 'notes', label: 'ノート' },
  { id: 'note_categories', label: 'カテゴリ' },
  { id: 'vehicles', label: '車両' },
  { id: 'fuel_records', label: '燃費記録' },
]

export default function TrashPage() {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth()
  const [selectedTab, setSelectedTab] = useState<TrashResourceType>('tasks')
  const [summary, setSummary] = useState<TrashSummary | null>(null)
  const [items, setItems] = useState<BaseTrashItem[]>([])
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [isLoadingItems, setIsLoadingItems] = useState(true)

  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [purgingId, setPurgingId] = useState<string | null>(null)

  // 完全削除ダイアログの状態
  const [purgeTarget, setPurgeTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false)
  const [isPurgingAction, setIsPurgingAction] = useState(false)

  // データ再取得用の関数
  const refreshData = useCallback(async (resourceType: TrashResourceType) => {
    try {
      const [sumRes, itemsRes] = await Promise.all([
        fetchTrashSummary(),
        fetchTrashItems<BaseTrashItem>(resourceType),
      ])
      setSummary(sumRes.data)
      setItems(itemsRes.data)
    } catch (err) {
      console.error('Failed to refresh trash data:', err)
      toast.error('データの更新に失敗しました')
    }
  }, [])

  useEffect(() => {
    if (!currentUser?.is_admin) return
    let ignore = false

    async function load() {
      setIsLoadingSummary(true)
      setIsLoadingItems(true)
      try {
        const [sumRes, itemsRes] = await Promise.all([
          fetchTrashSummary(),
          fetchTrashItems<BaseTrashItem>(selectedTab),
        ])
        if (!ignore) {
          setSummary(sumRes.data)
          setItems(itemsRes.data)
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load trash data:', err)
          toast.error('ゴミ箱情報の取得に失敗しました')
          setItems([])
        }
      } finally {
        if (!ignore) {
          setIsLoadingSummary(false)
          setIsLoadingItems(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [selectedTab, currentUser?.is_admin])

  // 復元ハンドラ
  const handleRestore = async (id: string, name: string) => {
    setRestoringId(id)
    try {
      const res = await restoreTrashItem(selectedTab, id)
      toast.success(res.message || `「${name}」を復元しました`)
      await refreshData(selectedTab)
    } catch (err) {
      console.error('Restore failed:', err)
      if (
        err instanceof ApiError &&
        err.data &&
        typeof err.data === 'object' &&
        'message' in err.data
      ) {
        toast.error(String(err.data.message))
      } else {
        toast.error('復元に失敗しました')
      }
    } finally {
      setRestoringId(null)
    }
  }

  // 単体完全削除確認オープン
  const handleOpenPurgeDialog = (id: string, name: string) => {
    setPurgeTarget({ id, name })
  }

  // 単体完全削除実行
  const handleConfirmPurge = async () => {
    if (!purgeTarget) return
    setIsPurgingAction(true)
    setPurgingId(purgeTarget.id)
    try {
      await purgeTrashItem(selectedTab, purgeTarget.id)
      toast.success(`「${purgeTarget.name}」を完全に削除しました`)
      setPurgeTarget(null)
      await refreshData(selectedTab)
    } catch (err) {
      console.error('Purge failed:', err)
      if (
        err instanceof ApiError &&
        err.data &&
        typeof err.data === 'object' &&
        'message' in err.data
      ) {
        toast.error(String(err.data.message))
      } else {
        toast.error('完全削除に失敗しました')
      }
    } finally {
      setIsPurgingAction(false)
      setPurgingId(null)
    }
  }

  // 一括完全削除実行
  const handleConfirmEmptyTrash = async () => {
    setIsPurgingAction(true)
    try {
      const res = await emptyTrash(selectedTab)
      toast.success(res.message || 'ゴミ箱を空にしました')
      setIsEmptyingTrash(false)
      await refreshData(selectedTab)
    } catch (err) {
      console.error('Empty trash failed:', err)
      if (
        err instanceof ApiError &&
        err.data &&
        typeof err.data === 'object' &&
        'message' in err.data
      ) {
        toast.error(String(err.data.message))
      } else {
        toast.error('ゴミ箱を空にする処理に失敗しました')
      }
    } finally {
      setIsPurgingAction(false)
    }
  }

  if (isAuthLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm">認証情報を確認中...</div>
      </main>
    )
  }

  // 管理者権限チェック
  if (!currentUser?.is_admin) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            管理者権限が必要です
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            ゴミ箱機能は管理者権限を持つユーザーのみがアクセスできます。
          </p>
        </div>
        <Button
          render={<Link href="/" />}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          ホームへ戻る
        </Button>
      </main>
    )
  }

  const getTabCount = (
    s: TrashSummary | null,
    type: TrashResourceType,
  ): number => {
    if (!s) return 0
    return s[type] ?? 0
  }

  // 現在のタブの件数
  const currentTabCount = getTabCount(summary, selectedTab)

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Trash2 className="h-6 w-6 text-slate-700" />
            ゴミ箱
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            論理削除されたデータを復元するか、データベースから完全に削除します。
          </p>
        </div>

        {currentTabCount > 0 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setIsEmptyingTrash(true)}
            className="cursor-pointer gap-2 self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            このタブのゴミ箱を空にする
          </Button>
        )}
      </div>

      {/* タブナビゲーション */}
      <div className="mt-6 flex gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const isActive = selectedTab === tab.id
          const count = getTabCount(summary, tab.id)

          return (
            <button
              key={tab.id}

              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                isActive
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {!isLoadingSummary && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    count > 0
                      ? isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 一覧テーブル */}
      <div className="mt-6">
        <TrashTable
          resourceType={selectedTab}
          items={items}
          isLoading={isLoadingItems}
          onRestore={handleRestore}
          onPurge={handleOpenPurgeDialog}
          restoringId={restoringId}
          purgingId={purgingId}
        />
      </div>

      {/* 単体完全削除確認モーダル */}
      <PurgeConfirmDialog
        open={purgeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPurgeTarget(null)
        }}
        itemName={purgeTarget?.name}
        onConfirm={handleConfirmPurge}
        isLoading={isPurgingAction}
      />

      {/* 一括完全削除確認モーダル */}
      <PurgeConfirmDialog
        open={isEmptyingTrash}
        onOpenChange={setIsEmptyingTrash}
        isBatch={true}
        title="ゴミ箱を空にしますか？"
        description={`選択中のリソース（${
          TABS.find((t) => t.id === selectedTab)?.label
        }）にある ${currentTabCount} 件のすべてのアイテムを完全に削除します。この操作は取り消せません。`}
        onConfirm={handleConfirmEmptyTrash}
        isLoading={isPurgingAction}
      />
    </main>
  )
}
