<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2, CheckCircle2, XCircle } from 'lucide-vue-next'
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
import { Badge } from '@/components/ui/badge'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

const selectedWeddingId = ref<string | null>(null)
const rsvps = ref<RSVP[]>([])
const isLoading = ref(false)

const { data: weddings } = useFetch('/api/proxy/weddings')

async function fetchRsvps() {
  if (!selectedWeddingId.value) {
    rsvps.value = []
    return
  }
  isLoading.value = true
  try {
    const response = await $fetch<{ data: RSVP[] }>(`/api/proxy/weddings/${selectedWeddingId.value}/rsvps`)
    rsvps.value = response.data
  } catch (error) {
    toast.error('Gagal memuat data RSVP.')
    rsvps.value = []
  } finally {
    isLoading.value = false
  }
}

watch(selectedWeddingId, fetchRsvps, { immediate: true })

async function handleDelete(rsvpId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus data RSVP ini?')) return

  try {
    await $fetch(`/api/proxy/weddings/${selectedWeddingId.value}/rsvps/${rsvpId}`, { method: 'DELETE' })
    toast.success('RSVP berhasil dihapus.')
    fetchRsvps()
  } catch (error: any) {
    toast.error('Gagal menghapus RSVP', { description: error.data?.statusMessage })
  }
}
</script>

<template>
  <Head>
    <title>RSVPs</title>
  </Head>
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
                <BreadcrumbPage>RSVP</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">RSVP</h1>
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

    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Tamu</TableHead>
            <TableHead>Status Kehadiran</TableHead>
            <TableHead>Jumlah Hadir</TableHead>
            <TableHead>Tanggal Konfirmasi</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isLoading">
            <TableRow>
              <TableCell colspan="5" class="text-center h-24">Memuat data RSVP...</TableCell>
            </TableRow>
          </template>
          <template v-else-if="rsvps.length > 0">
            <TableRow v-for="rsvp in rsvps" :key="rsvp.id">
              <TableCell class="font-medium">{{ rsvp.rsvp_name }}</TableCell>
              <TableCell>
                <Badge :variant="rsvp.isAttending ? 'default' : 'destructive'" class="flex items-center w-fit gap-1">
                  <component :is="rsvp.isAttending ? CheckCircle2 : XCircle" class="h-3.5 w-3.5" />
                  <span>{{ rsvp.isAttending ? 'Hadir' : 'Tidak Hadir' }}</span>
                </Badge>
              </TableCell>
              <TableCell>{{ rsvp.isAttending ? rsvp.attendance : '-' }}</TableCell>
              <TableCell>{{ new Date(rsvp.createdAt).toLocaleString('id-ID') }}</TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="icon" @click="handleDelete(rsvp.id)">
                  <Trash2 class="h-4 w-4 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
             <TableRow>
              <TableCell colspan="5" class="text-center h-24">
                {{ selectedWeddingId ? 'Belum ada data RSVP.' : 'Silakan pilih wedding.' }}
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
