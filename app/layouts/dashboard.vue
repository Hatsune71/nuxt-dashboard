<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from 'vue-sonner'
import { useRoute } from 'vue-router'

const route = useRoute()
const WEDDING_ID = "orozexyo0hkwv8tsslndmf3h";
const firstCrumbLabel = computed(() => {
  return route.path.includes('/dashboard')
    ? 'Dashboard'
    : 'Customization'
})

const firstCrumbLink = computed(() => {
  return route.path.includes('/dashboard')
    ? '/dashboard'
    : '/customization'
})

const secondCrumb = computed(() => {
  const segment = route.path.split('/')[2] || ''
  return segment
    ? segment.charAt(0).toUpperCase() + segment.slice(1)
    : 'Home'
})
</script>

<template>
  <Toaster rich-colors position="bottom-right" />
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger/>
          <Separator orientation="vertical" class="h-6 w-[1px] shrink-0 bg-border" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink :href="firstCrumbLink">
                  {{ firstCrumbLabel }}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{{secondCrumb}}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="ml-auto flex items-center gap-4 px-6">
          <NotificationBell :wedding-id='WEDDING_ID' />
          <ThemeToggle />
        </div>
      </header>
      <div class="min-w-0 w-full flex-1 overflow-x-auto p-4 lg:p-6">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
