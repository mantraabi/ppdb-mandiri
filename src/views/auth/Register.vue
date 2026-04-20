<template>
  <div class="flex min-h-screen bg-white">
    
    <div class="relative hidden w-1/2 lg:block bg-slate-900">
      <img 
        src="https://images.unsplash.com/photo-1510531704581-5b2870972060?q=80&w=2070&auto=format&fit=crop" 
        alt="School Background" 
        class="absolute inset-0 object-cover w-full h-full opacity-60"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/20"></div>
      
      <div class="absolute bottom-0 left-0 right-0 p-12 text-white">
        <h2 class="mb-4 text-3xl font-bold tracking-tight">Langkah Awal Menuju Masa Depan</h2>
        <p class="text-lg text-slate-300 max-w-xl">
          Buat akun pendaftaran Anda dalam hitungan menit. Persiapkan dokumen Anda dan bergabunglah bersama kami di tahun ajaran baru ini.
        </p>
      </div>
    </div>

    <div class="flex flex-col justify-center w-full px-8 py-12 lg:w-1/2 sm:px-16 xl:px-24 relative">
      
      <div class="w-full max-w-sm mx-auto space-y-8">
        
        <div class="text-center sm:text-left">
          <div v-if="schoolProfile.logo_url" class="inline-flex items-center justify-center mb-6 overflow-hidden bg-white border shadow-sm w-16 h-16 rounded-xl border-slate-200">
            <img :src="baseURL + '/' + schoolProfile.logo_url" class="object-contain w-12 h-12" alt="Logo Sekolah" />
          </div>

          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Akun Baru
          </h1>
          <p class="mt-2 text-sm text-slate-500">
            Buat akun untuk calon peserta didik (CPD).
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="space-y-2">
            <Label for="nik" class="text-sm font-semibold text-slate-700">NIK (16 Digit)</Label>
            <Input 
              id="nik" 
              v-model="nik" 
              type="text" 
              placeholder="Masukkan 16 digit NIK" 
              required 
              minlength="16" 
              maxlength="16"
              class="h-11 bg-slate-50 focus:bg-white transition-colors" 
            />
          </div>

          <div class="space-y-2">
            <Label for="email" class="text-sm font-semibold text-slate-700">Email Aktif</Label>
            <Input 
              id="email" 
              v-model="email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              class="h-11 bg-slate-50 focus:bg-white transition-colors" 
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-sm font-semibold text-slate-700">Kata Sandi</Label>
            
            <div class="relative">
              <Input 
                id="password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Minimal 6 karakter" 
                required 
                minlength="6" 
                class="h-11 bg-slate-50 focus:bg-white transition-colors pr-10" 
              />

              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <Button type="submit" class="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all" :disabled="isLoading">
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Memproses...
            </span>
            <span v-else>Daftar Sekarang</span>
          </Button>
        </form>

        <div class="text-center text-sm text-slate-500">
          Sudah punya akun? 
          <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all">
            Masuk di sini
          </router-link>
        </div>

      </div>

      <div class="absolute bottom-8 left-0 right-0 text-center text-xs text-slate-400 px-8">
        <p>&copy; 2026 PPDB Mandiri. All rights reserved.</p>
        <p class="mt-1">Dikembangkan oleh <a href="https://abimantra.my.id" target="_blank" class="font-medium text-slate-500 hover:text-blue-600 transition-colors">abimantra.my.id</a></p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'vue-sonner';
import api from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const baseURL = import.meta.env.VITE_BASE_URL;

const nik = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

// State untuk memuat logo dinamis
const schoolProfile = ref({ logo_url: '' });

const fetchSchoolProfile = async () => {
  try {
    const res = await api.get('/settings/school');
    schoolProfile.value = res.data;
  } catch (error) {
    console.error('Gagal memuat identitas sekolah', error);
  }
};

onMounted(() => {
  fetchSchoolProfile();
});

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