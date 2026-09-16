import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/queries/useAuth'
import { useUsers } from '@/hooks/queries/useUsers'
import { UserList } from '@/components/UserList'
import { UserDialog } from '@/components/UserDialog'
import { UserDeleteDialog } from '@/components/UserDeleteDialog'
import { User, UserCreate, UserUpdate } from '@/lib/types/user'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  const navigate = useNavigate()
  const { user: currentUser, isLoading: isAuthLoading } = useAuth()
  const {
    users,
    isLoading: isUsersLoading,
    includeDeleted,
    setIncludeDeleted,
    search,
    setSearch,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    addUser,
    updateUser,
    deleteUser,
    restoreUser,
  } = useUsers()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (isAuthLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
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
      </main>
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
    if (editingUser) {
      return await updateUser(editingUser.id, data as UserUpdate)
    } else {
      return await addUser(data as UserCreate)
    }
  }

  const handleConfirmDelete = async (userId: string) => {
    return await deleteUser(userId)
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <UserList
          users={users}
          currentUserId={currentUser?.id}
          includeDeleted={includeDeleted}
          onToggleIncludeDeleted={setIncludeDeleted}
          search={search}
          onSearchChange={setSearch}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={restoreUser}
          isLoading={isUsersLoading}
        />
      </main>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingUser}
        onSubmit={handleSubmitDialog}
        isLoading={isUsersLoading}
      />

      <UserDeleteDialog
        user={deletingUser}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isUsersLoading}
      />
    </>
  )
}
