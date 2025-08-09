<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useAuth, navigateTo } from '#imports'

const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const isLoadingCredentials = ref(false)
const isLoadingGoogle = ref(false)
const showPassword = ref(false)

// Fungsi untuk login dengan Email/Password
async function handleCredentialsLogin() {
  isLoadingCredentials.value = true
  try {
    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false,
    })

    // Logika ini sudah benar, kita hanya memastikannya ada di dalam 'try'
    if (result?.error) {
      // Error yang diharapkan (misal: kredensial salah)
      toast.error('Login Failed', {
        description: 'Please check your email and password.',
      })
    } else {
      // Berhasil
      toast.success('Login successful!')
      return navigateTo('/dashboard')
    }
  } catch (error) {
    // Menangkap error tak terduga (misal: masalah jaringan, server down)
    console.error('An unexpected error occurred during credentials login:', error)
    toast.error('An Unexpected Error Occurred', {
      description: 'Could not connect to the server. Please try again later.',
    })
  } finally {
    // Ini akan selalu berjalan, baik berhasil maupun gagal
    isLoadingCredentials.value = false
  }
}

// Fungsi untuk login dengan Google
async function handleGoogleLogin() {
  isLoadingGoogle.value = true
  try {
    const result = await signIn('google', { redirect: false })

    if (result?.error) {
      // Error yang diharapkan (misal: popup diblokir, akun tidak diizinkan)
      toast.error('Google Login Failed', {
        description: 'Please try again.',
      })
    } else {
      // Berhasil
      toast.success('Google Login successful!')
      return navigateTo('/dashboard')
    }
  } catch (error) {
    // Menangkap error tak terduga
    console.error('An unexpected error occurred during Google login:', error)
    toast.error('An Unexpected Error Occurred', {
      description: 'Could not complete the Google sign-in. Please try again.',
    })
  } finally {
    // Ini akan selalu berjalan
    isLoadingGoogle.value = false
  }
}
</script>

<template>
<Button @click="handleGoogleLogin" variant="outline" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
  <form class="space-y-4" @submit.prevent="handleCredentialsLogin">



    <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t"></span>
        </div>
        <div class="relative flex justify-center text-xs">
            <span class="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
    </div>

    <div>
      <Label for="email" class="mb-4">Email</Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="team@gezstudio.com"
        required
      />
    </div>

    <div>
      <Label for="password" class="mb-4">Password</Label>
      <div class="relative">
        <Input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="pr-10"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 px-2 flex items-center text-gray-500"
        >
          <component :is="showPassword ? Eye : EyeOff" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <Button type="submit" class="w-full flex justify-center items-center gap-2" :disabled="isLoadingCredentials">
      <svg
        v-if="isLoadingCredentials"
        class="w-4 h-4 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span>{{ isLoadingCredentials ? 'Logging in...' : 'Login' }}</span>
    </Button>
  </form>
</template>