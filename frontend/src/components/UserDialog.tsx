import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { User, UserCreate, UserUpdate } from '@/lib/types/user'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: User | null
  onSubmit: (data: UserCreate | UserUpdate) => Promise<boolean>
  isLoading?: boolean
}
interface UserFormProps {
  initialData?: User | null
  onSubmit: (data: UserCreate | UserUpdate) => Promise<boolean>
  onClose: () => void
  isLoading: boolean
}
function UserForm({
  initialData,
  onSubmit,
  onClose,
  isLoading,
}: UserFormProps) {
  const [googleUid, setGoogleUid] = useState(initialData?.google_uid ?? '')
  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [isAdmin, setIsAdmin] = useState(initialData?.is_admin ?? false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!googleUid.trim()) {
      newErrors.googleUid = 'Google UID は必須です'
    }
    if (!name.trim()) {
      newErrors.name = '名前は必須です'
    }
    if (!email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = '正しいメールアドレスの形式で入力してください'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const success = await onSubmit({
      google_uid: googleUid.trim(),
      name: name.trim(),
      email: email.trim(),
      is_admin: isAdmin,
    })
    if (success) {
      onClose()
    }
  }
  const isEdit = !!initialData
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label
          htmlFor="google_uid"
          className="text-xs font-semibold text-slate-700"
        >
          Google UID (sub) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="google_uid"
          placeholder="例: 118234857291029384756"
          value={googleUid}
          onChange={(e) => setGoogleUid(e.target.value)}
          disabled={isLoading}
          className="h-10 text-sm rounded-xl"
        />
        {errors.googleUid && (
          <p className="text-xs text-red-500">{errors.googleUid}</p>
        )}
        <p className="text-[11px] text-slate-400">
          Googleアカウントの固有ID（OpenID Connectのsub値）を入力してください。
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
          名前 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="例: 山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="h-10 text-sm rounded-xl"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
          メールアドレス <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="例: user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="h-10 text-sm rounded-xl"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="is_admin"
          checked={isAdmin}
          onCheckedChange={(checked) => setIsAdmin(checked === true)}
          disabled={isLoading}
        />
        <Label
          htmlFor="is_admin"
          className="text-sm font-medium text-slate-700 cursor-pointer select-none"
        >
          管理者権限を付与する
        </Label>
      </div>

      <DialogFooter className="pt-4 flex gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="h-10 rounded-xl"
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isLoading ? '保存中...' : isEdit ? '更新する' : '事前登録する'}
        </Button>
      </DialogFooter>
    </form>
  )
}
export function UserDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
}: UserDialogProps) {
  const isEdit = !!initialData
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'ユーザー情報を編集' : 'ユーザーを事前登録'}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <UserForm
            key={initialData?.id ?? 'new'}
            initialData={initialData}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
