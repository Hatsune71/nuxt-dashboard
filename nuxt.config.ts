import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['shadcn-nuxt', '@sidebase/nuxt-auth'],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  auth: {
    globalAppMiddleware: true,
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    },
    pages: {
      login: '/login' 
    }
  },
})