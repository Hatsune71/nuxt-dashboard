<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Edit } from 'lucide-vue-next'
import TemplateForm from '@/components/dashboard/templates/Form.vue'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

const { data: session } = useAuth()
const isAdmin = computed(() => session.value?.user?.role === 'admin')

const isDialogOpen = ref(false)
const currentTemplate = ref<Template | null>(null)

const { data: templates, pending, refresh } = await useFetch('/api/proxy/templates')

function openCreateDialog() {
  currentTemplate.value = null
  isDialogOpen.value = true
}

function openEditDialog(template: Template) {
  currentTemplate.value = template
  isDialogOpen.value = true
}

async function handleDelete(templateId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus template ini? Ini tidak dapat diurungkan.')) return

  try {
    await $fetch(`/api/proxy/templates/${templateId}`, { method: 'DELETE' })
    toast.success('Template deleted successfully.')
    refresh()
  } catch (error: any) {
    toast.error(error.data?.statusMessage || 'An error occurred')
  }
}

function onFormSuccess() {
  isDialogOpen.value = false
  refresh()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <Head>
    <title>Templates</title>
  </Head>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Templates</h1>
      <Button v-if="isAdmin" @click="openCreateDialog">
        Buat Template Baru
      </Button>
    </div>

    <div class="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Template</TableHead>
            <TableHead>Harga</TableHead>
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
              <TableCell class="font-medium">{{ template.templateName }}</TableCell>
              <TableCell>{{ formatCurrency(template.price) }}</TableCell>
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
