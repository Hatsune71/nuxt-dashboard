<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const props = defineProps<{
  modelValue?: Gift | null
  weddingId: string
}>()

const emit = defineEmits(['success'])

const isLoading = ref(false)
const formData = ref({
  type: 'rekening',
  bankName: '',
  accountNumber: '',
  address: '',
})

watchEffect(() => {
  if (props.modelValue) {
    formData.value = {
      type: props.modelValue.type,
      bankName: props.modelValue.bankName || '',
      accountNumber: props.modelValue.accountNumber || '',
      address: props.modelValue.address || '',
    }
  } else {
    formData.value = { type: 'rekening', bankName: '', accountNumber: '', address: '' }
  }
})

async function handleSubmit() {
  if (!props.weddingId) return
  isLoading.value = true

  // Siapkan payload yang bersih berdasarkan type yang dipilih
  const payload: {
    weddingId: string;
    type: string;
    bankName?: string | null;
    accountNumber?: string | null;
    address?: string | null;
  } = {
    weddingId: props.weddingId,
    type: formData.value.type,
  };

  if (formData.value.type === 'rekening') {
    payload.bankName = formData.value.bankName;
    payload.accountNumber = formData.value.accountNumber;
    payload.address = null; // Secara eksplisit null-kan kolom address
  } else if (formData.value.type === 'hadiah') {
    payload.address = formData.value.address;
    payload.bankName = null; // Secara eksplisit null-kan kolom bank
    payload.accountNumber = null;
  }

  try {
    const method = props.modelValue ? 'PUT' : 'POST'
    
    // UBAH BAGIAN INI: Sesuaikan URL agar menggunakan proxy dan nested route
    const url = props.modelValue
      ? `/api/proxy/gifts/gifts/${props.modelValue.id}`
      : `/api/proxy/gifts/${props.weddingId}`
    
    await $fetch(url, {
      method,
      body: payload,
    })


    toast.success(`Informasi hadiah berhasil ${props.modelValue ? 'diperbarui' : 'ditambahkan'}.`)
    emit('success')
  } catch (error: any) {
    toast.error('Operasi Gagal', { description: error.data?.statusMessage })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <Label class="mb-4">Tipe Hadiah</Label>
      <RadioGroup v-model="formData.type" class="flex items-center gap-4 mt-2">
        <div class="flex items-center gap-2">
          <RadioGroupItem id="g1" value="rekening" />
          <Label for="g1">Transfer Bank</Label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem id="g2" value="hadiah" />
          <Label for="g2">Kirim Hadiah Fisik</Label>
        </div>
      </RadioGroup>
    </div>

    <template v-if="formData.type === 'rekening'">
      <div>
        <Label for="bankName" class="mb-4">Nama Bank</Label>
        <Input id="bankName" v-model="formData.bankName" placeholder="Contoh: BCA" />
      </div>
      <div>
        <Label for="accountNumber" class="mb-4">Nomor Rekening</Label>
        <Input id="accountNumber" v-model="formData.accountNumber" placeholder="1234567890" />
      </div>
    </template>

    <template v-if="formData.type === 'hadiah'">
      <div>
        <Label for="address" class="mb-4">Alamat Pengiriman</Label>
        <Input id="address" v-model="formData.address" placeholder="Isi dengan address lengkap" />
      </div>
    </template>
    
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Menyimpan...' : (modelValue ? 'Update Info' : 'Tambah Info') }}
    </Button>
  </form>
</template>