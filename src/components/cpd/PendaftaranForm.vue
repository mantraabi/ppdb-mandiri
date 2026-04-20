<template>
  <div class="space-y-6">
    <div v-if="isFetching" class="p-8 text-center text-slate-500">Memuat data pendaftaran...</div>

    <div v-else-if="!registrationData" class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h3 class="mb-4 text-lg font-semibold text-slate-900">Pilih Jalur Pendaftaran</h3>
      <form @submit.prevent="submitJalur" class="space-y-6">
        <div class="space-y-3">
          <Label>Jalur Pendaftaran Tersedia</Label>
          <Select v-model="selectedJalur" required>
            <SelectTrigger class="w-full"><SelectValue placeholder="-- Pilih Jalur --" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ZONASI">Jalur Zonasi / Domisili</SelectItem>
              <SelectItem value="AFIRMASI">Jalur Afirmasi (Keluarga Tidak Mampu)</SelectItem>
              <SelectItem value="PRESTASI">Jalur Prestasi</SelectItem>
              <SelectItem value="PINDAH_TUGAS">Jalur Perpindahan Tugas Orang Tua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex justify-end">
          <Button type="submit" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-700">
            Pilih Jalur & Lanjutkan
          </Button>
        </div>
      </form>
    </div>

    <div v-else class="space-y-6">
      
      <div v-if="isLocked" class="p-4 border border-green-200 bg-green-50 rounded-xl">
        <h3 class="flex items-center gap-2 text-lg font-bold text-green-900">
          🎉 Pendaftaran Berhasil Dikirim!
        </h3>
        <p class="mt-1 text-sm text-green-800">Data dan berkas Anda sedang dalam antrean verifikasi oleh panitia. Anda sudah bisa mencetak bukti pendaftaran.</p>
      </div>

      <div class="flex flex-col gap-4 p-4 border bg-blue-50 border-blue-200 rounded-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-medium text-blue-600">Nomor Pendaftaran:</p>
          <p class="text-lg font-bold text-blue-900">{{ registrationData?.nomor_pendaftaran }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-blue-600">Status:</p>
          <span :class="isLocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'" class="px-2 py-1 text-xs font-bold rounded-md">
            {{ registrationData?.status_pendaftaran }}
          </span>
        </div>
        <div class="sm:text-right">
          <p class="text-sm font-medium text-blue-600">Jalur Pilihan:</p>
          <p class="text-lg font-bold text-blue-900">{{ registrationData?.jalur_pendaftaran }}</p>
        </div>
      </div>

      <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 class="text-lg font-semibold text-slate-900">Dokumen Persyaratan</h3>
          
          <Button v-if="!isLocked" @click="cancelRegistration" variant="destructive" size="sm" class="shadow-none bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            Batalkan & Ganti Jalur
          </Button>
          
          <Button v-else @click="printBukti" variant="outline" size="sm" class="text-blue-600 border-blue-600 hover:bg-blue-50">
            🖨️ Cetak Bukti Pendaftaran
          </Button>
        </div>
        
        <p v-if="!isLocked" class="mb-4 text-sm text-slate-500">Format yang diterima: JPG, PNG, PDF (Maksimal 5MB per file).</p>

        <div class="space-y-4">
          <UploadRow label="1. Kartu Keluarga (KK)" jenis="KK" :requiresDate="true" dateLabel="Tgl Terbit KK" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
          <UploadRow label="2. Akta Kelahiran Asli" jenis="AKTA_LAHIR" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
          <UploadRow label="3. Pas Foto Terbaru" jenis="PAS_FOTO" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
          <UploadRow label="4. Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)" jenis="SPTJM" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" templateLink="/format-sptjm.pdf" @uploaded="fetchData" />

          <template v-if="studentProfile?.jenjang_tujuan !== 'SD'">
            <UploadRow label="5. Ijazah / Surat Keterangan Lulus (SKL)" jenis="IJAZAH_SKL" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
            <UploadRow label="6. Rapor Semester 1-5" jenis="RAPOR" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
          </template>

          <UploadRow v-if="registrationData?.jalur_pendaftaran === 'AFIRMASI'" label="7. Kartu Indonesia Pintar (KIP) / PKH" jenis="KIP_AFIRMASI" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
          <UploadRow v-if="registrationData?.jalur_pendaftaran === 'PRESTASI'" label="7. Piagam / Sertifikat Kejuaraan" jenis="PIAGAM" :requiresDate="true" dateLabel="Tgl Terbit Piagam" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
          <UploadRow v-if="registrationData?.jalur_pendaftaran === 'PINDAH_TUGAS'" label="7. SK Perpindahan Tugas Orang Tua" jenis="SK_PINDAH" :requiresDate="false" :registrationId="registrationData?.id" :uploadedDocs="registrationData?.documents" :isLocked="isLocked" @uploaded="fetchData" />
        </div>

        <div v-if="!isLocked" class="p-6 mt-8 text-center border border-amber-200 bg-amber-50 rounded-xl">
          <h4 class="mb-2 font-bold text-amber-900">Sudah Selesai Mengunggah Dokumen?</h4>
          <p class="mb-4 text-sm text-amber-700">Pastikan semua dokumen sudah benar dan terbaca jelas. Setelah finalisasi, data tidak dapat diubah lagi.</p>
          <Button @click="finalizeRegistration" class="w-full bg-amber-600 hover:bg-amber-700 sm:w-auto">
            Kunci & Kirim Pendaftaran
          </Button>
        </div>
      </div>
    </div>

    <div id="print-area" v-if="registrationData && studentProfile" class="hidden">
      <div v-if="schoolProfile" class="flex items-center pb-4 mb-6 border-b-4 border-black">
        <div class="w-20 h-20 mr-4">
          <img :src="schoolProfile?.logo_url ? baseURL + '/' + schoolProfile.logo_url : '/logo.png'" alt="Logo" class="w-full h-full object-contain" onerror="this.style.display='none'" />
        </div>
        <div class="flex-1 text-center">
          <h1 class="text-xl font-bold uppercase leading-tight">Panitia Penerimaan Peserta Didik Baru</h1>
          <h2 class="text-2xl font-black uppercase tracking-wider">{{ schoolProfile?.nama_sekolah }}</h2>
          <p class="text-sm mt-1">{{ schoolProfile?.alamat }} | Telp: {{ schoolProfile?.telepon }}</p>
          <p class="text-sm">Email: {{ schoolProfile?.email }} | Website: {{ schoolProfile?.website }}</p>
        </div>
      </div>

      <div class="text-center mb-8">
        <h3 class="text-xl font-bold underline">TANDA BUKTI PENDAFTARAN PPDB ONLINE</h3>
        <p class="text-sm font-semibold mt-1">Tahun Pelajaran {{ schoolProfile?.tahun_ajaran || '2026/2027' }}</p>
      </div>

      <table class="w-full mb-8 text-sm border-collapse">
        <tbody>
          <tr>
            <td class="w-48 py-2 font-semibold">Nomor Pendaftaran</td>
            <td class="w-4 py-2">:</td>
            <td class="py-2 font-bold text-lg">{{ registrationData?.nomor_pendaftaran }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Jalur Pendaftaran</td>
            <td class="py-2">:</td>
            <td class="py-2 font-bold">{{ registrationData?.jalur_pendaftaran }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Tanggal Pendaftaran</td>
            <td class="py-2">:</td>
            <td class="py-2">{{ formatDate(registrationData?.createdAt) }}</td>
          </tr>
          <tr><td colspan="3" class="py-2"><hr class="border-slate-300 border-dashed"></td></tr>
          <tr>
            <td class="py-2 font-semibold">Nama Lengkap</td>
            <td class="py-2">:</td>
            <td class="py-2 uppercase font-semibold">{{ studentProfile?.nama_lengkap }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Tempat, Tanggal Lahir</td>
            <td class="py-2">:</td>
            <td class="py-2">{{ studentProfile?.tempat_lahir }}, {{ studentProfile?.tanggal_lahir }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold">Jenis Kelamin</td>
            <td class="py-2">:</td>
            <td class="py-2">{{ studentProfile?.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan' }}</td>
          </tr>
          <tr>
            <td class="py-2 font-semibold align-top">Alamat Domisili</td>
            <td class="py-2 align-top">:</td>
            <td class="py-2">{{ studentProfile?.alamat_domisili }}</td>
          </tr>
        </tbody>
      </table>

      <div class="p-4 border-2 border-slate-800 rounded-lg mb-8">
        <p class="font-bold mb-2">PENTING:</p>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Bukti pendaftaran ini harap dicetak/disimpan sebagai tanda bukti yang sah.</li>
          <li>Calon Peserta Didik wajib memantau pengumuman kelulusan secara berkala.</li>
          <li>Apabila terbukti ada pemalsuan data/dokumen, maka kelulusan dapat dibatalkan.</li>
        </ul>
      </div>

      <div class="flex justify-between mt-12 text-center text-sm">
        <div>
          <p>Panitia PPDB,</p>
          <br><br><br><br>
          <p class="font-bold underline">( ............................................. )</p>
        </div>
        <div>
          <p>Karanganyar, {{ formatDate(new Date()) }}</p>
          <p>Calon Peserta Didik,</p>
          <br><br><br><br>
          <p class="font-bold underline">{{ studentProfile?.nama_lengkap?.toUpperCase() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UploadRow from './UploadRow.vue';

const emit = defineEmits(['updated']);
const isFetching = ref(true);
const isLoading = ref(false);
const studentProfile = ref(null);
const registrationData = ref(null);
const schoolProfile = ref(null);
const selectedJalur = ref('');

const baseURL = import.meta.env.VITE_BASE_URL;

const isLocked = computed(() => {
  return registrationData.value && registrationData.value.status_pendaftaran !== 'DRAFT';
});

const fetchData = async () => {
  isFetching.value = true;
  try {
    const profileRes = await api.get('/student/profile');
    studentProfile.value = profileRes.data;
    
    // AMBIL PROFIL SEKOLAH UNTUK KOP SURAT
    const schoolRes = await api.get('/settings/school');
    schoolProfile.value = schoolRes.data;

    try {
      const regRes = await api.get('/registration');
      registrationData.value = regRes.data;
    } catch (err) { registrationData.value = null; }
  } catch (error) { console.error(error); } 
  finally { isFetching.value = false; emit('updated'); }
};

const submitJalur = async () => {
  if (!selectedJalur.value) return toast.error('Silakan pilih jalur.');
  isLoading.value = true;
  toast.promise(api.post('/registration', { jalur_pendaftaran: selectedJalur.value }), {
    loading: 'Membuat pendaftaran...',
    success: () => { fetchData(); isLoading.value = false; return 'Berhasil!'; },
    error: (err) => { isLoading.value = false; return err.response?.data?.message || 'Gagal memilih jalur'; }
  });
};

const cancelRegistration = async () => {
  if (!confirm('Yakin ingin membatalkan? Semua dokumen akan terhapus.')) return;
  toast.promise(api.delete('/registration'), {
    loading: 'Membatalkan...',
    success: () => { fetchData(); return 'Pendaftaran dibatalkan.'; },
    error: 'Gagal membatalkan.'
  });
};

const finalizeRegistration = async () => {
  if (!confirm('YAKIN INGIN MENGUNCI PENDAFTARAN? Setelah ini, Anda tidak bisa lagi mengubah dokumen atau jalur!')) return;

  toast.promise(api.put('/registration/finalize'), {
    loading: 'Mengirim pendaftaran ke server...',
    success: () => {
      fetchData(); 
      return 'Berhasil! Data Anda sudah dikunci.';
    },
    error: (err) => {
      return err.response?.data?.message || 'Gagal melakukan finalisasi.';
    }
  });
};

// Fungsi Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// FUNGSI CETAK (Teknik Hidden Iframe - Anti Gagal)
const printBukti = () => {
  const printArea = document.getElementById('print-area');
  if (!printArea) {
    toast.error('Gagal menyiapkan dokumen cetak');
    return;
  }

  // 1. Kloning area cetak agar tidak merusak tampilan asli
  const printContent = printArea.cloneNode(true);
  printContent.classList.remove('hidden'); // Hilangkan class hidden

  // 2. Ambil semua style/CSS Tailwind yang ada di aplikasi kita
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(tag => tag.outerHTML)
    .join('\n');

  // 3. Buat iframe tersembunyi
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // 4. Tulis HTML dan CSS ke dalam iframe
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tanda Bukti Pendaftaran - PPDB</title>
        ${styles}
        <style>
          /* Pengaturan khusus Kertas A4 */
          @page { size: A4 portrait; margin: 0; }
          body { 
            background-color: white !important; 
            color: black !important; 
            padding: 2cm; /* Margin dalam kertas */
          }
          /* Matikan animasi dan transisi saat nge-print */
          * { transition: none !important; animation: none !important; }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
  `);
  iframe.contentWindow.document.close();

  // 5. Tunggu sebentar agar gambar/logo dan CSS termuat penuh, lalu panggil Print
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    
    // Bersihkan iframe dari memori setelah selesai (jeda 1 detik agar aman di semua browser)
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};

onMounted(() => fetchData());
</script>

