import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'

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
  { id: 'events', label: '予定' },
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
    <div className="max-w-4xl mx-auto w-full space-y-5">
      {/* ページタイトル */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            ゴミ箱
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            削除した項目はここから復元・完全削除できます
          </p>
        </div>

        {/* ゴミ箱を空にするボタン */}
        {currentTabCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEmptyDialog}
            disabled={emptyMutation.isPending}
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            空にする
          </Button>
        )}
      </div>

      {/* リソース種別タブ */}
      <div className="border-b border-border">
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
                    ? 'border-primary text-foreground font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
                {!isLoadingSummary && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      count > 0
                        ? isActive
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                        : 'bg-muted/50 text-muted-foreground/60'
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
