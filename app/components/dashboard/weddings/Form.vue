<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { toast } from "vue-sonner"

const props = defineProps<{
  modelValue?: Wedding | null
  templates: { id: string, nama_template: string }[]
}>()

const emit = defineEmits(['success'])

const isLoading = ref(false)
const formData = ref({
  pengantin_pria: '',
  pengantin_wanita: '',
  tanggal_akad: '',
  tanggal_resepsi: '',
  location: '',
  templateId: '',
})

const { data: templates } = await useFetch('/api/proxy/templates')

watchEffect(() => {
  if (props.modelValue) {
    formData.value = {
      pengantin_pria: props.modelValue.pengantin_pria,
      pengantin_wanita: props.modelValue.pengantin_wanita,
      // Format tanggal agar sesuai dengan input type="datetime-local"
      tanggal_akad: new Date(props.modelValue.tanggal_akad).toISOString().slice(0, 16),
      tanggal_resepsi: new Date(props.modelValue.tanggal_resepsi).toISOString().slice(0, 16),
      location: props.modelValue.location,
      templateId: props.modelValue.templateId,
    }
  } else {
    // Reset form jika dalam mode create
    formData.value = {
      pengantin_pria: '', pengantin_wanita: '', tanggal_akad: '', tanggal_resepsi: '', location: '', templateId: '',
    }
  }
})


async function handleSubmit() {
  isLoading.value = true
  try {
    const method = props.modelValue ? 'PUT' : 'POST'

    const url = props.modelValue 
      ? `/api/proxy/weddings/${props.modelValue.id}` 
      : '/api/proxy/weddings'
    
    await $fetch(url, {
      method,
      body: {
        ...formData.value,
        tanggal_akad: new Date(formData.value.tanggal_akad).toISOString(),
        tanggal_resepsi: new Date(formData.value.tanggal_resepsi).toISOString(),
      },
    })

    toast.success(`Wedding data successfully ${props.modelValue ? 'updated' : 'created'}.`)
    emit('success') // Memberi tahu parent component bahwa operasi sukses
  } catch (error: any) {
    toast.error('Operation Failed', { description: error.data?.statusMessage || 'An error occurred' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <Label for="pria" class="mb-4">Nama Pengantin Pria</Label>
      <Input id="pria" v-model="formData.pengantin_pria" required />
    </div>
    <div>
      <Label for="wanita" class="mb-4">Nama Pengantin Wanita</Label>
      <Input id="wanita" v-model="formData.pengantin_wanita" required />
    </div>
    <div>
      <Label for="akad" class="mb-4">Tanggal Akad</Label>
      <Input id="akad" v-model="formData.tanggal_akad" type="datetime-local" required />
    </div>
    <div>
      <Label for="resepsi" class="mb-4">Tanggal Resepsi</Label>
      <Input id="resepsi" v-model="formData.tanggal_resepsi" type="datetime-local" required />
    </div>
    <div>
      <Label for="location" class="mb-4">Lokasi</Label>
      <Input id="location" v-model="formData.location" required />
    </div>
    <div>
      <Label for="template" class="mb-4">Template</Label>
      <Select v-model="formData.templateId" required>
        <SelectTrigger>
          <SelectValue placeholder="Pilih template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="template in templates" :key="template.id" :value="template.id">
            {{ template.nama_template }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Saving...' : (modelValue ? 'Update Wedding' : 'Create Wedding') }}
    </Button>
  </form>
</template>