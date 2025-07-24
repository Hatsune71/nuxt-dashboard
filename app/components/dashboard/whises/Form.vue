<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  weddingId: string
}>()

const isLoading = ref(false)
const formData = ref({
  wishes_name: '',
  wishes_message: '',
})

async function handleSubmit() {
  if (!props.weddingId) {
    toast.error('Error: Wedding ID is missing.')
    return
  }
  
  isLoading.value = true
  try {
    await $fetch(`/api/proxy/weddings/${props.weddingId}/wishes`, {
      method: 'POST',
      body: formData.value,
    })

    toast.success('Terima kasih! Ucapan Anda telah terkirim.')
    formData.value.wishes_name = ''
    formData.value.wishes_message = ''
  } catch (error: any) {
    toast.error('Gagal mengirim ucapan', { description: error.data?.statusMessage || 'Terjadi kesalahan' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle>Kirim Ucapan & Doa</CardTitle>
      <CardDescription>Bagikan kebahagiaan Anda kepada kedua mempelai.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <Label for="wishes_name">Nama Anda</Label>
          <Input id="wishes_name" v-model="formData.wishes_name" placeholder="John Doe" required />
        </div>
        <div>
          <Label for="wishes_message">Ucapan Anda</Label>
          <Textarea id="wishes_message" v-model="formData.wishes_message" placeholder="Semoga bahagia selalu..." required />
        </div>
        <Button type="submit" class="w-full" :disabled="isLoading">
          {{ isLoading ? 'Mengirim...' : 'Kirim Ucapan' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>