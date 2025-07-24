<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  modelValue?: Template | null
}>()

const emit = defineEmits(['success'])

const isLoading = ref(false)
const formData = ref({
  nama_template: '',
  harga: 0,
  logo: '',
})

watchEffect(() => {
  if (props.modelValue) {
    formData.value = {
      nama_template: props.modelValue.nama_template,
      harga: props.modelValue.harga,
      logo: props.modelValue.logo || '', // Pastikan logo tidak undefined
    }
  } else {
    // Reset form jika dalam mode create
    formData.value = {
      nama_template: '',
      harga: 0,
    }
  }
})

async function handleSubmit() {
  isLoading.value = true
  try {
    const method = props.modelValue ? 'PUT' : 'POST'

    const url = props.modelValue 
      ? `/api/proxy/templates/${props.modelValue.id}` 
      : '/api/proxy/templates'
    
    await $fetch(url, {
      method,
      body: {
        ...formData.value,
        harga: Number(formData.value.harga) 
      },
    })

    toast.success(`Template successfully ${props.modelValue ? 'updated' : 'created'}.`)
    emit('success')
  } catch (error: any) {
    toast.error(error.data?.statusMessage || 'An error occurred')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <Label for="nama_template" class="mb-4">Nama Template</Label>
      <Input id="nama_template" v-model="formData.nama_template" required />
    </div>
    <div>
      <Label for="harga" class="mb-4">Harga</Label>
      <Input id="harga" v-model.number="formData.harga" type="number" required />
    </div>
        <div>
      <Label for="logo" class="mb-4">Logo</Label>
      <Input id="logo" v-model="formData.logo" required />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Saving...' : (modelValue ? 'Update Template' : 'Create Template') }}
    </Button>
  </form>
</template>