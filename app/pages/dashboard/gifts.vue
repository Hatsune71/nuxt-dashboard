<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2, Edit, Banknote, Home } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import GiftForm from '@/components/dashboard/gifts/Form.vue'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

const selectedWeddingId = ref<string | null>(null)
const gifts = ref<Gift[]>([])
const isLoading = ref(false)
const isDialogOpen = ref(false)
const currentGift = ref<Gift | null>(null)

const { data: weddings } = useFetch('/api/proxy/weddings')

async function fetchGifts() {
  if (!selectedWeddingId.value) {
    gifts.value = []
    return
  }
  isLoading.value = true
  try {
    const response = await $fetch<{ data: Gift[] }>(`/api/proxy/weddings/${selectedWeddingId.value}/gifts`)
    gifts.value = response.data
  } catch (error) {
    toast.error('Gagal memuat data hadiah.')
    gifts.value = []
  } finally {
    isLoading.value = false
  }
}

watch(selectedWeddingId, fetchGifts, { immediate: true })

function openCreateDialog() {
  currentGift.value = null
  isDialogOpen.value = true
}

function openEditDialog(gift: Gift) {
  currentGift.value = gift
  isDialogOpen.value = true
}

async function handleDelete(giftId: string) {
  if (!confirm('Hapus informasi hadiah ini?')) return
  try {
    await $fetch(`/api/proxy/weddings/${selectedWeddingId.value}/gifts/${giftId}`, { method: 'DELETE' })
    toast.success('Informasi hadiah dihapus.')
    fetchGifts()
  } catch (error: any) {
    toast.error('Gagal menghapus', { description: error.data?.statusMessage })
  }
}

function onFormSuccess() {
  isDialogOpen.value = false
  fetchGifts()
}
</script>

<template>
  <Head>
      <title>Gifts</title>
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
                <BreadcrumbPage>Gifts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Gifts</h1>
      </div>
      <div class="flex items-center gap-4">
        <Select v-if="weddings" v-model="selectedWeddingId">
          <SelectTrigger class="w-[280px]">
            <SelectValue placeholder="Pilih Wedding..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="wedding in weddings" :key="wedding.id" :value="wedding.id">
              {{ wedding.pengantin_pria }} & {{ wedding.pengantin_wanita }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button @click="openCreateDialog" :disabled="!selectedWeddingId">Tambah Info</Button>
      </div>
    </div>

    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipe</TableHead>
            <TableHead>Detail</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isLoading">
            <TableRow><TableCell colspan="3" class="text-center h-24">Memuat...</TableCell></TableRow>
          </template>
          <template v-else-if="gifts.length > 0">
            <TableRow v-for="gift in gifts" :key="gift.id">
              <TableCell class="font-medium capitalize flex items-center gap-2">
                <component :is="gift.tipe === 'rekening' ? Banknote : Home" class="h-4 w-4 text-muted-foreground" />
                {{ gift.tipe }}
              </TableCell>
              <TableCell>
                <div v-if="gift.tipe === 'rekening'" class="text-sm">
                  <p>{{ gift.nama_bank }} - {{ gift.no_rek }}</p>
                </div>
                <div v-else class="text-sm text-muted-foreground whitespace-pre-wrap">{{ gift.alamat }}</div>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="icon" @click="openEditDialog(gift)"><Edit class="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" @click="handleDelete(gift.id)"><Trash2 class="h-4 w-4 text-red-600" /></Button>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
             <TableRow><TableCell colspan="3" class="text-center h-24">{{ selectedWeddingId ? 'Belum ada info hadiah.' : 'Pilih wedding terlebih dahulu.' }}</TableCell></TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ currentGift ? 'Edit Info Hadiah' : 'Tambah Info Hadiah' }}</DialogTitle>
        </DialogHeader>
        <GiftForm v-if="selectedWeddingId" :wedding-id="selectedWeddingId" :model-value="currentGift" @success="onFormSuccess" />
      </DialogContent>
    </Dialog>
  </div>
</template>