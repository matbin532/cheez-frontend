<script setup>
import { /* RouterLink,  */ RouterView /* useRouter */ } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TheNavbar from './components/TheNavbar.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<template>
  <header>
    <TheNavbar />
    <main class="main-content">
      <RouterView />
    </main>
  </header>
</template>

<style scoped>
.main-content {
  padding-top: 56px;
  min-height: 100vh;
}
</style>
