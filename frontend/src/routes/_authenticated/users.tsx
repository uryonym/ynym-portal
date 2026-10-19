import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { UserDeleteDialog } from '@/components/UserDeleteDialog'
import { UserDialog } from '@/components/UserDialog'
import { UserList } from '@/components/UserList'
import { useAuth } from '@/hooks/queries/useAuth'
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from '@/hooks/queries/useUsers'

import type { User, UserCreate, UserUpdate } from '@/lib/types/user'

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  const navigate = useNavigate()
  const { user: currentUser, isLoading: isAuthLoading } = useAuth()

  const [includeDeleted, setIncludeDeleted] = useState(true)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: users = [], isLoading: isUsersLoading } = useUsersQuery(
    {
      include_deleted: includeDeleted,
      search: search || undefined,
    },
    { enabled: !!currentUser?.is_admin },
  )

  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()
  const deleteMutation = useDeleteUserMutation()
  const restoreMutation = useRestoreUserMutation()

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    restoreMutation.isPending

  if (isAuthLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
        <div className="text-slate-400 text-sm">認証情報を確認中...</div>
      </div>
    )
  }

  // 管理者権限チェック
  if (!currentUser?.is_admin) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-md mx-auto w-full flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            管理者権限が必要です
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            このページは管理者権限を持つユーザーのみがアクセスできます。
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/' })}
          className="h-10 rounded-xl"
        >
          ホームに戻る
        </Button>
      </div>
    )
  }

  const handleAddNew = () => {
    setEditingUser(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (userToEdit: User) => {
    setEditingUser(userToEdit)
    setIsDialogOpen(true)
  }

  const handleDelete = (userToDelete: User) => {
    setDeletingUser(userToDelete)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitDialog = async (data: UserCreate | UserUpdate) => {
    try {
      if (editingUser) {
        await updateMutation.mutateAsync({ id: editingUser.id, data })
      } else {
        await createMutation.mutateAsync(data as UserCreate)
      }
      setIsDialogOpen(false)
      return true
    } catch {
      return false
    }
  }

  const handleConfirmDelete = async (userId: string) => {
    try {
      await deleteMutation.mutateAsync(userId)
      setIsDeleteDialogOpen(false)
      setDeletingUser(null)
      return true
    } catch {
      return false
    }
  }

  const handleRestore = async (userId: string) => {
    try {
      await restoreMutation.mutateAsync(userId)
      return true
    } catch {
      return false
    }
  }

  return (
    <>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <UserList
          users={users}
          currentUserId={currentUser.id}
          includeDeleted={includeDeleted}
          onToggleIncludeDeleted={setIncludeDeleted}
          search={search}
          onSearchChange={setSearch}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isLoading={isUsersLoading}
        />
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingUser}
        onSubmit={handleSubmitDialog}
        isLoading={isMutating}
      />

      <UserDeleteDialog
        user={deletingUser}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
      />
    </>
  )
}
