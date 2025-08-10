// server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export default NuxtAuthHandler(() => {
  const config = useRuntimeConfig()
  const headers = {
    'x-api-key': process.env.API_KEY || '',
  }

  return {
    secret: config.auth.secret,

    origin: process.env.AUTH_ORIGIN,

    cookies: {
      sessionToken: {
        name: '__Secure-next-auth.session-token',
        options: {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          path: '/',
        },
      },
    },

    pages: {
      signIn: '/login',
    },

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        authorization: {
          params: { scope: 'openid profile email' }
        }
      }),

      CredentialsProvider({
        name: 'Credentials',
        async authorize(credentials: any) {
          try {
            const response = await $fetch(`${config.public.apiBaseUrl}/auth/login`, {
              method: 'POST',
              headers,
              body: {
                email: credentials.email,
                password: credentials.password,
              },
              credentials: 'include'
            })

            if (response && (response as any).token) {
              return response
            }
            return null
          } catch (error: any) {
            console.error('Login error:', error.data?.message || error)
            return null
          }
        },
      }),
    ],

    callbacks: {
      async jwt({ token, user, account }) {
        if (account?.provider === 'google' && user) {
          try {
            const backendResponse = await $fetch(`${config.public.apiBaseUrl}/auth/google/callback`, {
              method: 'POST',
              headers,
              body: {
                googleId: (user as any).id || token.sub,
                email: (user as any).email,
                name: (user as any).name,
              },
              credentials: 'include'
            })

            if (backendResponse && (backendResponse as any).token) {
              token.user = (backendResponse as any).data
              token.jwt = (backendResponse as any).token
              token.id = (backendResponse as any).data.id
            }
          } catch (error) {
            console.error('Google auth error:', error)
          }
        } else if (account?.provider === 'credentials' && user) {
          token.user = (user as any).user
          token.jwt = (user as any).token
          token.id = (user as any).id
        }
        return token
      },

      async session({ session, token }) {
        if (token) {
          session.user = token.user as any
          ;(session as any).user.id = token.id as string
          session.jwt = token.jwt as string
        }
        return session
      },
    },
  }
})
