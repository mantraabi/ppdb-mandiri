<template>
  <div class="flex items-center justify-center min-h-screen py-10 bg-slate-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-slate-900">Daftar Akun Baru</h1>
        <p class="mt-1 text-sm text-slate-500">Buat akun untuk calon peserta didik</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <Label for="nik">NIK (16 Digit)</Label>
          <Input id="nik" v-model="nik" type="text" placeholder="Masukkan 16 digit NIK" required minlength="16" maxlength="16" />
        </div>

        <div class="space-y-2">
          <Label for="email">Email Aktif</Label>
          <Input id="email" v-model="email" type="email" placeholder="nama@email.com" required />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="Minimal 6 karakter" required minlength="6" />
        </div>

        <Button type="submit" class="w-full" :disabled="isLoading">
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Daftar</span>
        </Button>
      </form>

      <div class="text-sm text-center text-slate-600">
        Sudah punya akun?
        <router-link to="/login" class="font-medium text-blue-600 hover:underline">Masuk di sini</router-link>
      </div>
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
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'vue-sonner'; // <-- Import Toast

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const router = useRouter();
const authStore = useAuthStore();

const nik = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  
  toast.promise(authStore.register(nik.value, email.value, password.value), {
    loading: 'Sedang membuat akun...',
    success: () => {
      isLoading.value = false;
      // Beri jeda sejenak sebelum pindah agar user sempat membaca toast
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return 'Registrasi berhasil! Mengalihkan ke halaman login...';
    },
    error: (err) => {
      isLoading.value = false;
      return err || 'Gagal melakukan registrasi';
    }
  });
};
</script>