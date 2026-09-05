import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types/user'
import { fetchCurrentUser, logoutUser } from '@/lib/api/users'

export function useUser() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetchUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await fetchCurrentUser()
      setUser(userData)
      return userData
    } catch {
      setError('Failed to fetch user')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const userData = await fetchCurrentUser()
        if (!ignore) {
          setUser(userData)
        }
      } catch {
        if (!ignore) {
          setError('Failed to fetch user')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [router])

  return { user, isLoading, error, logout, refetchUser }
}
