<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const { signIn } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleRegister() {
  isLoading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value },
    })

    const res = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false,
    })
    
    if (res?.error) {
       toast.error('Login after registration failed', { description: res.error })
    } else {
       toast.success('Registration successful!')
       await navigateTo('/dashboard')
    }

  } catch (error: any) {
    toast.error('Registration Failed', {
      description: error.data?.statusMessage || 'An unexpected error occurred.',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleRegister">
    <div>
      <Label for="name" class="mb-4">Name</Label>
      <Input id="name" v-model="name" type="text" placeholder="Your Name" required />
    </div>
    <div>
      <Label for="email" class="mb-4">Email</Label>
      <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
    </div>
    <div>
      <Label for="password" class="mb-4">Password</Label>
      <Input id="password" v-model="password" type="password" required />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Registering...' : 'Create an account' }}
    </Button>
  </form>
  </template>