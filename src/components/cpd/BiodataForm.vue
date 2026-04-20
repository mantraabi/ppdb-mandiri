<template>
  <div class="p-6 bg-white border shadow-sm border-slate-200 rounded-2xl">
    <form @submit.prevent="handleSave" class="space-y-8">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="nama">Nama Lengkap Sesuai KK/Akta</Label>
          <Input id="nama" v-model="form.nama_lengkap" placeholder="Masukkan nama lengkap" required />
        </div>

        <div class="space-y-2">
          <Label for="jenjang">Jenjang Tujuan Pendaftaran</Label>
          <Select v-model="form.jenjang_tujuan" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenjang pendidikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SD">Sekolah Dasar (SD)</SelectItem>
              <SelectItem value="SMP">Sekolah Menengah Pertama (SMP)</SelectItem>
              <SelectItem value="SMA">Sekolah Menengah Atas (SMA)</SelectItem>
              <SelectItem value="SMK">Sekolah Menengah Kejuruan (SMK)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="agama">Agama</Label>
          <Select v-model="form.agama" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih agama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Islam">Islam</SelectItem>
              <SelectItem value="Kristen">Kristen Protestan</SelectItem>
              <SelectItem value="Katolik">Katolik</SelectItem>
              <SelectItem value="Hindu">Hindu</SelectItem>
              <SelectItem value="Buddha">Buddha</SelectItem>
              <SelectItem value="Konghucu">Konghucu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="tempat_lahir">Tempat Lahir</Label>
          <Input id="tempat_lahir" v-model="form.tempat_lahir" placeholder="Contoh: Jakarta" required />
        </div>

        <div class="space-y-2">
          <Label for="tanggal_lahir">Tanggal Lahir</Label>
          <Input id="tanggal_lahir" type="date" v-model="form.tanggal_lahir" required />
        </div>

        <div class="space-y-2">
          <Label for="jenis_kelamin">Jenis Kelamin</Label>
          <Select v-model="form.jenis_kelamin" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="pt-6 space-y-6 border-t border-slate-200">
        <div>
          <h3 class="text-lg font-semibold text-slate-900">Alamat & Titik Koordinat</h3>
          <p class="text-sm text-slate-500">Geser penanda pada peta atau gunakan fitur deteksi lokasi otomatis.</p>
        </div>

        <div class="space-y-2">
          <Label for="alamat">Alamat Lengkap (Jalan, RT/RW, Desa/Kelurahan)</Label>
          <Textarea id="alamat" v-model="form.alamat_domisili" placeholder="Tuliskan alamat lengkap domisili saat ini..." rows="3" required />
        </div>

        <div class="flex items-center gap-4">
          <Button type="button" @click="getLocation" variant="outline" class="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
            <MapPin class="w-4 h-4" />
            {{ isDetecting ? 'Mencari lokasi...' : 'Deteksi Lokasi Saya' }}
          </Button>
          <span v-if="locationError" class="text-sm text-red-500">{{ locationError }}</span>
        </div>

        <div class="overflow-hidden border-2 rounded-xl border-slate-300">
          <div id="map" style="height: 350px; width: 100%; z-index: 10;"></div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Latitude</Label>
            <Input v-model="form.latitude" readonly class="bg-slate-50" />
          </div>
          <div class="space-y-2">
            <Label>Longitude</Label>
            <Input v-model="form.longitude" readonly class="bg-slate-50" />
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <Button type="submit" :disabled="isLoading" class="bg-blue-600 hover:bg-blue-700">
          <span v-if="isLoading">Menyimpan...</span>
          <span v-else>Simpan Biodata</span>
        </Button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

// Import komponen UI Shadcn
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// Daftarkan emit agar Dashboard tahu saat biodata berhasil disimpan
const emit = defineEmits(['saved']);

// Fix Icon Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const form = ref({
  nama_lengkap: '',
  jenjang_tujuan: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  agama: '',
  alamat_domisili: '',
  latitude: -7.5947, // Default ke Karanganyar
  longitude: 110.9506
});

const isLoading = ref(false);
const isDetecting = ref(false);
const locationError = ref('');

let map = null;
let marker = null;

// Inisialisasi Peta
const initMap = () => {
  map = L.map('map').setView([form.value.latitude, form.value.longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker([form.value.latitude, form.value.longitude], { draggable: true }).addTo(map);

  marker.on('dragend', function () {
    const position = marker.getLatLng();
    form.value.latitude = position.lat.toFixed(6);
    form.value.longitude = position.lng.toFixed(6);
  });
};

// Fitur Deteksi Lokasi Browser
const getLocation = () => {
  locationError.value = '';
  if (!navigator.geolocation) {
    locationError.value = 'Browser Anda tidak mendukung deteksi lokasi.';
    return;
  }

  isDetecting.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      form.value.latitude = lat.toFixed(6);
      form.value.longitude = lng.toFixed(6);

      const newLatLng = new L.LatLng(lat, lng);
      marker.setLatLng(newLatLng);
      map.setView(newLatLng, 16); 
      
      isDetecting.value = false;
    },
    (error) => {
      isDetecting.value = false;
      switch(error.code) {
        case error.PERMISSION_DENIED:
          locationError.value = "Anda menolak izin akses lokasi.";
          break;
        case error.POSITION_UNAVAILABLE:
          locationError.value = "Informasi lokasi tidak tersedia.";
          break;
        case error.TIMEOUT:
          locationError.value = "Waktu permintaan lokasi habis.";
          break;
        default:
          locationError.value = "Terjadi kesalahan yang tidak diketahui.";
          break;
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

// Fungsi mengambil data dari backend
const fetchProfile = async () => {
  try {
    const response = await api.get('/student/profile');
    if (response.data && response.data.nama_lengkap) {
      
      if (response.data.tanggal_lahir) {
        response.data.tanggal_lahir = response.data.tanggal_lahir.split('T')[0];
      }

      form.value = { ...form.value, ...response.data };
      
      if (response.data.latitude && response.data.longitude) {
        const latLng = new L.LatLng(response.data.latitude, response.data.longitude);
        marker.setLatLng(latLng);
        map.setView(latLng, 15);
      }
    }
  } catch (error) {
    // Hanya cetak error di console JIKA error-nya bukan 404 (Belum isi biodata)
    if (error.response && error.response.status !== 404) {
      console.error("Gagal mengambil profil:", error);
    }
  }
};

// Simpan Data menggunakan Toast Promise
const handleSave = async () => {
  isLoading.value = true;

  toast.promise(api.put('/student/profile', form.value), {
    loading: 'Menyimpan biodata dan titik koordinat...',
    success: () => {
      isLoading.value = false;
      emit('saved'); // Kirim sinyal ke Dashboard agar checklist jadi hijau
      return 'Biodata berhasil disimpan!';
    },
    error: (err) => {
      isLoading.value = false;
      return err.response?.data?.message || 'Gagal menyimpan biodata';
    }
  });
};

onMounted(() => {
  setTimeout(() => {
    initMap();
    fetchProfile();
  }, 100);
});
</script>