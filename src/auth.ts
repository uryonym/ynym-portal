import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ profile }) {
      // user.id にはGoogleのsubが入っている想定
      try {
        if (profile?.sub) {
          const dbUser = await prisma.user.findUnique({
            where: { id: profile.sub },
          })
          if (!dbUser) {
            // ユーザーがDBに存在しなければサインイン拒否
            console.error('User not found in database:', profile.sub)
            return false
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Error during signIn callback:', error)
        return false
      }
    },
    // JWTが作成・更新される際に呼ばれ
    jwt: ({ token, account, profile }) => {
      if (account && profile?.sub) {
        token.sub = profile.sub
      }
      return token
    },
    // セッションにアクセスされる際に呼ばれる
    session: ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
})
