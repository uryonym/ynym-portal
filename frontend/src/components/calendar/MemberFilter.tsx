import { Check, CheckSquare, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthUserQuery } from '@/hooks/queries/useAuth'
import { useMembersQuery } from '@/hooks/queries/useMembers'
import { getMemberColor } from '@/lib/calendar'

interface MemberFilterProps {
  selectedMemberIds: string[]
  onToggleMember: (memberId: string) => void
  onClearFilter: () => void
  showTasks: boolean
  onToggleShowTasks: (show: boolean) => void
  onOpenColorDialog: () => void
}

export function MemberFilter({
  selectedMemberIds,
  onToggleMember,
  onClearFilter,
  showTasks,
  onToggleShowTasks,
  onOpenColorDialog,
}: MemberFilterProps) {
  const { data: members = [] } = useMembersQuery()
  const { data: currentUser } = useAuthUserQuery()

  const isAllSelected = selectedMemberIds.length === 0
  const myColor = getMemberColor(currentUser?.id, currentUser?.color)

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-2.5 shadow-xs">
      {/* メンバー絞り込み */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground mr-1">
          絞り込み:
        </span>

        {/* 全員ボタン */}
        <button
          type="button"
          onClick={onClearFilter}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            isAllSelected
              ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
              : 'border-border/80 bg-background text-muted-foreground hover:bg-muted/50'
          }`}
        >
          <span>全員</span>
          {isAllSelected && <Check className="h-3 w-3" />}
        </button>

        {/* 各メンバー */}
        {members.map((member) => {
          const isSelected = selectedMemberIds.includes(member.id)
          const color = getMemberColor(member.id, member.color)
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onToggleMember(member.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                isSelected
                  ? 'border-primary font-semibold shadow-xs'
                  : 'border-border/80 bg-background text-muted-foreground hover:bg-muted/50'
              }`}
              style={
                isSelected
                  ? {
                      backgroundColor: `${color}20`,
                      borderColor: color,
                      color: color,
                    }
                  : undefined
              }
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{member.name}</span>
              {isSelected && <Check className="h-3 w-3 shrink-0 ml-0.5" />}
            </button>
          )
        })}
      </div>

      {/* 右側: タスク表示トグル & マイカラー変更 */}
      <div className="flex items-center gap-3 self-end sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
        {/* タスク表示トグル */}
        <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground">
          <Checkbox
            checked={showTasks}
            onCheckedChange={(checked) => onToggleShowTasks(Boolean(checked))}
            id="calendar_show_tasks"
          />
          <span className="flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>タスクを表示</span>
          </span>
        </label>

        {/* マイカラー変更ボタン */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenColorDialog}
          className="h-7 px-2 text-xs gap-1.5"
          title="マイカラー設定"
        >
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: myColor }}
          />
          <Palette className="h-3 w-3 text-muted-foreground" />
          <span className="hidden sm:inline">マイカラー</span>
        </Button>
      </div>
    </div>
  )
}
