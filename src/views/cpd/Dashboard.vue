<template>
  <div class="flex h-screen bg-slate-50/50">
    <aside class="hidden w-64 bg-white border-r border-slate-200 md:flex md:flex-col">
      <div class="flex items-center h-16 px-6 border-b border-slate-200">
        <div class="flex items-center justify-center w-8 h-8 mr-3 bg-blue-600 rounded-lg">
          <span class="text-lg font-bold text-white">P</span>
        </div>
        <h1 class="text-lg font-bold tracking-tight text-slate-900">PPDB Mandiri</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <p class="px-4 mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">Menu Utama</p>
        <button 
          v-for="menu in menus" :key="menu.id"
          @click="activeTab = menu.id"
          :class="[
            'flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === menu.id 
              ? 'bg-blue-50 text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          ]"
        >
          <component :is="menu.icon" :class="['w-5 h-5 mr-3', activeTab === menu.id ? 'text-blue-600' : 'text-slate-400']" />
          {{ menu.label }}
        </button>
      </nav>
    </aside>

    <div class="flex flex-col flex-1 overflow-hidden">
      <header class="flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 sm:px-6 lg:px-8">
        <div class="flex items-center">
          <Button variant="ghost" size="icon" @click="isMobileMenuOpen = !isMobileMenuOpen" class="mr-2 md:hidden">
            <Menu class="w-5 h-5" />
          </Button>
          <h2 class="text-lg font-semibold text-slate-800 md:hidden">PPDB Mandiri</h2>
          <div class="items-center hidden text-sm md:flex text-slate-500">
            <span>Aplikasi</span>
            <span class="mx-2">/</span>
            <span class="font-medium capitalize text-slate-900">{{ activeTab.replace('-', ' ') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="flex items-center gap-2 p-1 text-sm font-medium transition-colors rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200">
                <Avatar class="w-8 h-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback class="text-blue-700 bg-blue-100">{{ userInitials }}</AvatarFallback>
                </Avatar>
                <span class="hidden mr-2 sm:inline-block text-slate-700">{{ userEmail }}</span>
                <ChevronDown class="hidden w-4 h-4 sm:block text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="activeTab = 'pengaturan'" class="cursor-pointer">
                <Settings class="w-4 h-4 mr-2" />
                Pengaturan Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut class="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div v-if="isMobileMenuOpen" class="absolute z-10 w-full bg-white border-b shadow-lg border-slate-200 md:hidden">
        <nav class="p-2 space-y-1">
          <button 
            v-for="menu in menus" :key="menu.id"
            @click="activeTab = menu.id; isMobileMenuOpen = false"
            :class="[
              'flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg',
              activeTab === menu.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            ]"
          >
            <component :is="menu.icon" class="w-5 h-5 mr-3" />
            {{ menu.label }}
          </button>
        </nav>
      </div>

      <main class="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">
        <div class="max-w-5xl mx-auto">
          
          <div v-if="activeTab === 'beranda'" class="space-y-6 transition-all transform animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div v-if="registrationData?.status_pendaftaran === 'DITERIMA'" class="p-8 sm:p-12 text-center bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl text-white shadow-xl transform transition-all hover:scale-[1.01]">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm animate-bounce">
                <span class="text-4xl">🎓</span>
              </div>
              <h1 class="text-4xl sm:text-5xl font-black mb-4 tracking-tight">SELAMAT!</h1>
              <p class="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Halo <strong>{{ studentProfile?.nama_lengkap }}</strong>, Anda dinyatakan <strong class="text-yellow-300">DITERIMA</strong> sebagai peserta didik baru di <strong>{{ schoolProfile?.nama_sekolah || 'sekolah kami' }}</strong>.
              </p>
              
              <div class="inline-block p-5 bg-white/10 rounded-2xl backdrop-blur-md mb-8 border border-white/20">
                <p class="text-sm font-medium uppercase tracking-widest opacity-80 mb-1">Nomor Pendaftaran</p>
                <p class="text-3xl font-bold tracking-wider">{{ registrationData?.nomor_pendaftaran }}</p>
                <p class="text-sm mt-2 opacity-80">Jalur: {{ registrationData?.jalur_pendaftaran }}</p>
              </div>
              
              <br>
              <Button @click="printSuratKelulusan" class="bg-white text-emerald-700 hover:bg-green-50 shadow-lg text-lg px-8 py-6 rounded-full font-bold transition-transform hover:-translate-y-1">
                🖨️ Cetak Surat Kelulusan
              </Button>
            </div>

            <div v-else-if="registrationData?.status_pendaftaran === 'BERKAS TIDAK VALID'" class="p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4">
                <AlertTriangle class="w-8 h-8" />
              </div>
              <h2 class="text-2xl font-bold tracking-tight text-amber-900 mb-2">Berkas Perlu Perbaikan</h2>
              <p class="text-amber-800 max-w-lg mx-auto mb-6">
                Panitia menemukan ketidaksesuaian pada dokumen yang Anda unggah (buram/salah file). Silakan buka kunci pendaftaran untuk memperbaiki berkas.
              </p>
              <Button @click="revertToDraft" class="bg-amber-600 hover:bg-amber-700 shadow-lg text-white px-8 py-5 rounded-full font-bold">
                Buka Kunci & Perbaiki Berkas
              </Button>
            </div>

            <div v-else-if="registrationData?.status_pendaftaran === 'DITOLAK'" class="p-8 text-center bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-3xl">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                <XCircle class="w-8 h-8" />
              </div>
              <h2 class="text-2xl font-bold tracking-tight text-red-900 mb-2">Mohon Maaf, Anda Tidak Lolos</h2>
              <p class="text-red-700 max-w-lg mx-auto mb-6">
                Berdasarkan hasil seleksi panitia, Anda dinyatakan tidak lolos seleksi PPDB pada jalur ini. Tetap semangat!
              </p>
            </div>

            <template v-else>
              <div class="p-6 bg-white border rounded-2xl border-slate-200 shadow-sm">
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">Selamat Datang, {{ studentProfile?.nama_lengkap || 'Calon Siswa' }}!</h2>
                <p class="mt-1 text-slate-500">Pantau terus tahapan pendaftaran Anda agar bisa segera diverifikasi oleh panitia.</p>
              </div>
              
              <div :class="progress.jalur ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'" class="p-6 border shadow-sm rounded-2xl">
                <div class="flex items-start gap-4">
                  <div :class="progress.jalur ? 'bg-blue-600' : 'bg-slate-400'" class="p-3 rounded-xl">
                    <Info class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 :class="progress.jalur ? 'text-blue-900' : 'text-slate-700'" class="text-lg font-semibold">
                      Status: {{ registrationData ? registrationData.status_pendaftaran : 'BELUM MENDAFTAR' }}
                    </h3>
                    <p :class="progress.jalur ? 'text-blue-700' : 'text-slate-600'" class="mt-1 text-sm leading-relaxed">
                      {{ registrationData?.status_pendaftaran === 'MENUNGGU VERIFIKASI' ? 'Pendaftaran Anda sedang dalam antrean pengecekan panitia. Silakan cek hasil pengumuman secara berkala di halaman ini.' : (progress.jalur ? 'Selesaikan unggah berkas dan lakukan Finalisasi pada menu Jalur & Berkas.' : 'Langkah pertama yang harus Anda lakukan adalah melengkapi data diri dan alamat.') }}
                    </p>
                    <Button v-if="!progress.biodata" @click="activeTab = 'biodata'" class="mt-4 bg-blue-600 hover:bg-blue-700">
                      Lengkapi Biodata Sekarang
                      <ArrowRight class="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              <div class="p-6 bg-white border rounded-2xl border-slate-200 shadow-sm">
                <h3 class="text-lg font-bold tracking-tight text-slate-900 mb-6">Progres Pendaftaran</h3>
                <div class="space-y-6">
                  <div class="flex items-center gap-4">
                    <div :class="progress.biodata ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'" class="p-3 rounded-full">
                      <CheckCircle v-if="progress.biodata" class="w-6 h-6" />
                      <Circle v-else class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">1. Kelengkapan Biodata & Lokasi</p>
                      <p class="text-sm text-slate-500">{{ progress.biodata ? 'Biodata telah disimpan.' : 'Menunggu Anda mengisi form biodata.' }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div :class="progress.jalur ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'" class="p-3 rounded-full">
                      <CheckCircle v-if="progress.jalur" class="w-6 h-6" />
                      <Circle v-else class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">2. Pemilihan Jalur Pendaftaran</p>
                      <p class="text-sm text-slate-500">{{ progress.jalur ? 'Memilih jalur ' + registrationData?.jalur_pendaftaran : 'Anda belum memilih jalur pendaftaran.' }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div :class="registrationData?.status_pendaftaran === 'MENUNGGU VERIFIKASI' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'" class="p-3 rounded-full">
                      <CheckCircle v-if="registrationData?.status_pendaftaran === 'MENUNGGU VERIFIKASI'" class="w-6 h-6" />
                      <Circle v-else class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">3. Finalisasi & Kunci Data</p>
                      <p class="text-sm text-slate-500">{{ registrationData?.status_pendaftaran === 'MENUNGGU VERIFIKASI' ? 'Pendaftaran telah dikunci dan masuk antrean verifikasi.' : 'Menunggu Anda menekan tombol Kunci Pendaftaran.' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div v-if="activeTab === 'biodata'" class="transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-6">
              <h2 class="text-2xl font-bold tracking-tight text-slate-900">Biodata & Alamat</h2>
              <p class="mt-1 text-sm text-slate-500">Pastikan data yang Anda masukkan sesuai dengan dokumen asli.</p>
            </div>
            <BiodataForm @saved="fetchDashboardData" />
          </div>

          <div v-if="activeTab === 'pendaftaran'" class="transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-6">
              <h2 class="text-2xl font-bold tracking-tight text-slate-900">Pilih Jalur & Unggah Berkas</h2>
              <p class="mt-1 text-sm text-slate-500">Pilih jalur pendaftaran dan unggah dokumen pendukung yang dibutuhkan.</p>
            </div>
            <PendaftaranForm @updated="fetchDashboardData" />
          </div>

          <div v-if="activeTab === 'pengaturan'" class="transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-6">
              <h2 class="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Keamanan</h2>
              <p class="mt-1 text-sm text-slate-500">Kelola kata sandi untuk melindungi akun pendaftaran Anda.</p>
            </div>
            
            <div class="max-w-xl p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div class="mb-8 space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700">Email Akun Terdaftar</label>
                  <input type="email" disabled :value="userEmail" class="w-full px-4 py-2 mt-1 border rounded-lg cursor-not-allowed bg-slate-50 border-slate-200 text-slate-500">
                  <p class="mt-1 text-xs text-slate-400">Email tidak dapat diubah setelah pendaftaran.</p>
                </div>
              </div>

              <hr class="mb-6 border-slate-100">

              <h3 class="mb-4 text-lg font-bold text-slate-800">Ganti Password</h3>
              <form @submit.prevent="handleUpdatePassword" class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-slate-700">Password Lama</label>
                  <input v-model="passForm.oldPassword" type="password" required placeholder="Masukkan password saat ini" class="w-full px-4 py-2 mt-1 transition-all border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700">Password Baru</label>
                  <input v-model="passForm.newPassword" type="password" required minlength="6" placeholder="Minimal 6 karakter" class="w-full px-4 py-2 mt-1 transition-all border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700">Konfirmasi Password Baru</label>
                  <input v-model="passForm.confirmPassword" type="password" required minlength="6" placeholder="Ulangi password baru" class="w-full px-4 py-2 mt-1 transition-all border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>

                <Button type="submit" :disabled="isSubmittingPass" class="w-full mt-2 bg-slate-900 hover:bg-slate-800">
                  {{ isSubmittingPass ? 'Menyimpan...' : 'Perbarui Password' }}
                </Button>
              </form>
            </div>
          </div>

        </div>
        <div class="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 pb-4">
        <p>&copy; 2026 PPDB Mandiri. All rights reserved.</p>
        <p class="mt-1">Dikembangkan oleh <a href="https://abimantra.my.id" target="_blank" class="font-medium text-blue-600 hover:text-blue-800 transition-colors">abimantra.my.id</a></p>
      </div>
      </main>
    </div>

    <div id="print-surat" class="hidden" v-if="registrationData?.status_pendaftaran === 'DITERIMA'">
      <div v-if="schoolProfile" class="flex items-center pb-4 mb-6 border-b-4 border-black">
        <div class="w-20 h-20 mr-4">
          <img :src="schoolProfile?.logo_url ? baseURL + '/' + schoolProfile.logo_url : '/logo.png'" alt="Logo" class="w-full h-full object-contain" onerror="this.style.display='none'" />
        </div>
        <div class="flex-1 text-center">
          <h2 class="text-2xl font-black uppercase tracking-wider">{{ schoolProfile?.nama_sekolah }}</h2>
          <p class="text-sm mt-1">{{ schoolProfile?.alamat }} | Telp: {{ schoolProfile?.telepon }}</p>
          <p class="text-sm">Email: {{ schoolProfile?.email }} | Website: {{ schoolProfile?.website }}</p>
        </div>
      </div>

      <div class="text-center mb-8 mt-6">
        <h3 class="text-xl font-bold underline">SURAT KETERANGAN DITERIMA (LULUS SELEKSI)</h3>
      </div>

      <div class="mb-6 leading-relaxed text-justify">
        <p>Berdasarkan hasil seleksi Penerimaan Peserta Didik Baru (PPDB) Tahun Pelajaran {{ schoolProfile?.tahun_ajaran || '2026/2027' }}, Kepala {{ schoolProfile?.nama_sekolah || 'Sekolah' }} menerangkan bahwa Calon Peserta Didik di bawah ini:</p>
      </div>

      <table class="w-full mb-8 text-base border-collapse ml-4">
        <tbody>
          <tr>
            <td class="w-56 py-2 font-semibold">Nomor Pendaftaran</td>
            <td class="w-4 py-2">:</td>
            <td class="py-2 font-bold">{{ registrationData?.nomor_pendaftaran }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Nama Lengkap</td>
            <td class="py-2">:</td>
            <td class="py-2 uppercase font-bold">{{ studentProfile?.nama_lengkap }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Tempat, Tanggal Lahir</td>
            <td class="py-2">:</td>
            <td class="py-2">{{ studentProfile?.tempat_lahir }}, {{ formatDate(studentProfile?.tanggal_lahir) }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Jalur Diterima</td>
            <td class="py-2">:</td>
            <td class="py-2 font-bold">{{ registrationData?.jalur_pendaftaran }}</td>
          </tr>
        </tbody>
      </table>

      <div class="mb-8 leading-relaxed text-justify">
        <p>Dinyatakan <strong class="text-lg">DITERIMA</strong> sebagai Peserta Didik Baru di {{ schoolProfile?.nama_sekolah || 'Sekolah' }} Tahun Pelajaran {{ schoolProfile?.tahun_ajaran || '2026/2027' }}.</p>
        <p class="mt-4">Bagi peserta didik yang dinyatakan diterima, <strong>WAJIB</strong> melakukan tahapan Daftar Ulang dengan membawa berkas persyaratan asli sesuai jadwal yang telah ditentukan panitia. Apabila sampai batas waktu yang ditentukan tidak melakukan daftar ulang, maka dianggap <strong>MENGUNDURKAN DIRI</strong>.</p>
      </div>

      <div class="flex justify-end mt-16 text-center">
        <div>
          <p>Ditetapkan di: {{ schoolProfile?.alamat?.split(',')[1] || 'Tempat' }}</p>
          <p>Tanggal: {{ formatDate(new Date()) }}</p>
          <p class="font-bold mt-1">Kepala Sekolah,</p>
          <br><br><br><br>
          <p class="font-bold underline">( ............................................. )</p>
          <p>NIP. ........................................</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import { toast } from 'vue-sonner';

// Import Komponen UI
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import Custom Form
import BiodataForm from '@/components/cpd/BiodataForm.vue';
import PendaftaranForm from '@/components/cpd/PendaftaranForm.vue';

// Import Icons
import { 
  LayoutDashboard, UserCircle, FileText, LogOut, Menu, 
  ChevronDown, Settings, Info, ArrowRight, CheckCircle, Circle, XCircle, AlertTriangle
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const isMobileMenuOpen = ref(false);
const activeTab = ref('beranda');

const baseURL = import.meta.env.VITE_BASE_URL;

// State Data Global
const studentProfile = ref(null);
const schoolProfile = ref(null);
const registrationData = ref(null);
const progress = ref({ biodata: false, jalur: false, berkas: false });

const menus = [
  { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
  { id: 'biodata', label: 'Biodata & Alamat', icon: UserCircle },
  { id: 'pendaftaran', label: 'Jalur & Berkas', icon: FileText },
];

const userEmail = computed(() => authStore.user?.email || 'User');
const userInitials = computed(() => userEmail.value.substring(0, 2).toUpperCase());

// Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Fungsi Mengambil Semua Data (Profil Siswa, Sekolah, & Pendaftaran)
const fetchDashboardData = async () => {
  // 1. Profil Sekolah (Kita pindah ke atas agar tetap jalan walau profil siswa kosong)
  try {
    const schoolRes = await api.get('/settings/school');
    schoolProfile.value = schoolRes.data;
  } catch (err) {
    console.error('Gagal memuat profil sekolah:', err);
  }

  // 2. Profil Siswa
  try {
    const profileRes = await api.get('/student/profile');
    studentProfile.value = profileRes.data;
    if (profileRes.data && profileRes.data.nama_lengkap) progress.value.biodata = true;
  } catch (error) {
    // Kita abaikan error 404 karena wajar jika pendaftar baru belum punya biodata
    if (error.response?.status === 404) {
      studentProfile.value = null;
      progress.value.biodata = false;
    } else {
      console.error('Error lain saat memuat profil:', error);
    }
  }

  // 3. Data Pendaftaran
  try {
    const regRes = await api.get('/registration');
    if (regRes.data) {
      registrationData.value = regRes.data;
      progress.value.jalur = true;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      registrationData.value = null;
      progress.value.jalur = false;
    }
  }
};

// fungsi revertToDraft untuk membatalkan pendaftaran
const revertToDraft = async () => {
  toast.promise(api.put('/registration/revert'), {
    loading: 'Membuka kunci pendaftaran...',
    success: () => {
      fetchDashboardData();
      activeTab.value = 'pendaftaran'; // Arahkan langsung ke tab berkas
      return 'Kunci dibuka! Silakan hapus berkas yang salah dan unggah ulang.';
    },
    error: 'Gagal membuka kunci pendaftaran.'
  });
};

// State untuk Form Password
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const isSubmittingPass = ref(false);

// Fungsi Handle Ganti Password
const handleUpdatePassword = async () => {
  if (passForm.value.newPassword !== passForm.value.confirmPassword) {
    return toast.error('Konfirmasi password baru tidak cocok!');
  }

  isSubmittingPass.value = true;
  try {
    const res = await api.put('/student/account', {
      oldPassword: passForm.value.oldPassword,
      newPassword: passForm.value.newPassword
    });
    
    toast.success(res.data.message);
    // Kosongkan form setelah sukses
    passForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui password');
  } finally {
    isSubmittingPass.value = false;
  }
};

// Fungsi Cetak Surat Kelulusan (Iframe Method)
const printSuratKelulusan = () => {
  const printArea = document.getElementById('print-surat');
  if (!printArea) return toast.error('Gagal menyiapkan surat kelulusan');

  const printContent = printArea.cloneNode(true);
  printContent.classList.remove('hidden');

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(tag => tag.outerHTML).join('\n');

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Surat Keterangan Diterima - PPDB</title>
        ${styles}
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { background-color: white !important; color: black !important; padding: 2.5cm 2cm; }
          * { transition: none !important; animation: none !important; }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
  `);
  iframe.contentWindow.document.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => { document.body.removeChild(iframe); }, 1000);
  }, 500);
};

watch(activeTab, (newTab) => {
  if (newTab === 'beranda') fetchDashboardData();
});

onMounted(() => {
  fetchDashboardData();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>