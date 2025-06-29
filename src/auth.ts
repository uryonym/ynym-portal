import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      profile(profile: any) {
        return {
          ...profile,
          id: profile.sub,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // user.id にはGoogleのsubが入っている想定
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      })
      if (!dbUser) {
        // ユーザーがDBに存在しなければサインイン拒否
        return false
      }
      return true
    },
    authorized: ({ auth }) => {
      return !!auth
    },
    session: ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: ({ token, user }) => {
      if (user?.id) {
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
})
