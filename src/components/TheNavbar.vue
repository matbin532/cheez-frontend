<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.clearAuth()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Cheezburger</RouterLink>
      <RouterLink class="nav-link" to="/topics">Topics</RouterLink>
      <!-- spacer-->
      <div class="flex-grow-1"></div>

      <template v-if="authStore.user?.isAdmin">
        <div class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
            Admin
          </a>
          <ul class="dropdown-menu">
            <li><RouterLink class="dropdown-item" to="/admin/users">User list</RouterLink></li>
          </ul>
        </div>
      </template>

      <div class="navbar-nav ms-auto">
        <template v-if="authStore.isAuthenticated">
          <div class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <img
                :src="authStore.user?.pfP_URL || 'https://via.placeholder.com/48'"
                class="img-thumbnail me-2"
                width="48"
                height="48"
                alt="Profile"
              />
              <span>{{ authStore.user?.username }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink class="dropdown-item" to="/profile">Profile</RouterLink></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#" @click.prevent="logout">Sign out</a></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <RouterLink class="nav-link" to="/login">Sign in</RouterLink>
          <RouterLink class="nav-link" to="/register">Sign up</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
