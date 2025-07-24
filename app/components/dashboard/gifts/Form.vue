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
  tipe: 'rekening',
  nama_bank: '',
  no_rek: '',
  alamat: '',
})

watchEffect(() => {
  if (props.modelValue) {
    formData.value = {
      tipe: props.modelValue.tipe,
      nama_bank: props.modelValue.nama_bank || '',
      no_rek: props.modelValue.no_rek || '',
      alamat: props.modelValue.alamat || '',
    }
  } else {
    formData.value = { tipe: 'rekening', nama_bank: '', no_rek: '', alamat: '' }
  }
})

async function handleSubmit() {
  if (!props.weddingId) return
  isLoading.value = true

  // Siapkan payload yang bersih berdasarkan tipe yang dipilih
  const payload: {
    weddingId: string;
    tipe: string;
    nama_bank?: string | null;
    no_rek?: string | null;
    alamat?: string | null;
  } = {
    weddingId: props.weddingId,
    tipe: formData.value.tipe,
  };

  if (formData.value.tipe === 'rekening') {
    payload.nama_bank = formData.value.nama_bank;
    payload.no_rek = formData.value.no_rek;
    payload.alamat = null; // Secara eksplisit null-kan kolom alamat
  } else if (formData.value.tipe === 'hadiah') {
    payload.alamat = formData.value.alamat;
    payload.nama_bank = null; // Secara eksplisit null-kan kolom bank
    payload.no_rek = null;
  }

  try {
    const method = props.modelValue ? 'PUT' : 'POST'
    
    // UBAH BAGIAN INI: Sesuaikan URL agar menggunakan proxy dan nested route
    const url = props.modelValue
      ? `/api/proxy/weddings/${props.weddingId}/gifts/${props.modelValue.id}`
      : `/api/proxy/weddings/${props.weddingId}/gifts`
    
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
      <RadioGroup v-model="formData.tipe" class="flex items-center gap-4 mt-2">
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

    <template v-if="formData.tipe === 'rekening'">
      <div>
        <Label for="nama_bank" class="mb-4">Nama Bank</Label>
        <Input id="nama_bank" v-model="formData.nama_bank" placeholder="Contoh: BCA" />
      </div>
      <div>
        <Label for="no_rek" class="mb-4">Nomor Rekening</Label>
        <Input id="no_rek" v-model="formData.no_rek" placeholder="1234567890" />
      </div>
    </template>

    <template v-if="formData.tipe === 'hadiah'">
      <div>
        <Label for="alamat" class="mb-4">Alamat Pengiriman</Label>
        <Input id="alamat" v-model="formData.alamat" placeholder="Isi dengan alamat lengkap" />
      </div>
    </template>
    
    <Button type="submit" class="w-full" :disabled="isLoading">
      {{ isLoading ? 'Menyimpan...' : (modelValue ? 'Update Info' : 'Tambah Info') }}
    </Button>
  </form>
</template>