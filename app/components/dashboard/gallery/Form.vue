<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  weddingId: string
}>()
const emit = defineEmits(['success'])

const isLoading = ref(false)
const selectedFile = ref<File | null>(null)
const formData = ref({
  tipe: 'foto',
  deskripsi: '',
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    if (target.files[0].type.startsWith('video/')) {
        formData.value.tipe = 'video'
    } else if (target.files[0].type.startsWith('image/')) {
        formData.value.tipe = 'foto'
    }
  }
}

async function handleSubmit() {
  if (!selectedFile.value) {
    toast.error('Silakan pilih file terlebih dahulu.')
    return
  }

  isLoading.value = true
  const data = new FormData()
  data.append('weddingId', props.weddingId)
  data.append('tipe', formData.value.tipe)
  data.append('deskripsi', formData.value.deskripsi)
  data.append('file', selectedFile.value)

  try {
    await $fetch('/api/galleries', {
      method: 'POST',
      body: data,
    })
    toast.success('File berhasil diunggah ke galeri.')
    emit('success')
    selectedFile.value = null
    formData.value.deskripsi = ''
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  } catch (error: any) {
    toast.error('Gagal mengunggah', { description: error.data?.statusMessage })
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-1">
    <div>
      <Label for="file-upload" class="mb-4">Pilih File Gambar atau Video</Label>
      <Input id="file-upload" type="file" @change="handleFileChange" accept="image/*,video/*" required />
    </div>
    <div>
      <Label for="deskripsi" class="mb-4">Deskripsi (Opsional)</Label>
      <Input id="deskripsi" v-model="formData.deskripsi" placeholder="Momen pre-wedding..." />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Mengunggah...' : 'Upload ke Galeri' }}
    </Button>
  </form>
</template>