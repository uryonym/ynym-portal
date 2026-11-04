import { useState } from 'react'

import {
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  RotateCcw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { User } from '@/lib/types/user'

interface UserListProps {
  users: User[]
  currentUserId?: string
  includeDeleted: boolean
  onToggleIncludeDeleted: (value: boolean) => void
  search: string
  onSearchChange: (value: string) => void
  onAddNew: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onRestore: (userId: string) => Promise<boolean>
  isLoading?: boolean
}
export function UserList({
  users,
  currentUserId,
  includeDeleted,
  onToggleIncludeDeleted,
  search,
  onSearchChange,
  onAddNew,
  onEdit,
  onDelete,
  onRestore,
  isLoading = false,
}: UserListProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const handleRestore = async (userId: string) => {
    setRestoringId(userId)
    try {
      await onRestore(userId)
    } finally {
      setRestoringId(null)
    }
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          ユーザー管理
        </h1>
        <Button
          onClick={onAddNew}
          className="h-9 px-3.5 gap-1.5 rounded-lg cursor-pointer text-xs sm:text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>ユーザーを登録</span>
        </Button>
      </div>

      {/* 検索 & フィルターバー */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-card p-3.5 rounded-xl border border-border/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="名前、メール、UID で検索..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="include_deleted"
            checked={includeDeleted}
            onCheckedChange={(checked) =>
              onToggleIncludeDeleted(checked === true)
            }
          />
          <Label
            htmlFor="include_deleted"
            className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
          >
            停止中のユーザーも表示
          </Label>
        </div>
      </div>

      {/* ユーザー一覧テーブル */}
      <div className="bg-card rounded-xl border border-border/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border/80 text-xs font-medium text-muted-foreground">
              <tr>
                <th className="px-5 py-3">ユーザー</th>
                <th className="px-5 py-3">Google UID</th>
                <th className="px-5 py-3">権限</th>
                <th className="px-5 py-3">状態</th>
                <th className="px-5 py-3">登録日</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    {isLoading
                      ? '読み込み中...'
                      : '対象のユーザーは見つかりませんでした'}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isDeleted = !!user.deleted_at
                  const isSelf = user.id === currentUserId
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-muted/30 transition-colors ${isDeleted ? 'bg-muted/20 text-muted-foreground' : ''}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              width={36}
                              height={36}
                              className={`h-9 w-9 rounded-full object-cover ring-1 ring-border shrink-0 ${isDeleted ? 'grayscale opacity-60' : ''}`}
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold text-xs shrink-0">
                              {user.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p
                                className={`font-medium truncate ${isDeleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                              >
                                {user.name}
                              </p>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">
                                  自分
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.google_uid ? (
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-foreground/80">
                            {user.google_uid}
                          </code>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            未設定
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {user.is_admin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            <ShieldCheck className="h-3 w-3" />
                            管理者
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            一般
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {isDeleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
                            <UserX className="h-3 w-3" />
                            停止中
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            <UserCheck className="h-3 w-3" />
                            有効
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(user)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="編集"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          {isDeleted ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestore(user.id)}
                              disabled={restoringId === user.id}
                              className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-secondary gap-1"
                              title="再開"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>再開</span>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(user)}
                              disabled={isSelf}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
                              title={
                                isSelf ? '自分自身は停止できません' : '利用停止'
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
