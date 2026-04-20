import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: { title: 'Login - PPDB Mandiri' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
      meta: { title: 'Daftar Akun - PPDB Mandiri' }
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('../views/auth/VerifyEmail.vue'),
      meta: { requiresAuth: false, title: 'Verifikasi Email - PPDB Mandiri' }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPassword.vue'),
      meta: { requiresAuth: false, title: 'Lupa Password - PPDB Mandiri' }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPassword.vue'),
      meta: { requiresAuth: false, title: 'Reset Password - PPDB Mandiri' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/cpd/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'CPD', title: 'Dashboard Pendaftaran' }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'ADMIN', title: 'Panel Admin - PPDB Mandiri' }
    }
  ]
});

// Navigation Guard (Satpam Rute)
router.beforeEach((to, from) => {
  document.title = to.meta.title || 'PPDB Mandiri';
  const authStore = useAuthStore();
  
  // 1. Jika butuh login TAPI user belum login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login';
  }

  // 2. Jika sudah login TAPI role-nya tidak cocok dengan halaman yang dituju
  if (to.meta.requiresAuth && authStore.user.role !== to.meta.role) {
    // Lemparkan ke dashboard yang sesuai dengan role-nya
    if (authStore.user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard'; // default ke dashboard CPD
  }

  // 3. Jika sudah login TAPI mencoba mengakses halaman /login atau /register
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    if (authStore.user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  }
  
  // Jika semua aman, izinkan lewat
  return true; 
});

export default router;