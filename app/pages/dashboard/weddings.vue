<script setup lang="ts">
import { ref } from 'vue'
import WeddingForm from '~/components/dashboard/weddings/Form.vue' // Import komponen form
import { toast } from 'vue-sonner'
import { Trash2, Edit } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

// State untuk dialog dan data yang sedang diedit
const isDialogOpen = ref(false)
const currentWedding = ref<Wedding | null>(null)

// Mengambil data wedding dan template
const { data: weddings, pending, refresh } = await useFetch('/api/proxy/weddings')
// (Asumsi Anda sudah punya API untuk mengambil template)
const { data: templates } = await useFetch('/api/proxy/templates') // Ganti dengan endpoint Anda

// Fungsi untuk membuka dialog dalam mode "Create"
function openCreateDialog() {
  currentWedding.value = null
  isDialogOpen.value = true
}

// Fungsi untuk membuka dialog dalam mode "Edit"
function openEditDialog(wedding: Wedding) {
  currentWedding.value = wedding
  isDialogOpen.value = true
}

// Fungsi untuk menangani penghapusan data
async function handleDelete(weddingId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus data wedding ini?')) return

  try {
    await $fetch(`/api/proxy/weddings/${weddingId}`, { method: 'DELETE' })
    toast.success('Wedding data deleted successfully.')
    refresh()
  } catch (error: any) {
    toast.error(error.data?.statusMessage || 'An error occurred')
  }
}

// Fungsi yang dipanggil setelah form berhasil disubmit
function onFormSuccess() {
  isDialogOpen.value = false
  refresh() // Muat ulang data tabel
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
                <BreadcrumbPage>Weddings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Wedding</h1>
      <Button @click="openCreateDialog">
        Buat Wedding Baru
      </Button>
    </div>

    <!-- Menampilkan tabel data wedding -->
    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pengantin</TableHead>
            <TableHead>Tanggal Akad</TableHead>
            <TableHead>Template</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="pending">
            <TableRow>
              <TableCell colspan="4" class="text-center">Loading...</TableCell>
            </TableRow>
          </template>
          <template v-else-if="weddings && weddings.length > 0">
            <TableRow v-for="wedding in weddings" :key="wedding.id">
              <TableCell class="font-medium">
                {{ wedding.pengantin_pria }} & {{ wedding.pengantin_wanita }}
              </TableCell>
              <TableCell>{{ new Date(wedding.tanggal_akad).toLocaleDateString() }}</TableCell>
              <TableCell>{{ wedding.template.nama_template }}</TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="icon" @click="openEditDialog(wedding)"><Edit class="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"@click="handleDelete(wedding.id)"><Trash2 class="h-4 w-4 text-red-600" /></Button>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
             <TableRow>
              <TableCell colspan="4" class="text-center">Belum ada data wedding.</TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Dialog untuk form Create/Update -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ currentWedding ? 'Edit Wedding' : 'Buat Wedding Baru' }}</DialogTitle>
          <DialogDescription>
            {{ currentWedding ? 'Perbarui detail di bawah ini.' : 'Isi detail di bawah ini untuk membuat wedding baru.' }}
          </DialogDescription>
        </DialogHeader>
        <WeddingForm 
          :model-value="currentWedding" 
          :templates="templates || []"
          @success="onFormSuccess" 
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
