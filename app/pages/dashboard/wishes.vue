<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'


definePageMeta({
  layout: 'dashboard',
  auth: true,
})

// State untuk menyimpan wedding yang dipilih dan daftar ucapannya
const selectedWeddingId = ref<string | null>(null)
const wishes = ref<Wish[]>([])
const isLoading = ref(false)

// Ambil daftar wedding milik user untuk ditampilkan di dropdown
const { data: weddings } = useFetch('/api/proxy/weddings')

// Fungsi untuk mengambil data ucapan ketika wedding dipilih
async function fetchWishes() {
  if (!selectedWeddingId.value) {
    wishes.value = []
    return
  }
  isLoading.value = true
  try {
    const response = await $fetch<{ data: Wish[] }>(`/api/proxy/weddings/${selectedWeddingId.value}/wishes`)
    wishes.value = response.data
  } catch (error) {
    toast.error('Gagal memuat ucapan.')
    wishes.value = []
  } finally {
    isLoading.value = false
  }
}

// Gunakan 'watch' untuk memanggil fetchWishes setiap kali selectedWeddingId berubah
watch(selectedWeddingId, fetchWishes, { immediate: true })

// Fungsi untuk menghapus ucapan
async function handleDelete(wishId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) return

  try {
    await $fetch(`/api/proxy/weddings/${selectedWeddingId.value}/wishes/${wishId}`, { method: 'DELETE' })
    toast.success('Ucapan berhasil dihapus.')
    fetchWishes()
  } catch (error: any) {
    toast.error('Gagal menghapus ucapan', { description: error.data?.statusMessage })
  }
}
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Wishes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Wishes</h1>
      <!-- Dropdown untuk memilih wedding -->
      <Select v-if="weddings" v-model="selectedWeddingId">
        <SelectTrigger class="w-[280px]">
          <SelectValue placeholder="Pilih Wedding untuk dilihat..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="wedding in weddings" :key="wedding.id" :value="wedding.id">
            {{ wedding.pengantin_pria }} & {{ wedding.pengantin_wanita }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Menampilkan tabel data ucapan -->
    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pengirim</TableHead>
            <TableHead>Ucapan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isLoading">
            <TableRow>
              <TableCell colspan="4" class="text-center h-24">Memuat ucapan...</TableCell>
            </TableRow>
          </template>
          <template v-else-if="wishes.length > 0">
            <TableRow v-for="wish in wishes" :key="wish.id">
              <TableCell class="font-medium">{{ wish.wishes_name }}</TableCell>
              <TableCell class="text-muted-foreground">{{ wish.wishes_message }}</TableCell>
              <TableCell>{{ new Date(wish.createdAt).toLocaleString('id-ID') }}</TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="icon" @click="handleDelete(wish.id)">
                  <Trash2 class="h-4 w-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
             <TableRow>
              <TableCell colspan="4" class="text-center h-24">
                {{ selectedWeddingId ? 'Belum ada ucapan untuk wedding ini.' : 'Silakan pilih wedding terlebih dahulu.' }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
