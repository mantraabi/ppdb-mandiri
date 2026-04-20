<template>
  <div class="flex items-center justify-center min-h-screen p-4 bg-slate-50">
    <div class="w-full max-w-md p-8 bg-white shadow-xl rounded-3xl border border-slate-100">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-slate-900">Lupa Password?</h2>
        <p class="text-sm text-slate-500 mt-2">Masukkan email Anda yang terdaftar, kami akan mengirimkan tautan untuk membuat password baru.</p>
      </div>

      <form @submit.prevent="handleForgot" class="space-y-6">
        <div class="space-y-2">
          <Label for="email">Alamat Email</Label>
          <Input id="email" type="email" v-model="email" placeholder="contoh@email.com" required class="bg-slate-50" />
        </div>

        <Button type="submit" :disabled="isLoading" class="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 rounded-xl">
          {{ isLoading ? 'Mengirim...' : 'Kirim Tautan Reset' }}
        </Button>
      </form>

      <p class="mt-6 text-sm text-center text-slate-600">
        Ingat password Anda? 
        <router-link to="/login" class="font-bold text-blue-600 hover:underline">Kembali ke Login</router-link>
      </p>
      <div class="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 pb-4">
      <p>&copy; 2026 PPDB Mandiri. All rights reserved.</p>
      <p class="mt-1">Dikembangkan oleh <a href="https://abimantra.my.id" target="_blank" class="font-medium text-blue-600 hover:text-blue-800 transition-colors">abimantra.my.id</a></p>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const email = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleForgot = async () => {
  isLoading.value = true;
  toast.promise(api.post('/auth/forgot-password', { email: email.value }), {
    loading: 'Memproses permintaan...',
    success: () => {
      isLoading.value = false;
      setTimeout(() => router.push('/login'), 3000);
      return 'Tautan reset password berhasil dikirim ke email Anda!';
    },
    error: (err) => {
      isLoading.value = false;
      return err.response?.data?.message || 'Gagal memproses permintaan.';
    }
  });
};
</script>