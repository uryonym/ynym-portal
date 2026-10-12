import { apiClient } from './client'

import type {
  MemberColorUpdate,
  MemberResponse,
  MembersResponse,
} from '@/lib/types/member'

export async function fetchMembers(): Promise<MembersResponse> {
  return apiClient.get<MembersResponse>('/api/members')
}

export async function updateMyColor(
  input: MemberColorUpdate,
): Promise<MemberResponse> {
  return apiClient.put<MemberResponse>('/api/members/me/color', input)
}
