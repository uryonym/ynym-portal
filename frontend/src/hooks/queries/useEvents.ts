import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createEvent as createEventAPI,
  deleteEvent as deleteEventAPI,
  fetchEvent,
  fetchEvents,
  updateEvent as updateEventAPI,
} from '@/lib/api/events'

import type {
  CreateEventInput,
  GetEventsParams,
  UpdateEventInput,
} from '@/lib/types/event'

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: GetEventsParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
}

export const eventQueries = {
  list: (params: GetEventsParams) =>
    queryOptions({
      queryKey: eventKeys.list(params),
      queryFn: async () => {
        const response = await fetchEvents(params)
        return response.data
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: eventKeys.detail(id),
      queryFn: async () => {
        const response = await fetchEvent(id)
        return response.data
      },
      enabled: Boolean(id),
    }),
}

export function useEventsQuery(params: GetEventsParams) {
  return useQuery(eventQueries.list(params))
}

export function useEventQuery(id: string) {
  return useQuery(eventQueries.detail(id))
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEventInput) => createEventAPI(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      toast.success('予定を作成しました')
    },
    onError: (error: Error) => {
      toast.error(error.message || '予定の作成に失敗しました')
    },
  })
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) =>
      updateEventAPI(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.id),
      })
      toast.success('予定を更新しました')
    },
    onError: (error: Error) => {
      toast.error(error.message || '予定の更新に失敗しました')
    },
  })
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEventAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('予定をゴミ箱に移動しました')
    },
    onError: (error: Error) => {
      toast.error(error.message || '予定の削除に失敗しました')
    },
  })
}
