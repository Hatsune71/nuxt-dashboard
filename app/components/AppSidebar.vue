<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import { GalleryVerticalEnd, CircleOff } from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// Dapatkan objek rute saat ini
const route = useRoute()

// Ambil data sesi dan template
const { data: session } = useAuth()
const { data: templates } = useFetch('/api/proxy/templates')

// Siapkan data user dengan fallback
const user = computed(() => {
  return session.value?.user || {
    name: 'Guest',
    email: 'Not logged in',
    avatar: '/avatars/placeholder.jpg',
  }
})

const teams = computed(() => {
  if (!templates.value || templates.value.length === 0) {
    return [
      {
        name: 'No Templates Available',
        logo: 'CircleOff',
        plan: 'N/A',
      },
    ];
  }

  return templates.value.map(template => ({
    name: template.nama_template,
    logo: 'GalleryVerticalEnd',
    plan: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(template.harga),
  }));
});

const baseNavMain = [
    {
      title: 'Dashboard',
      icon: GalleryVerticalEnd, // Ikon statis untuk navigasi bisa tetap di sini
      items: [
       {
          title: 'Home',
          url: '/dashboard',
        },
        {
          title: 'Weddings',
          url: '/dashboard/weddings',
        },
        {
          title: 'Templates',
          url: '/dashboard/templates',
        },
        {
          title: 'Wishes',
          url: '/dashboard/wishes',
        },
        {
          title: 'RSVP',
          url: '/dashboard/rsvps', // Pastikan URL ini benar
        },
        {
          title: 'Gifts',
          url: '/dashboard/gifts',
        },
        {
          title: 'Gallery',
          url: '/dashboard/gallery',
        },
      ],
    },
]

// Logika untuk status `isActive` (sudah benar)
const navMain = computed(() => {
  return baseNavMain.map(parentItem => {
    const isAnyChildActive = parentItem.items?.some(childItem => route.path === childItem.url)
    
    return {
      ...parentItem,
      isActive: route.path === parentItem.url || isAnyChildActive,
      items: parentItem.items?.map(childItem => ({
        ...childItem,
        isActive: route.path === childItem.url,
      })),
    }
  })
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
