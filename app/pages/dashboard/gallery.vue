<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2, Eye } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import GalleryForm from '@/components/dashboard/gallery/Form.vue'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

const selectedWeddingId = ref<string | null>(null)
const galleryItems = ref<Gallery[]>([])
const isLoading = ref(false)
const isViewDialogOpen = ref(false)
const viewingItem = ref<Gallery | null>(null)

const { data: weddings } = useFetch('/api/proxy/weddings')

async function fetchGallery() {
  if (!selectedWeddingId.value) {
    galleryItems.value = []
    return
  }
  isLoading.value = true
  try {
    galleryItems.value = await $fetch<Gallery[]>(`/api/proxy/galleries?weddingId=${selectedWeddingId.value}`)
  } catch (error) {
    toast.error('Gagal memuat galeri.')
    galleryItems.value = []
  } finally {
    isLoading.value = false
  }
}

watch(selectedWeddingId, fetchGallery, { immediate: true })

function openViewDialog(item: Gallery) {
  viewingItem.value = item
  isViewDialogOpen.value = true
}

async function handleDelete(itemId: string) {
  if (!confirm('Hapus item ini dari galeri?')) return
  try {
    await $fetch(`/api/proxy/galleries/${itemId}`, { method: 'DELETE' })
    toast.success('Item berhasil dihapus.')
    fetchGallery()
  } catch (error: any) {
    toast.error('Gagal menghapus', { description: error.data?.statusMessage })
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
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Gallery</h1>
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
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <Card v-if="selectedWeddingId">
          <CardHeader><CardTitle>Upload Item Baru</CardTitle></CardHeader>
          <CardContent>
            <GalleryForm :wedding-id="selectedWeddingId" @success="fetchGallery" />
          </CardContent>
        </Card>
        <div v-else class="text-center text-muted-foreground p-8 border rounded-lg">
          Pilih wedding terlebih dahulu untuk mengelola galeri.
        </div>
      </div>

      <div class="md:col-span-2">
        <div v-if="isLoading" class="text-center">Memuat...</div>
        <div v-else-if="galleryItems.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in galleryItems" :key="item.id" class="relative group aspect-square cursor-pointer" @click="openViewDialog(item)">
            <img v-if="item.tipe === 'foto'" :src="item.url" class="w-full h-full object-cover rounded-lg" />
            <video v-if="item.tipe === 'video'" :src="item.url" class="w-full h-full object-cover rounded-lg bg-black" />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg p-2 gap-2">
              <Button variant="outline" size="icon" class="h-9 w-9" @click.stop="openViewDialog(item)">
                <Eye class="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" class="h-9 w-9" @click.stop="handleDelete(item.id)">
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div v-else-if="selectedWeddingId" class="text-center text-muted-foreground p-8 border rounded-lg">
          Galeri masih kosong.
        </div>
      </div>
    </div>

    <!-- Dialog untuk melihat pratinjau -->
    <Dialog v-model:open="isViewDialogOpen">
      <DialogContent class="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Pratinjau Galeri</DialogTitle>
          <DialogDescription>{{ viewingItem?.deskripsi || 'Tidak ada deskripsi' }}</DialogDescription>
        </DialogHeader>
        <div v-if="viewingItem" class="mt-4">
          <img v-if="viewingItem.tipe === 'foto'" :src="viewingItem.url" class="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
          <video v-if="viewingItem.tipe === 'video'" :src="viewingItem.url" controls autoplay class="w-full h-auto max-h-[80vh] rounded-lg bg-black" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>