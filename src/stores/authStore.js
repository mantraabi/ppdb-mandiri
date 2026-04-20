import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isCpd: (state) => state.user?.role === 'CPD',
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Gagal login';
      }
    },
    async register(nik, email, password) {
      try {
        const response = await api.post('/auth/register', { nik, email, password });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Gagal registrasi';
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});