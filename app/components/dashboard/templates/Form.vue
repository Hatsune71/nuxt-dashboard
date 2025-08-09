<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  modelValue?: Template | null
}>()

const emit = defineEmits(['success'])

const isLoading = ref(false)
const formData = ref({
  templateName: '',
  price: 0,
  logo: '',
})

watchEffect(() => {
  if (props.modelValue) {
    formData.value = {
      templateName: props.modelValue.templateName,
      price: props.modelValue.price,
      logo: props.modelValue.logo || '', // Pastikan logo tidak undefined
    }
  } else {
    // Reset form jika dalam mode create
    formData.value = {
      templateName: '',
      price: 0,
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
        price: Number(formData.value.price) 
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
      <Label for="templateName" class="mb-4">Nama Template</Label>
      <Input id="templateName" v-model="formData.templateName" required />
    </div>
    <div>
      <Label for="price" class="mb-4">Harga</Label>
      <Input id="price" v-model.number="formData.price" type="number" required />
    </div>
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Saving...' : (modelValue ? 'Update Template' : 'Create Template') }}
    </Button>
  </form>
</template>