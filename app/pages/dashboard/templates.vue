<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Edit } from 'lucide-vue-next'
import TemplateForm from '@/components/dashboard/templates/Form.vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

// Dapatkan data sesi untuk memeriksa role pengguna
const { data: session } = useAuth()
const isAdmin = computed(() => session.value?.user?.role === 'ADMIN')

// State untuk dialog dan data yang sedang diedit
const isDialogOpen = ref(false)
const currentTemplate = ref<Template | null>(null)

// Mengambil data template
const { data: templates, pending, refresh } = await useFetch('/api/proxy/templates')

// Fungsi untuk membuka dialog dalam mode "Create"
function openCreateDialog() {
  currentTemplate.value = null
  isDialogOpen.value = true
}

// Fungsi untuk membuka dialog dalam mode "Edit"
function openEditDialog(template: Template) {
  currentTemplate.value = template
  isDialogOpen.value = true
}

// Fungsi untuk menangani penghapusan data
async function handleDelete(templateId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus template ini? Ini tidak dapat diurungkan.')) return

  try {
    await $fetch(`/api/proxy/templates/${templateId}`, { method: 'DELETE' })
    toast.success('Template deleted successfully.')
    refresh() // Muat ulang data tabel
  } catch (error: any) {
    toast.error(error.data?.statusMessage || 'An error occurred')
  }
}

// Fungsi yang dipanggil setelah form berhasil disubmit
function onFormSuccess() {
  isDialogOpen.value = false
  refresh() // Muat ulang data tabel
}

// Fungsi untuk format harga menjadi Rupiah
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
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
                <BreadcrumbPage>Templates</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Templates</h1>
      <!-- Tampilkan tombol hanya jika user adalah ADMIN -->
      <Button v-if="isAdmin" @click="openCreateDialog">
        Buat Template Baru
      </Button>
    </div>

    <!-- Menampilkan tabel data template -->
    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Template</TableHead>
            <TableHead>Harga</TableHead>
            <!-- Tampilkan kolom Aksi hanya jika user adalah ADMIN -->
            <TableHead v-if="isAdmin" class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="pending">
            <TableRow>
              <TableCell :colspan="isAdmin ? 3 : 2" class="text-center">Loading...</TableCell>
            </TableRow>
          </template>
          <template v-else-if="templates && templates.length > 0">
            <TableRow v-for="template in templates" :key="template.id">
              <TableCell class="font-medium">{{ template.nama_template }}</TableCell>
              <TableCell>{{ formatCurrency(template.harga) }}</TableCell>
              <TableCell v-if="isAdmin" class="text-right">
                <Button variant="ghost" size="icon" @click="openEditDialog(template)"><Edit class="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" @click="handleDelete(template.id)"><Trash2 class="h-4 w-4 text-red-600" /></Button>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
             <TableRow>
              <TableCell :colspan="isAdmin ? 3 : 2" class="text-center">Belum ada data template.</TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Dialog untuk form Create/Update (hanya bisa diakses ADMIN) -->
    <Dialog v-if="isAdmin" v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ currentTemplate ? 'Edit Template' : 'Buat Template Baru' }}</DialogTitle>
          <DialogDescription>
            {{ currentTemplate ? 'Perbarui detail template di bawah ini.' : 'Isi detail untuk membuat template baru.' }}
          </DialogDescription>
        </DialogHeader>
        <TemplateForm 
          :model-value="currentTemplate" 
          @success="onFormSuccess" 
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
