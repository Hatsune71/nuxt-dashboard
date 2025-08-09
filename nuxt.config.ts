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
  modules: ['shadcn-nuxt', '@sidebase/nuxt-auth','@nuxtjs/color-mode'],
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
  runtimeConfig: {
    auth: {
      secret: process.env.API_KEY,
    },
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    }
  },
  colorMode: {
    classSuffix: "",
  },
})