<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Bell } from 'lucide-vue-next'

const notifications = ref([
  { id: 1, message: 'Ucapan baru dari Budi' },
  { id: 2, message: 'Tamu mengisi RSVP' },
  { id: 3, message: 'Foto baru diunggah' }
])

// hitung jumlah notifikasi
const unreadCount = computed(() => notifications.value.length)
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon" class="relative">
        <Bell class="w-8 h-8" />
        <!-- Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ unreadCount }}
        </span>
      </Button>
    </PopoverTrigger>

    <!-- Modal (Popover Content) -->
    <PopoverContent class="w-64 p-2">
      <h3 class="font-semibold text-sm mb-2">Notifikasi</h3>
      <div class="space-y-1">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="p-2 rounded-md cursor-pointer text-sm"
        >
          {{ notif.message }}
        </div>
      </div>
      <div v-if="notifications.length === 0" class="text-gray-500 text-sm text-center p-2">
        Tidak ada notifikasi
      </div>
    </PopoverContent>
  </Popover>
</template>
