import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Trash2, ShieldAlert } from 'lucide-react'

import { PurgeConfirmDialog } from '@/components/trash/PurgeConfirmDialog'
import { TrashTable } from '@/components/trash/TrashTable'
import { Button } from '@/components/ui/button'
import {
  useTrashSummaryQuery,
  useTrashItemsQuery,
  useRestoreTrashMutation,
  usePurgeTrashMutation,
  useEmptyTrashMutation,
} from '@/hooks/queries/useTrash'

import type { TrashResourceType } from '@/lib/types/trash'

export const Route = createFileRoute('/_authenticated/trash')({
  component: TrashPage,
})
const TABS: {
  id: TrashResourceType
  label: string
}[] = [
  { id: 'tasks', label: 'タスク' },
  { id: 'notes', label: 'ノート' },
  { id: 'note_categories', label: 'カテゴリ' },
  { id: 'vehicles', label: '車両' },
  { id: 'fuel_records', label: '燃費記録' },
]
function TrashPage() {
  const [selectedTab, setSelectedTab] = useState<TrashResourceType>('tasks')
  const { data: summary, isLoading: isLoadingSummary } = useTrashSummaryQuery()
  const { data: items = [], isLoading: isLoadingItems } =
    useTrashItemsQuery(selectedTab)
  const restoreMutation = useRestoreTrashMutation()
  const purgeMutation = usePurgeTrashMutation()
  const emptyMutation = useEmptyTrashMutation()
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [purgingId, setPurgingId] = useState<string | null>(null)
  // 完全削除ダイアログの状態
  const [purgeTarget, setPurgeTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false)
  const handleRestore = async (id: string, _name?: string) => {
    setRestoringId(id)
    try {
      await restoreMutation.mutateAsync({ resourceType: selectedTab, id })
    } finally {
      setRestoringId(null)
    }
  }
  const handleOpenPurgeDialog = (id: string, name: string) => {
    setIsEmptyingTrash(false)
    setPurgeTarget({ id, name })
  }
  const handleOpenEmptyDialog = () => {
    setIsEmptyingTrash(true)
    const currentTabLabel =
      TABS.find((t) => t.id === selectedTab)?.label ?? '項目'
    setPurgeTarget({
      id: 'all',
      name: `「${currentTabLabel}」のすべての削除済みデータ`,
    })
  }
  const handleConfirmPurge = async () => {
    if (!purgeTarget) return
    if (isEmptyingTrash) {
      await emptyMutation.mutateAsync(selectedTab)
    } else {
      setPurgingId(purgeTarget.id)
      try {
        await purgeMutation.mutateAsync({
          resourceType: selectedTab,
          id: purgeTarget.id,
        })
      } finally {
        setPurgingId(null)
      }
    }
    setPurgeTarget(null)
  }
  const currentTabCount = summary ? summary[selectedTab] : 0
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* ページタイトル & 注意喚起 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-slate-700" />
            ゴミ箱
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            削除されたデータの一覧です。復元するか、完全に削除できます。
          </p>
        </div>

        {/* ゴミ箱を空にするボタン */}
        {currentTabCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEmptyDialog}
            disabled={emptyMutation.isPending}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            このタブのゴミ箱を空にする
          </Button>
        )}
      </div>

      {/* 注意バナー */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          完全削除を実行すると、データはデータベースから物理的に削除され、二度と復元できなくなります。慎重に操作してください。
        </p>
      </div>

      {/* リソース種別タブ */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px">
          {TABS.map((tab) => {
            const count = summary ? summary[tab.id] : 0
            const isActive = selectedTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2.5 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
                {!isLoadingSummary && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      count > 0
                        ? isActive
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                        : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* 一覧テーブル */}
      <TrashTable
        resourceType={selectedTab}
        items={items}
        onRestore={handleRestore}
        onPurge={handleOpenPurgeDialog}
        isLoading={isLoadingItems}
        restoringId={restoringId}
        purgingId={purgingId}
      />

      {/* 完全削除・空にする確認ダイアログ */}
      <PurgeConfirmDialog
        open={Boolean(purgeTarget)}
        onOpenChange={(open) => {
          if (!open) setPurgeTarget(null)
        }}
        itemName={purgeTarget?.name}
        isBatch={isEmptyingTrash}
        onConfirm={handleConfirmPurge}
        isLoading={purgeMutation.isPending || emptyMutation.isPending}
      />
    </div>
  )
}
