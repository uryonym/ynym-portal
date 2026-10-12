import type { SuccessResponse } from './api'

export interface EventParticipant {
  id: string
  name: string
  avatar_url?: string | null
  color?: string | null
}

export interface CalendarEvent {
  id: string
  created_by: string
  title: string
  description?: string | null
  location?: string | null
  start_at: string
  end_at: string
  is_all_day: boolean
  is_private: boolean
  participants: EventParticipant[]
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateEventInput {
  title: string
  description?: string | null
  location?: string | null
  start_at: string
  end_at: string
  is_all_day?: boolean
  is_private?: boolean
  participant_ids?: string[]
}

export interface UpdateEventInput {
  title?: string
  description?: string | null
  location?: string | null
  start_at?: string
  end_at?: string
  is_all_day?: boolean
  is_private?: boolean
  participant_ids?: string[]
}

export interface GetEventsParams {
  start: string
  end: string
  member_ids?: string[]
}

export type EventResponse = SuccessResponse<CalendarEvent>
export type EventsResponse = SuccessResponse<CalendarEvent[]>
