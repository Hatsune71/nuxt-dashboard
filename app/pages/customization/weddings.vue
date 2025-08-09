<script setup lang="ts">
import { ref } from 'vue'
import WeddingForm from '~/components/dashboard/weddings/Form.vue'
import { toast } from 'vue-sonner'
import { Trash2, Edit } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

const isDialogOpen = ref(false)
const currentWedding = ref<Wedding | null>(null)

const { data: weddings, pending, refresh } = await useFetch('/api/proxy/weddings')
const { data: templates } = await useFetch('/api/proxy/templates')

function openCreateDialog() {
  currentWedding.value = null
  isDialogOpen.value = true
}

function openEditDialog(wedding: Wedding) {
  currentWedding.value = wedding
  isDialogOpen.value = true
}

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

function onFormSuccess() {
  isDialogOpen.value = false
  refresh()
}
</script>

<template>
  <Head>
    <title>Weddings</title>
  </Head>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Wedding</h1>
      <Button @click="openCreateDialog">
        Buat Wedding Baru
      </Button>
    </div>

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
                {{ wedding.groom }} & {{ wedding.bride }}
              </TableCell>
              <TableCell>{{ new Date(wedding.ceremonyDate).toLocaleDateString() }}</TableCell>
              <TableCell>{{ wedding.template.templateName }}</TableCell>
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
