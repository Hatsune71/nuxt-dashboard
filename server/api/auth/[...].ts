import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const { public: { apiBaseUrl } } = useRuntimeConfig();
const headers = {
    'x-api-key': process.env.API_KEY,
};

export default NuxtAuthHandler({
    secret: useRuntimeConfig().auth.secret,

    pages: {
        signIn: '/login',
    },

    providers: [
        GoogleProvider.default({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: { scope: 'openid profile email' }
            }
        }),
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

                    // Pastikan backend mengembalikan data yang Anda harapkan
                    if (response && (response as any).token) {
                        // 'response' akan menjadi objek 'user' di callback jwt
                        return response;
                    }
                    return null;

                } catch (error: any) {
                    console.error('Login error:', error.data?.message || error);
                    // Penting: Throw error agar bisa ditangkap di frontend, atau return null untuk gagal secara diam-diam.
                    // Returning null adalah standar NextAuth untuk kegagalan otorisasi.
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        jwt: async ({ token, user, account }) => {
                if (account?.provider === 'google') {
                    try {
                        const backendResponse = await $fetch(`${apiBaseUrl}/auth/google/callback`, {
                            method: 'POST',
                            headers,
                            body: {
                                googleId: user.id,
                                email: user.email,
                                name: user.name,
                            }
                        });

                        if (backendResponse && (backendResponse as any).token) {
                            token.user = (backendResponse as any).data;
                            token.jwt = (backendResponse as any).token;
                        } else {
                            return null;
                        }

                    } catch (error) {
                        return null;
                    }
                } else if (account?.provider === 'credentials') {
                    token.user = (user as any).user;
                    token.jwt = (user as any).token;
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