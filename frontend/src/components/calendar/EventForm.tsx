import { useCallback, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format, subDays } from 'date-fns'
import { Check, Lock } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMembersQuery } from '@/hooks/queries/useMembers'
import { getMemberColor } from '@/lib/calendar'
import { eventFormSchema } from '@/lib/validations/event'

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from '@/lib/types/event'
import type { EventFormValues } from '@/lib/validations/event'
import type { Resolver } from 'react-hook-form'

export interface EventFormProps {
  initialDate?: Date
  initialEvent?: CalendarEvent | null
  onSubmit: (data: CreateEventInput | UpdateEventInput) => void
  onCancel: () => void
  isLoading?: boolean
}

export function EventForm({
  initialDate,
  initialEvent,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) {
  const isEditing = Boolean(initialEvent)
  const { data: members = [] } = useMembersQuery()

  const getInitialValues = useCallback((): EventFormValues => {
    if (initialEvent) {
      const isAllDay = initialEvent.is_all_day
      const startDate = new Date(initialEvent.start_at)
      let endDate = new Date(initialEvent.end_at)
      if (isAllDay) {
        endDate = subDays(endDate, 1) // 排他的境界から包含表記に逆変換
      }

      return {
        title: initialEvent.title,
        is_all_day: isAllDay,
        start_date: format(startDate, 'yyyy-MM-dd'),
        start_time: format(startDate, 'HH:mm'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        end_time: format(new Date(initialEvent.end_at), 'HH:mm'),
        is_private: initialEvent.is_private,
        participant_ids: initialEvent.participants.map((p) => p.id),
        location: initialEvent.location ?? '',
        description: initialEvent.description ?? '',
      }
    }

    const defaultDateStr = format(initialDate || new Date(), 'yyyy-MM-dd')
    const defaultNextHour = new Date()
    defaultNextHour.setMinutes(0, 0, 0)
    defaultNextHour.setHours(defaultNextHour.getHours() + 1)
    const defaultEndHour = new Date(defaultNextHour)
    defaultEndHour.setHours(defaultEndHour.getHours() + 1)

    return {
      title: '',
      is_all_day: false,
      start_date: defaultDateStr,
      start_time: format(defaultNextHour, 'HH:mm'),
      end_date: defaultDateStr,
      end_time: format(defaultEndHour, 'HH:mm'),
      is_private: false,
      participant_ids: [],
      location: '',
      description: '',
    }
  }, [initialEvent, initialDate])

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormValues>,
    defaultValues: getInitialValues(),
  })

  const isAllDay = useWatch({ control: form.control, name: 'is_all_day' })
  const isPrivate = useWatch({ control: form.control, name: 'is_private' })
  const selectedParticipantIds = useWatch({
    control: form.control,
    name: 'participant_ids',
  })

  useEffect(() => {
    form.reset(getInitialValues())
  }, [form, getInitialValues])

  const toggleParticipant = (memberId: string) => {
    const current = form.getValues('participant_ids')
    if (current.includes(memberId)) {
      form.setValue(
        'participant_ids',
        current.filter((id) => id !== memberId),
      )
    } else {
      form.setValue('participant_ids', [...current, memberId])
    }
  }

  const handleFormSubmit = (values: EventFormValues) => {
    let startAtIso = ''
    let endAtIso = ''

    if (values.is_all_day) {
      startAtIso = `${values.start_date}T00:00:00+09:00`
      // 翌日 0:00（排他的境界）
      const nextDay = addDays(new Date(values.end_date), 1)
      endAtIso = `${format(nextDay, 'yyyy-MM-dd')}T00:00:00+09:00`
    } else {
      startAtIso = `${values.start_date}T${values.start_time || '00:00'}:00+09:00`
      endAtIso = `${values.end_date}T${values.end_time || '00:00'}:00+09:00`
    }

    const payload: CreateEventInput = {
      title: values.title,
      description: values.description || null,
      location: values.location || null,
      start_at: startAtIso,
      end_at: endAtIso,
      is_all_day: values.is_all_day,
      is_private: values.is_private,
      participant_ids: values.participant_ids,
    }

    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {/* タイトル */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                タイトル <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="予定のタイトルを入力"
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 終日トグル */}
        <FormField
          control={form.control}
          name="is_all_day"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 py-1">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="is_all_day"
                />
              </FormControl>
              <label
                htmlFor="is_all_day"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                終日
              </label>
            </FormItem>
          )}
        />

        {/* 日時選択 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 開始 */}
          <div className="space-y-1.5">
            <FormLabel className="text-xs text-muted-foreground">
              開始
            </FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-0">
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isAllDay && (
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem className="w-28 space-y-0">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* 終了 */}
          <div className="space-y-1.5">
            <FormLabel className="text-xs text-muted-foreground">
              終了
            </FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-0">
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isAllDay && (
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem className="w-28 space-y-0">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* プライベート設定（重要要件） */}
        <FormField
          control={form.control}
          name="is_private"
          render={({ field }) => (
            <FormItem className="rounded-lg border border-border/80 bg-muted/40 p-3">
              <div className="flex items-start gap-2.5">
                <FormControl className="mt-0.5">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="is_private"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor="is_private"
                    className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                    <span>プライベート予定（自分のみ表示）</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    チェックを入れると、この予定はあなただけに表示され、他の家族には完全非表示になります。
                  </p>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* 参加者選択（プライベートでなければ選択可能） */}
        {!isPrivate && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm">参加者</FormLabel>
              <span className="text-xs text-muted-foreground">
                {selectedParticipantIds.length === 0
                  ? '未選択（家族全員）'
                  : `${selectedParticipantIds.length}名選択中`}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {members.map((member) => {
                const isSelected = selectedParticipantIds.includes(member.id)
                const color = getMemberColor(member.id, member.color)
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleParticipant(member.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                      isSelected
                        ? 'border-primary/50 text-foreground font-semibold shadow-xs'
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
                    {isSelected && (
                      <Check className="h-3 w-3 shrink-0 ml-0.5" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 場所 */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>場所</FormLabel>
              <FormControl>
                <Input
                  placeholder="例: 〇〇病院、自宅、オンライン"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* メモ */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メモ・詳細</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="持ち物、注意事項、リンクなど"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* フッターボタン */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? '更新中...'
                : '作成中...'
              : isEditing
                ? '予定を更新'
                : '予定を追加'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
