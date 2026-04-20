<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-50">
    <div class="w-full max-w-md p-8 space-y-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-slate-900">Login PPDB Mandiri</h1>
        <p class="text-sm text-slate-500 mt-1">Masuk untuk melanjutkan pendaftaran</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="nama@email.com" required />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <router-link to="/forgot-password" class="text-sm font-semibold text-blue-600 hover:underline">Lupa password?</router-link>

        <Button type="submit" class="w-full" :disabled="isLoading">
          <span v-if="isLoading">Memeriksa...</span>
          <span v-else>Masuk</span>
        </Button>
      </form>

      <div class="text-sm text-center text-slate-600">
        Belum punya akun?
        <router-link to="/register" class="font-medium text-blue-600 hover:underline">Daftar sekarang</router-link>
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

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  
  toast.promise(authStore.login(email.value, password.value), {
    loading: 'Memeriksa kredensial...',
    success: () => {
      isLoading.value = false;
      
      // CEK ROLE SETELAH LOGIN SUKSES
      if (authStore.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      
      return 'Login berhasil! Selamat datang.';
    },
    error: (err) => {
      isLoading.value = false;
      return err || 'Gagal melakukan login';
    }
  });
};
</script>