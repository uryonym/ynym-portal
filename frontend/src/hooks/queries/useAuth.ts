import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { fetchCurrentAuthUser, logoutUser } from '@/lib/api/auth'
import type { User } from '@/lib/types/user'

export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
}

export const authQueries = {
  user: () =>
    queryOptions<User | null>({
      queryKey: authQueryKeys.user(),
      queryFn: fetchCurrentAuthUser,
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
}

export function useAuthUserQuery() {
  return useQuery(authQueries.user())
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.user(), null)
      navigate({ to: '/auth' })
    },
  })
}
