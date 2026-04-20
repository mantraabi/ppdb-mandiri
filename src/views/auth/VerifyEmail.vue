<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-slate-50">
    <div class="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-3xl border border-slate-100">
      
      <div v-if="status === 'loading'" class="space-y-6 animate-pulse">
        <div class="flex items-center justify-center w-20 h-20 mx-auto bg-blue-100 rounded-full">
          <Loader2 class="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Memverifikasi Email...</h2>
          <p class="mt-2 text-slate-500">Mohon tunggu sebentar....</p>
        </div>
      </div>

      <div v-else-if="status === 'success'" class="space-y-6 transition-all animate-in zoom-in-95 duration-500">
        <div class="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full">
          <CheckCircle class="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Email Terverifikasi! 🎉</h2>
          <p class="mt-2 text-slate-600">{{ message }}</p>
        </div>
        <Button @click="goToLogin" class="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 rounded-xl">
          Lanjutkan ke Halaman Login
        </Button>
      </div>

      <div v-else class="space-y-6 transition-all animate-in zoom-in-95 duration-500">
        <div class="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 rounded-full">
          <XCircle class="w-10 h-10 text-red-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Verifikasi Gagal</h2>
          <p class="mt-2 text-slate-600">{{ message }}</p>
        </div>
        <div class="space-y-3">
          <Button @click="goToLogin" variant="outline" class="w-full h-12 text-base font-bold rounded-xl border-slate-300">
            Kembali ke Halaman Login
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

// UI Components
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const status = ref('loading'); // loading | success | error
const message = ref('');

const verifyToken = async () => {
  const token = route.query.token;

  if (!token) {
    status.value = 'error';
    message.value = 'Token verifikasi tidak ditemukan di URL.';
    return;
  }

  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    status.value = 'success';
    message.value = response.data.message || 'Akun Anda telah aktif dan siap digunakan.';
  } catch (error) {
    status.value = 'error';
    message.value = error.response?.data?.message || 'Tautan verifikasi tidak valid atau sudah kedaluwarsa.';
  }
};

const goToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  // Beri sedikit jeda agar animasi loading terlihat natural (opsional)
  setTimeout(() => {
    verifyToken();
  }, 1000);
});
</script>