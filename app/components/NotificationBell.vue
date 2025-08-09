<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue';
import { BellIcon, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

// Definisikan tipe data notifikasi
interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

const { socket, joinUserRoom } = useSocket();

const notifications = ref<Notification[]>([]);
const unreadCount = computed(() => notifications.value.length);

// Fungsi untuk menangani notifikasi baru
const handleNewNotification = (newNotification: Notification) => {
  notifications.value.unshift(newNotification);
  
  // Tampilkan toast menggunakan vue-sonner
  toast.info(newNotification.message, {
    description: `Diterima pada: ${formatDate(newNotification.createdAt)}`,
    duration: 5000,
  });
};

// Fungsi untuk menghapus notifikasi
const deleteNotification = async (notificationId: string) => {
  const originalNotifications = [...notifications.value];
  
  // Hapus dari UI terlebih dahulu (Optimistic UI)
  notifications.value = notifications.value.filter(n => n.id !== notificationId);

  try {
    await $fetch(`/api/proxy/notifications/${notificationId}`, {
      method: 'DELETE',
    });
    toast.success('Notifikasi berhasil dihapus.');
  } catch (error) {
    console.error(`Gagal menghapus notifikasi ${notificationId}:`, error);
    // Kembalikan state jika API gagal
    notifications.value = originalNotifications;
    toast.error('Gagal menghapus notifikasi.');
  }
};

const deleteAllNotifications = async () => {
  try {
    await $fetch('/api/proxy/notifications', { method: 'DELETE' });
    notifications.value = [];
    toast.success('Semua notifikasi terbaca.');
  } catch (error) {
    console.error('Gagal menghapus semua notifikasi:', error);
    toast.error('Gagal menghapus semua notifikasi.');
  }
};

onMounted(async () => {
  if (!process.client || !socket) return;

  joinUserRoom();

  try {
    const history = await $fetch<Notification[]>(`/api/proxy/notifications`);
    notifications.value = history;
  } catch (error) {
    console.error("Gagal mengambil riwayat notifikasi:", error);
  }

  socket.on('new_notification', handleNewNotification);
});

onUnmounted(() => {
  if (socket) {
    socket.off('new_notification', handleNewNotification);
  }
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="icon" class="relative rounded-full">
        <BellIcon class="h-5 w-5" />
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {{ unreadCount }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0 mr-2">
      <div class="p-4">
        <h4 class="font-medium leading-none">Notifikasi</h4>
        <p class="text-sm text-muted-foreground">
          Anda memiliki {{ unreadCount }} notifikasi belum dibaca.
        </p>
      </div>
      <Separator />
      <div v-if="notifications.length > 0" class="max-h-96 overflow-y-auto">
        <div v-for="notif in notifications" :key="notif.id" class="group flex items-center p-3 hover:bg-accent">
          <div class="flex-grow">
            <p class="text-sm font-medium">{{ notif.message }}</p>
            <p class="text-xs text-muted-foreground">{{ formatDate(notif.createdAt) }}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            class="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="deleteNotification(notif.id)"
          >
            <Trash2 class="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <div v-else class="p-4 text-center text-sm text-muted-foreground">
        Belum ada notifikasi.
      </div>
       <Separator />
       <div class="p-2 text-center">
         <Button @click="deleteAllNotifications" variant="ghost" size="sm" class="w-full">Tandai semua sudah dibaca</Button>
       </div>
    </PopoverContent>
  </Popover>
</template>