<template>
  <div class="flex h-screen bg-slate-50/50">
    <aside class="hidden w-64 bg-slate-900 md:flex md:flex-col">
      <div class="flex items-center h-16 px-6 border-b border-slate-800">
        <div class="flex items-center justify-center w-8 h-8 mr-3 bg-blue-600 rounded-lg">
          <span class="text-lg font-bold text-white">A</span>
        </div>
        <h1 class="text-lg font-bold tracking-tight text-white">Panel Admin</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <p class="px-4 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Menu Utama</p>
        <button 
          v-for="menu in menus" :key="menu.id"
          @click="activeTab = menu.id"
          :class="[
            'flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
            activeTab === menu.id 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <component :is="menu.icon" :class="['w-5 h-5 mr-3', activeTab === menu.id ? 'text-white' : 'text-slate-400']" />
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
          <h2 class="text-lg font-semibold text-slate-800 md:hidden">Panel Admin</h2>
          <div class="items-center hidden text-sm md:flex text-slate-500">
            <span>PPDB Mandiri</span>
            <span class="mx-2">/</span>
            <span class="font-medium capitalize text-slate-900">Admin {{ activeTab.replace('-', ' ') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <Button @click="handleLogout" variant="destructive" size="sm" class="flex items-center gap-2">
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      <main class="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto space-y-6">
          
          <div v-if="activeTab === 'beranda'" class="space-y-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex items-center justify-between space-y-2">
              <div>
                <h2 class="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                <p class="mt-1 text-sm text-slate-500">Pantau pergerakan data pendaftar secara real-time.</p>
              </div>
            </div>

            <div v-if="isLoading" class="text-center text-slate-500 py-10">Memuat data dashboard...</div>

            <div v-else class="space-y-6">
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6">
                  <div class="flex flex-row items-center justify-between pb-2">
                    <h3 class="tracking-tight text-sm font-medium">Total Pendaftar</h3>
                    <Users class="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div class="text-2xl font-bold">{{ stats?.cards?.totalPendaftar || 0 }}</div>
                    <p class="text-xs text-slate-500 mt-1">Siswa mengunci data</p>
                  </div>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6">
                  <div class="flex flex-row items-center justify-between pb-2">
                    <h3 class="tracking-tight text-sm font-medium">Siswa Diterima</h3>
                    <CheckCircle class="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-green-600">{{ stats?.cards?.totalDiterima || 0 }}</div>
                    <p class="text-xs text-slate-500 mt-1">Lolos seleksi</p>
                  </div>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6">
                  <div class="flex flex-row items-center justify-between pb-2">
                    <h3 class="tracking-tight text-sm font-medium">Menunggu Verifikasi</h3>
                    <Clock class="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-amber-500">{{ stats?.cards?.totalMenunggu || 0 }}</div>
                    <p class="text-xs text-slate-500 mt-1">Berkas perlu dicek</p>
                  </div>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm p-6">
                  <div class="flex flex-row items-center justify-between pb-2">
                    <h3 class="tracking-tight text-sm font-medium">Total Akun CPD</h3>
                    <LayoutDashboard class="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div class="text-2xl font-bold">{{ stats?.cards?.totalSiswa || 0 }}</div>
                    <p class="text-xs text-slate-500 mt-1">Semua akun terdaftar</p>
                  </div>
                </div>
              </div>

              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div class="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm col-span-4 p-6">
                  <div class="flex flex-col space-y-1.5 pb-4">
                    <h3 class="font-semibold leading-none tracking-tight">Overview Pendaftar</h3>
                    <p class="text-sm text-slate-500">Jumlah pendaftar masuk dalam 7 hari terakhir.</p>
                  </div>
                  <div class="pt-2">
                    <VueApexCharts 
                      v-if="chartOptions.xaxis.categories.length > 0"
                      type="bar" 
                      height="350" 
                      :options="chartOptions" 
                      :series="chartSeries" 
                    />
                    <div v-else class="flex h-[350px] items-center justify-center text-slate-400">
                      Belum ada data pendaftar minggu ini.
                    </div>
                  </div>
                </div>

                <div class="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm col-span-3 p-6">
                  <div class="flex flex-col space-y-1.5 pb-6 border-b border-slate-100 mb-4">
                    <h3 class="font-semibold leading-none tracking-tight">Pendaftar Terbaru</h3>
                    <p class="text-sm text-slate-500">5 CPD terakhir yang mendaftar.</p>
                  </div>
                  <div class="space-y-6">
                    <div v-for="reg in stats?.recentRegistrations" :key="reg.id" class="flex items-center">
                      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-900 font-bold text-sm border border-slate-200">
                        {{ reg.student?.nama_lengkap?.substring(0, 2).toUpperCase() || 'CP' }}
                      </div>
                      <div class="ml-4 space-y-1 flex-1">
                        <p class="text-sm font-medium leading-none">{{ reg.student?.nama_lengkap || 'Tanpa Nama' }}</p>
                        <p class="text-xs text-slate-500">No. Daftar: {{ reg.nomor_pendaftaran }}</p>
                      </div>
                      <div class="ml-auto font-medium text-xs">
                        <span :class="{
                          'bg-green-100 text-green-700 px-2 py-1 rounded-md': reg.status_pendaftaran === 'DITERIMA',
                          'bg-amber-100 text-amber-700 px-2 py-1 rounded-md': reg.status_pendaftaran === 'MENUNGGU VERIFIKASI',
                          'bg-red-100 text-red-700 px-2 py-1 rounded-md': reg.status_pendaftaran === 'DITOLAK'
                        }">
                          {{ reg.status_pendaftaran === 'MENUNGGU VERIFIKASI' ? 'MENUNGGU' : reg.status_pendaftaran }}
                        </span>
                      </div>
                    </div>
                    <div v-if="!stats?.recentRegistrations?.length" class="text-center text-sm text-slate-500 pt-4">
                      Belum ada data pendaftar.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'pendaftar'" class="space-y-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">Data Pendaftar Masuk</h2>
                <p class="mt-1 text-sm text-slate-500">Daftar calon peserta didik yang telah memfinalisasi pendaftaran.</p>
              </div>
              <div class="flex items-center gap-2">
                <Button @click="exportExcel" class="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2">
                  <Download class="w-4 h-4" /> Export Excel
                </Button>
                <Button @click="fetchData" variant="outline" size="sm" class="flex items-center gap-2 bg-white h-10">
                  <RefreshCw class="w-4 h-4" /> Segarkan
                </Button>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div class="flex-1 space-y-1">
                <label class="text-xs font-semibold text-slate-500 uppercase">Filter Status</label>
                <select v-model="filterStatus" class="w-full h-10 px-3 border border-slate-300 rounded-lg bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Semua Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="MENUNGGU VERIFIKASI">Menunggu Verifikasi</option>
                  <option value="DITERIMA">Diterima</option>
                  <option value="BERKAS TIDAK VALID">Berkas Tidak Valid / Ditolak</option>
                </select>
              </div>
              <div class="flex-1 space-y-1">
                <label class="text-xs font-semibold text-slate-500 uppercase">Filter Jalur</label>
                <select v-model="filterJalur" class="w-full h-10 px-3 border border-slate-300 rounded-lg bg-slate-50 text-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Semua Jalur</option>
                  <option value="ZONASI">Zonasi</option>
                  <option value="AFIRMASI">Afirmasi</option>
                  <option value="PRESTASI">Prestasi</option>
                  <option value="PINDAH_TUGAS">Pindah Tugas</option>
                </select>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-slate-600">
                  <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th class="px-6 py-4 font-medium w-16 text-center">No.</th>
                      <th class="px-6 py-4 font-medium">No. Pendaftaran</th>
                      <th class="px-6 py-4 font-medium">Nama CPD</th>
                      <th class="px-6 py-4 font-medium">Jalur</th>
                      <th class="px-6 py-4 font-medium">Status</th>
                      <th class="px-6 py-4 font-medium text-center">Aksi (Verifikasi)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoading" class="border-b border-slate-100">
                      <td colspan="6" class="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                    </tr>
                    <tr v-else-if="filteredRegistrations.length === 0" class="border-b border-slate-100">
                      <td colspan="6" class="px-6 py-8 text-center text-slate-500">Belum ada data pendaftar.</td>
                    </tr>
                    <tr v-else v-for="(reg, index) in paginatedRegistrations" :key="reg.id" class="border-b border-slate-100 hover:bg-slate-50">
                      <td class="px-6 py-4 text-center font-medium text-slate-900">
                        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                      </td>
                      <td class="px-6 py-4 font-semibold text-slate-900">{{ reg.nomor_pendaftaran }}</td>
                      <td class="px-6 py-4">{{ reg.student?.nama_lengkap || 'Belum isi biodata' }}</td>
                      <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700">
                          {{ reg.jalur_pendaftaran }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span :class="{
                          'bg-amber-100 text-amber-800': reg.status_pendaftaran === 'MENUNGGU VERIFIKASI',
                          'bg-green-100 text-green-800': reg.status_pendaftaran === 'DITERIMA',
                          'bg-red-100 text-red-800': reg.status_pendaftaran === 'DITOLAK' || reg.status_pendaftaran === 'BERKAS TIDAK VALID',
                          'bg-slate-100 text-slate-600': reg.status_pendaftaran === 'DRAFT'
                        }" class="px-2.5 py-1 text-xs font-bold rounded-full">
                          {{ reg.status_pendaftaran }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-center space-x-2 flex items-center justify-center">
                        <Button @click="openDocumentModal(reg)" variant="outline" size="sm" class="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 bg-white">
                          <Eye class="w-4 h-4 mr-1" /> Cek Berkas
                        </Button>
                        <template v-if="reg.status_pendaftaran === 'MENUNGGU VERIFIKASI'">
                          <Button @click="updateStatus(reg.id, 'DITERIMA')" size="sm" class="bg-green-600 hover:bg-green-700 h-8 px-3">
                            <Check class="w-4 h-4 mr-1" /> Terima
                          </Button>
                          <Button @click="updateStatus(reg.id, 'BERKAS TIDAK VALID')" size="sm" variant="destructive" class="h-8 px-3">
                            <X class="w-4 h-4 mr-1" /> Tolak
                          </Button>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="filteredRegistrations.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50 border-t border-slate-200">
                <span class="text-sm text-slate-500 font-medium">
                  Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredRegistrations.length) }} dari {{ filteredRegistrations.length }} data
                </span>
                <div class="flex items-center gap-2">
                  <Button @click="currentPage--" :disabled="currentPage === 1" variant="outline" size="sm" class="bg-white">Sebelumnya</Button>
                  <span class="text-sm font-medium text-slate-700 px-2">Hal {{ currentPage }} / {{ totalPages }}</span>
                  <Button @click="currentPage++" :disabled="currentPage === totalPages" variant="outline" size="sm" class="bg-white">Selanjutnya</Button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'pengaturan'" class="space-y-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Identitas Sekolah</h2>
              <p class="mt-1 text-sm text-slate-500">Sesuaikan informasi instansi yang akan tampil pada kop surat dan halaman utama PPDB.</p>
            </div>
            <form @submit.prevent="saveSchoolProfile" class="space-y-6 max-w-5xl">
              <div class="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div class="mb-6 pb-4 border-b border-slate-100">
                  <h3 class="text-lg font-bold text-slate-800">Informasi Dasar</h3>
                  <p class="text-sm text-slate-500">Nama dan alamat lengkap instansi pendidikan.</p>
                </div>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div class="flex flex-col space-y-2">
                    <Label for="namaSekolah" class="text-sm font-semibold text-slate-700">Nama Sekolah</Label>
                    <Input id="namaSekolah" v-model="schoolProfile.nama_sekolah" required placeholder="Contoh: SMPN 1" class="w-full bg-slate-50" />
                  </div>
                  <div class="flex flex-col space-y-2">
                    <Label for="tahunAjaran" class="text-sm font-semibold text-slate-700">Tahun Ajaran</Label>
                    <Input id="tahunAjaran" v-model="schoolProfile.tahun_ajaran" required placeholder="Contoh: 2026/2027" class="w-full bg-slate-50" />
                  </div>
                  <div class="flex flex-col space-y-2 md:col-span-2">
                    <Label for="alamatSekolah" class="text-sm font-semibold text-slate-700">Alamat Lengkap</Label>
                    <Textarea id="alamatSekolah" v-model="schoolProfile.alamat" required placeholder="Contoh: Jl. Lawu No. 123, Karanganyar, Jawa Tengah 57711" rows="3" class="w-full bg-slate-50 resize-none" />
                  </div>
                </div>
              </div>
              <div class="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div class="mb-6 pb-4 border-b border-slate-100">
                  <h3 class="text-lg font-bold text-slate-800">Kontak & Digital</h3>
                </div>
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div class="flex flex-col space-y-2">
                    <Label for="telepon" class="text-sm font-semibold text-slate-700">Nomor Telepon</Label>
                    <Input id="telepon" v-model="schoolProfile.telepon" required placeholder="Contoh: (0271) 123456" class="w-full bg-slate-50" />
                  </div>
                  <div class="flex flex-col space-y-2">
                    <Label for="email" class="text-sm font-semibold text-slate-700">Email Resmi</Label>
                    <Input id="email" v-model="schoolProfile.email" type="email" required placeholder="Contoh: info@smpn1kra.sch.id" class="w-full bg-slate-50" />
                  </div>
                  <div class="flex flex-col space-y-2 md:col-span-2">
                    <Label for="website" class="text-sm font-semibold text-slate-700">Website Sekolah</Label>
                    <Input id="website" v-model="schoolProfile.website" required placeholder="Contoh: www.smpn1kra.sch.id" class="w-full bg-slate-50" />
                  </div>
                </div>
              </div>
              <div class="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div class="mb-6 pb-4 border-b border-slate-100">
                  <h3 class="text-lg font-bold text-slate-800">Identitas Visual</h3>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 border border-slate-200 rounded-xl bg-slate-50">
                  <div class="flex-shrink-0 w-28 h-28 bg-white border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center p-2 relative shadow-sm">
                    <img v-if="schoolProfile.logo_url" :src="baseURL + '/' + schoolProfile.logo_url" class="w-full h-full object-contain" alt="Logo Sekolah" />
                    <div v-else class="text-slate-400 flex flex-col items-center">
                      <UploadCloud class="w-8 h-8 mb-2 opacity-50" />
                      <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kosong</span>
                    </div>
                  </div>
                  <div class="flex-1 space-y-3 w-full">
                    <Label for="logoFile" class="text-sm font-semibold text-slate-700">Unggah Logo Baru</Label>
                    <Input id="logoFile" type="file" @change="handleLogoChange" accept="image/png, image/jpeg" class="w-full max-w-sm cursor-pointer bg-white" />
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end gap-4 pt-4">
                <Button type="button" variant="outline" @click="fetchData" class="bg-white">Batal</Button>
                <Button type="submit" :disabled="isSavingSetting" class="bg-blue-600 hover:bg-blue-700 min-w-[160px] shadow-md">
                  {{ isSavingSetting ? 'Menyimpan...' : 'Simpan Pengaturan' }}
                </Button>
              </div>
            </form>
          </div>

          <div v-if="activeTab === 'pengguna'" class="space-y-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-slate-900">Manajemen Panitia (Admin)</h2>
              <p class="mt-1 text-sm text-slate-500">Kelola akun yang memiliki akses penuh ke Panel Admin PPDB.</p>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm lg:col-span-1">
                <h3 class="text-lg font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">Tambah Admin Baru</h3>
                <form @submit.prevent="submitNewAdmin" class="space-y-4">
                  <div class="space-y-2">
                    <Label for="adminEmail">Alamat Email</Label>
                    <Input id="adminEmail" type="email" v-model="newAdmin.email" required placeholder="admin.baru@sekolah.com" class="bg-slate-50" />
                  </div>
                  <div class="space-y-2">
                    <Label for="adminPassword">Password (Min. 6 Karakter)</Label>
                    <Input id="adminPassword" type="password" v-model="newAdmin.password" required minlength="6" placeholder="••••••••" class="bg-slate-50" />
                  </div>
                  <Button type="submit" :disabled="isSubmittingAdmin" class="w-full bg-blue-600 hover:bg-blue-700">
                    {{ isSubmittingAdmin ? 'Menyimpan...' : 'Buat Akun Admin' }}
                  </Button>
                </form>
              </div>
              <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:col-span-2">
                <table class="w-full text-sm text-left text-slate-600">
                  <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th class="px-6 py-4 font-medium">Alamat Email</th>
                      <th class="px-6 py-4 font-medium">Tgl Terdaftar</th>
                      <th class="px-6 py-4 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                     <tr v-if="isLoadingAdmins" class="border-b border-slate-100">
                      <td colspan="3" class="px-6 py-8 text-center text-slate-500">Memuat data admin...</td>
                    </tr>
                    <tr v-else-if="admins.length === 0" class="border-b border-slate-100">
                      <td colspan="3" class="px-6 py-8 text-center text-slate-500">Belum ada data admin.</td>
                    </tr>
                    <tr v-else v-for="admin in admins" :key="admin.id" class="border-b border-slate-100 hover:bg-slate-50">
                      <td class="px-6 py-4 font-semibold text-slate-900">{{ admin.email }}</td>
                      <td class="px-6 py-4">{{ new Date(admin.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</td>
                      <td class="px-6 py-4 text-center">
                        <Button @click="deleteAdmin(admin.id, admin.email)" variant="destructive" size="sm" class="h-8 shadow-none bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                          Hapus Akun
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
        <div class="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 pb-4">
            <p>&copy; 2026 PPDB Mandiri. All rights reserved.</p>
            <p class="mt-1">Dikembangkan oleh <a href="https://abimantra.my.id" target="_blank" class="font-medium text-blue-600 hover:text-blue-800 transition-colors">abimantra.my.id</a></p>
          </div>
      </main>
    </div>

    <Dialog v-model:open="isModalOpen">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Berkas Persyaratan: {{ selectedReg?.student?.nama_lengkap }}</DialogTitle>
          <DialogDescription>
            Jalur: <span class="font-semibold">{{ selectedReg?.jalur_pendaftaran }}</span> | 
            Status: <span class="font-semibold">{{ selectedReg?.status_pendaftaran }}</span>
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          <div v-if="!selectedReg?.documents?.length" class="p-6 text-center text-slate-500 border-2 border-dashed rounded-xl">
            Siswa ini belum mengunggah berkas satupun.
          </div>
          <div v-else v-for="doc in selectedReg.documents" :key="doc.id" class="flex items-center justify-between p-4 border rounded-xl bg-slate-50 border-slate-200">
            <div>
              <p class="font-semibold text-slate-800">{{ formatJenisDokumen(doc.jenis_dokumen) }}</p>
              <p v-if="doc.tanggal_terbit" class="text-xs text-slate-500 mt-0.5">📅 Tgl Terbit: {{ doc.tanggal_terbit }}</p>
            </div>
            <a :href=" baseURL + '/' + doc.file_url" target="_blank" class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
              <ExternalLink class="w-4 h-4 mr-1.5" /> Buka File
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import { toast } from 'vue-sonner';

// IMPORT LIBRARY GRAFIK BARU
import VueApexCharts from 'vue3-apexcharts';

// Import UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

// Import Icons
import { 
  LayoutDashboard, Users, Clock, CheckCircle, XCircle, 
  LogOut, Menu, RefreshCw, Check, X, ClipboardList,
  Eye, ExternalLink, Settings, UploadCloud, Download, UserCog
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const isMobileMenuOpen = ref(false);
const activeTab = ref('beranda');
const isLoading = ref(false);

const stats = ref(null); // Diubah jadi null untuk menampung format data baru dari backend
const registrations = ref([]);

// ==========================================
// KONFIGURASI GRAFIK APEXCHARTS
// ==========================================
const chartSeries = ref([{ name: 'Pendaftar', data: [] }]);
const chartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#0f172a'], // Warna hitam slate-900 khas Shadcn
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: '40%' }
  },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  xaxis: {
    categories: [],
    labels: { style: { colors: '#64748b', fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { style: { colors: '#64748b', fontSize: '12px' }, formatter: (val) => Math.floor(val) }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } }
  },
  tooltip: { theme: 'light' }
});


// ==========================================
// RADAR TAB MENU
// ==========================================
watch(activeTab, (tabBaru) => {
  if (tabBaru === 'pengguna') {
    fetchAdmins();
  } else if (tabBaru === 'pendaftar' || tabBaru === 'beranda') {
    fetchData();
  }
});

// ==========================================
// FITUR FILTER & PAGINATION
// ==========================================
const filterStatus = ref('');
const filterJalur = ref('');
const currentPage = ref(1);
const itemsPerPage = 20;

const filteredRegistrations = computed(() => {
  return registrations.value.filter(reg => {
    const matchStatus = filterStatus.value ? reg.status_pendaftaran === filterStatus.value : true;
    const matchJalur = filterJalur.value ? reg.jalur_pendaftaran === filterJalur.value : true;
    return matchStatus && matchJalur;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredRegistrations.value.length / itemsPerPage) || 1;
});

const paginatedRegistrations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRegistrations.value.slice(start, end);
});

watch([filterStatus, filterJalur], () => {
  currentPage.value = 1;
});

const baseURL = import.meta.env.VITE_BASE_URL;

// State Pengaturan Sekolah & Modal
const schoolProfile = ref({
  nama_sekolah: '', alamat: '', telepon: '', email: '', website: '', logo_url: '', tahun_ajaran: ''
});
const logoFile = ref(null);
const isSavingSetting = ref(false);
const isModalOpen = ref(false);
const selectedReg = ref(null);

const menus = [
  { id: 'beranda', label: 'Dashboard Utama', icon: LayoutDashboard },
  { id: 'pendaftar', label: 'Data Pendaftar', icon: ClipboardList },
  { id: 'pengguna', label: 'Manajemen Admin', icon: UserCog },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

const fetchData = async () => {
  isLoading.value = true;
  try {
    const statRes = await api.get('/admin/stats');
    stats.value = statRes.data;

    // Isi data ke Grafik jika ada
    if (statRes.data.chartData?.categories?.length) {
      chartOptions.value.xaxis.categories = statRes.data.chartData.categories;
      chartSeries.value = [{ name: 'Pendaftar', data: statRes.data.chartData.series }];
    }

    const regRes = await api.get('/admin/registrations');
    registrations.value = regRes.data;

    const schoolRes = await api.get('/settings/school');
    schoolProfile.value = schoolRes.data;
  } catch (error) {
    toast.error('Gagal mengambil data dari server');
  } finally {
    isLoading.value = false;
  }
};

// ==========================================
// STATE MANAJEMEN ADMIN
// ==========================================
const admins = ref([]);
const newAdmin = ref({ email: '', password: '' });
const isSubmittingAdmin = ref(false);
const isLoadingAdmins = ref(true);

const fetchAdmins = async () => {
  isLoadingAdmins.value = true;
  try {
    const res = await api.get('/admin/users');
    admins.value = res.data;
  } catch (error) {
    console.error('Gagal memuat data admin', error);
  } finally {
    isLoadingAdmins.value = false;
  }
};

const submitNewAdmin = async () => {
  if (newAdmin.value.password.length < 6) return toast.error('Password minimal 6 karakter!');
  isSubmittingAdmin.value = true;
  
  toast.promise(api.post('/admin/users', newAdmin.value), {
    loading: 'Menambahkan admin baru...',
    success: () => {
      isSubmittingAdmin.value = false;
      newAdmin.value = { email: '', password: '' };
      fetchAdmins();
      return 'Akun Admin berhasil ditambahkan!';
    },
    error: (err) => {
      isSubmittingAdmin.value = false;
      return err.response?.data?.message || 'Gagal menambahkan admin.';
    }
  });
};

const deleteAdmin = async (id, email) => {
  if (!confirm(`YAKIN INGIN MENGHAPUS ADMIN: ${email}? Aksi ini tidak dapat dibatalkan.`)) return;
  
  toast.promise(api.delete(`/admin/users/${id}`), {
    loading: 'Menghapus admin...',
    success: () => {
      fetchAdmins();
      return 'Admin berhasil dihapus.';
    },
    error: (err) => err.response?.data?.message || 'Gagal menghapus admin.'
  });
};

// Fungsi Export & Update Status
const exportExcel = async () => {
  toast.promise(api.get('/admin/export', { responseType: 'blob' }), {
    loading: 'Menyiapkan file Excel...',
    success: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Data_Pendaftar_PPDB_${new Date().getFullYear()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return 'Data pendaftar berhasil diunduh!';
    },
    error: 'Gagal mengunduh file Excel.'
  });
};

const updateStatus = async (id, statusBaru) => {
  if (!confirm(`Yakin ingin mengubah status pendaftar ini menjadi ${statusBaru}?`)) return;
  toast.promise(api.put(`/admin/registration/${id}/status`, { status_pendaftaran: statusBaru }), {
    loading: 'Memperbarui status...',
    success: () => { fetchData(); return `Status berhasil diubah menjadi ${statusBaru}`; },
    error: 'Gagal memperbarui status'
  });
};

const handleLogoChange = (event) => logoFile.value = event.target.files[0];

const saveSchoolProfile = async () => {
  isSavingSetting.value = true;
  const formData = new FormData();
  formData.append('nama_sekolah', schoolProfile.value.nama_sekolah);
  formData.append('alamat', schoolProfile.value.alamat);
  formData.append('telepon', schoolProfile.value.telepon);
  formData.append('email', schoolProfile.value.email);
  formData.append('website', schoolProfile.value.website);
  formData.append('tahun_ajaran', schoolProfile.value.tahun_ajaran);
  if (logoFile.value) formData.append('logo', logoFile.value);

  toast.promise(api.put('/admin/settings/school', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }), {
    loading: 'Menyimpan pengaturan...',
    success: (res) => {
      isSavingSetting.value = false;
      schoolProfile.value = res.data.profile;
      logoFile.value = null; 
      const fileInput = document.getElementById('logoFile');
      if(fileInput) fileInput.value = '';
      return 'Pengaturan sekolah berhasil disimpan!';
    },
    error: () => {
      isSavingSetting.value = false;
      return 'Gagal menyimpan pengaturan.';
    }
  });
};

const openDocumentModal = (reg) => {
  selectedReg.value = reg;
  isModalOpen.value = true;
};

const formatJenisDokumen = (jenis) => {
  const mapDokumen = {
    'KK': 'Kartu Keluarga', 'AKTA_LAHIR': 'Akta Kelahiran', 'IJAZAH_SKL': 'Ijazah / SKL',
    'RAPOR': 'Nilai Rapor', 'PAS_FOTO': 'Pas Foto', 'SPTJM': 'Surat Pernyataan (SPTJM)',
    'KIP_AFIRMASI': 'Kartu KIP/PKH', 'PIAGAM': 'Piagam Prestasi', 'SK_PINDAH': 'SK Pindah Tugas'
  };
  return mapDokumen[jenis] || jenis;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

let socket;
onMounted(() => {
  fetchData();
  socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:5009');
  socket.on('connect', () => console.log('✅ SOCKET BERHASIL TERHUBUNG!'));
  socket.on('connect_error', (err) => console.error('❌ SOCKET ERROR:', err.message));

  socket.on('new_registration', (data) => {
    toast.success(`Pendaftar Baru: ${data.nomor_pendaftaran}`, {
      description: data.message,
      duration: 6000, 
    });
    setTimeout(() => fetchData(), 1000);
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});
</script>