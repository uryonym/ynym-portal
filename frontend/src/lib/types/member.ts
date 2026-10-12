import type { SuccessResponse } from './api'

export interface Member {
  id: string
  name: string
  avatar_url?: string | null
  color?: string | null
}

export interface MemberColorUpdate {
  color: string | null
}

export type MemberResponse = SuccessResponse<Member>
export type MembersResponse = SuccessResponse<Member[]>
