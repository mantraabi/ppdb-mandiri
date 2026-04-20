<template>
  <div class="flex flex-col gap-4 p-4 border rounded-xl border-slate-200 bg-slate-50 md:flex-row md:items-center md:justify-between">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <p class="font-semibold text-slate-800">{{ label }}</p>
        
        <a v-if="templateLink && !uploadedDoc" :href="templateLink" download class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
          📥 Unduh Format
        </a>
      </div>
      
      <div v-if="uploadedDoc" class="flex items-center gap-3 mt-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Sudah Diunggah
        </span>
        <a :href="baseURL + '/' + uploadedDoc.file_url" target="_blank" class="text-sm font-medium text-blue-600 hover:underline">
          Lihat Berkas
        </a>
        <template v-if="!isLocked">
          <span class="text-slate-300">|</span>
          <button @click="deleteFile(uploadedDoc.id)" class="text-sm font-medium text-red-600 hover:underline">
            Hapus / Ganti
          </button>
        </template>
      </div>

      <div v-else-if="!isLocked" class="mt-3 space-y-3">
        <div v-if="requiresDate" class="space-y-1">
          <Label class="text-xs text-slate-500">{{ dateLabel }}</Label>
          <Input type="date" v-model="tanggalTerbit" required class="max-w-[200px]" />
        </div>
        <div class="flex items-center gap-2">
          <Input type="file" @change="handleFileChange" accept=".jpg,.jpeg,.png,.pdf" class="max-w-xs cursor-pointer bg-white" />
          <Button @click="uploadFile" :disabled="isUploading || !selectedFile" size="sm" class="bg-blue-600 hover:bg-blue-700">
            {{ isUploading ? 'Mengunggah...' : 'Unggah' }}
          </Button>
        </div>
      </div>

      <div v-else class="mt-2 text-sm italic text-red-500">
        ❌ Berkas tidak diunggah
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '@/services/api';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Panggil Base URL dari file .env
const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5009';

const props = defineProps({
  label: String, 
  jenis: String, 
  requiresDate: Boolean, 
  dateLabel: String, 
  // PERBAIKAN 1: Izinkan tipe Number dan String untuk menghilangkan warning kuning
  registrationId: [String, Number], 
  uploadedDocs: Array,
  isLocked: Boolean,
  templateLink: String 
});
const emit = defineEmits(['uploaded']);

const selectedFile = ref(null);
const tanggalTerbit = ref('');
const isUploading = ref(false);

const uploadedDoc = computed(() => {
  if (!props.uploadedDocs) return null;
  return props.uploadedDocs.find(doc => doc.jenis_dokumen === props.jenis);
});

const handleFileChange = (event) => selectedFile.value = event.target.files[0];

const uploadFile = async () => {
  if (props.requiresDate && !tanggalTerbit.value) return toast.error(`Silakan isi tanggal terbit.`);
  isUploading.value = true;
  const formData = new FormData();
  formData.append('registration_id', props.registrationId);
  formData.append('jenis_dokumen', props.jenis);
  formData.append('file', selectedFile.value);
  if (props.requiresDate) formData.append('tanggal_terbit', tanggalTerbit.value);

  toast.promise(api.post('/document/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }), {
    loading: `Mengunggah ${props.label}...`,
    success: () => { isUploading.value = false; emit('uploaded'); return `${props.label} berhasil diunggah!`; },
    error: (err) => { isUploading.value = false; return err.response?.data?.message || 'Gagal mengunggah berkas'; }
  });
};

const deleteFile = async (docId) => {
  if (!confirm('Yakin ingin menghapus dokumen ini?')) return;
  toast.promise(api.delete(`/document/${docId}`), {
    loading: 'Menghapus dokumen...',
    success: () => { emit('uploaded'); return 'Dokumen berhasil dihapus.'; },
    error: 'Gagal menghapus dokumen.'
  });
};
</script>