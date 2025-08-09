<script setup lang="ts">
import type { Component } from "vue"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import logo from "@/assets/main/logo.png"

const props = defineProps<{
  teams: {
    name: string
    logo: Component
    plan: string
  }[]
}>()

const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <a href="/dashboard">
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <!-- Logo -->
            <div class="flex aspect-square size-12 items-center justify-center -ml-2 rounded-lg text-sidebar-primary-foreground">
              <img :src="logo" class="size-12" />
            </div>

            <div
              class="grid flex-1 text-left text-md leading-tight 
                     group-data-[collapsible=icon]/sidebar-wrapper:hidden"
            >
              <span class="truncate font-bold">
                Gez Studio
              </span>
              <span class="truncate text-xs font-semibold">Wedding</span>
            </div>
          </SidebarMenuButton>
          </a>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
