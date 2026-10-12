import { apiClient } from './client'

import type {
  CreateEventInput,
  EventResponse,
  EventsResponse,
  GetEventsParams,
  UpdateEventInput,
} from '@/lib/types/event'

export async function fetchEvents(
  params: GetEventsParams,
): Promise<EventsResponse> {
  const query = new URLSearchParams()
  query.set('start', params.start)
  query.set('end', params.end)
  if (params.member_ids && params.member_ids.length > 0) {
    params.member_ids.forEach((id) => query.append('member_ids', id))
  }
  return apiClient.get<EventsResponse>(`/api/events?${query.toString()}`)
}

export async function fetchEvent(id: string): Promise<EventResponse> {
  return apiClient.get<EventResponse>(`/api/events/${id}`)
}

export async function createEvent(
  input: CreateEventInput,
): Promise<EventResponse> {
  return apiClient.post<EventResponse>('/api/events', input)
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput,
): Promise<EventResponse> {
  return apiClient.put<EventResponse>(`/api/events/${id}`, input)
}

export async function deleteEvent(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/events/${id}`)
}
