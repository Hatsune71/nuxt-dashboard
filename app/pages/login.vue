<script setup lang="ts">
definePageMeta({
  layout: 'default',
  auth: {
    unauthenticatedOnly: true,
    redirectTo: '/dashboard',
  },
})
import logo from '@/assets/main/logo.png'
</script>

<template>
  <Head>
    <title>Login - Gez Studio</title>
  </Head>
  <div class="flex flex-col items-center justify-center gap-6 bg-muted p-6 min-h-svh md:p-10">
    <div class="max-w-sm w-full flex flex-col gap-6">
      <NuxtLink to="/" class="flex items-center self-center gap-2 font-medium">
        <div class="h-8 w-8 flex items-center justify-center rounded-md text-primary-foreground">
          <img :src="logo" alt="Logo" class="w-full h-full object-contain" />
        </div>
        Gez Studio
      </NuxtLink>
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">
              Welcome back
            </CardTitle>
            <CardDescription>
              Login with Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthLoginForm />
          </CardContent>
        </Card>
         <div class="text-center text-sm text-muted-foreground">
          Don't have an account?
          <NuxtLink to="/register" class="underline underline-offset-4 hover:text-primary">
            Register
          </NuxtLink>
        </div>
    </div>
  </div>
</template>