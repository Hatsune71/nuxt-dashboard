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
</script>

<template>
    <Toaster rich-colors position="bottom-right" />
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <slot /> 
      </SidebarInset>
  </SidebarProvider>
</template>