import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const { public: { apiBaseUrl },auth: {} } = useRuntimeConfig();
const headers = {
    'x-api-key': process.env.API_KEY,
  };

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,

  pages: {
    signIn: '/login',
  },

  providers: [
    CredentialsProvider.default({
      name: 'Credentials',
      async authorize(credentials: any) {
        try {
          const response = await $fetch(`${apiBaseUrl}/auth/login`, {
            method: 'POST',
            headers,
            body: {
              email: credentials.email,
              password: credentials.password,
            },
          });
          if (response && response.token) {
            return response; 
          }
          return null;

        } catch (error: any) {
          console.error('Login error:', error.data?.message || error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user.user;
        token.jwt = user.token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user as any;
        session.jwt = token.jwt as string;
      }
      return session;
    },
  },
});