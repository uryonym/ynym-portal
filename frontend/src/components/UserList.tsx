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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            ユーザー管理
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            事前登録された Google アカウントの管理や利用停止（退会）を行います
          </p>
        </div>
        <Button
          onClick={onAddNew}
          className="h-10 px-4 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>ユーザーを事前登録</span>
        </Button>
      </div>

      {/* 検索 & フィルターバー */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="名前、メール、UID で検索..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm rounded-xl"
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
            className="text-xs font-medium text-slate-600 cursor-pointer select-none"
          >
            論理削除済み（退会済み）を含める
          </Label>
        </div>
      </div>

      {/* ユーザー一覧テーブル */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">ユーザー</th>
                <th className="px-5 py-3.5">Google UID</th>
                <th className="px-5 py-3.5">権限</th>
                <th className="px-5 py-3.5">ステータス</th>
                <th className="px-5 py-3.5">登録日時</th>
                <th className="px-5 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-slate-400 text-sm"
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
                      className={`hover:bg-slate-50/60 transition-colors ${isDeleted ? 'bg-slate-50/40 text-slate-400' : ''}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              width={36}
                              height={36}
                              className={`h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0 ${isDeleted ? 'grayscale opacity-60' : ''}`}
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs shrink-0">
                              {user.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p
                                className={`font-medium truncate ${isDeleted ? 'line-through text-slate-500' : 'text-slate-900'}`}
                              >
                                {user.name}
                              </p>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                  自分
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {user.google_uid ? (
                          <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                            {user.google_uid}
                          </code>
                        ) : (
                          <span className="text-xs text-slate-400">未設定</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {user.is_admin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <ShieldCheck className="h-3 w-3" />
                            管理者
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                            一般
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {isDeleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <UserX className="h-3 w-3" />
                            利用停止（退会）
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <UserCheck className="h-3 w-3" />
                            有効
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
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
                            className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900"
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
                              className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1"
                              title="復元"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>復元</span>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(user)}
                              disabled={isSelf}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                              title={
                                isSelf ? '自分自身は削除できません' : '論理削除'
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
