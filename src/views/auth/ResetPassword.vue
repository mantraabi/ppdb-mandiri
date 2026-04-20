<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-slate-50">
    <div class="w-full max-w-md p-8 bg-white shadow-xl rounded-3xl border border-slate-100">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Buat Password Baru</h2>
        <p class="text-sm text-slate-500 mt-2">Silakan masukkan kata sandi baru Anda.</p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-6">
        <div class="space-y-2">
          <Label for="password">Password Baru</Label>
          <Input id="password" type="password" v-model="password" placeholder="Minimal 6 karakter" required minlength="6" class="bg-slate-50" />
        </div>
        <div class="space-y-2">
          <Label for="confirmPassword">Konfirmasi Password Baru</Label>
          <Input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="Ulangi password baru" required class="bg-slate-50" />
        </div>

        <Button type="submit" :disabled="isLoading" class="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 rounded-xl">
          {{ isLoading ? 'Menyimpan...' : 'Simpan Password Baru' }}
        </Button>
      </form>
      <div class="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 pb-4">
          <p>&copy; 2026 PPDB Mandiri. All rights reserved.</p>
          <p class="mt-1">Dikembangkan oleh <a href="https://abimantra.my.id" target="_blank" class="font-medium text-blue-600 hover:text-blue-800 transition-colors">abimantra.my.id</a></p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const route = useRoute();
const router = useRouter();
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const handleReset = async () => {
  const token = route.query.token;
  if (!token) return toast.error('Token tidak valid atau tidak ditemukan.');
  
  if (password.value !== confirmPassword.value) {
    return toast.error('Konfirmasi password tidak cocok!');
  }

  isLoading.value = true;
  toast.promise(api.post('/auth/reset-password', { token, newPassword: password.value }), {
    loading: 'Menyimpan password baru...',
    success: () => {
      isLoading.value = false;
      setTimeout(() => router.push('/login'), 2000);
      return 'Password berhasil diubah! Silakan login.';
    },
    error: (err) => {
      isLoading.value = false;
      return err.response?.data?.message || 'Gagal mengubah password.';
    }
  });
};
</script>