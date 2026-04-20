<template>
  <RouterView />
  <Toaster position="top-right" rich-colors />
</template>

<script setup>
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css'
</script>