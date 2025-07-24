<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

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
      <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
    </div>
    <div>
      <Label for="password" class="mb-4">Password</Label>
      <Input id="password" v-model="password" type="password" required />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Login' }}
    </Button>
  </form>
  </template>