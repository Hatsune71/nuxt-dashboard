<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Eye, EyeOff } from 'lucide-vue-next' // ikon untuk toggle password
import { useAuth } from '#imports'

const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  isLoading.value = true
  const result = await signIn('credentials', {
    email: email.value,
    password: password.value,
    redirect: false,
  })

  if (result?.error) {
    toast.error('Login Failed', {
      description: 'Please check your email and password.',
    })
  } else {
    toast.success('Login successful!')
    return navigateTo('/dashboard')
  }

  isLoading.value = false
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleLogin">
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
          <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <Button type="submit" class="w-full flex justify-center items-center gap-2" :disabled="isLoading">
      <svg
        v-if="isLoading"
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
      <span>{{ isLoading ? 'Logging in...' : 'Login' }}</span>
    </Button>
  </form>
</template>
