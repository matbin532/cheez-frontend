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
      <!-- Left side -->
      <RouterLink class="navbar-brand" to="/">Cheezburger</RouterLink>

      <!-- Right side -->
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
                src="https://via.placeholder.com/32"
                class="rounded-circle me-2"
                width="32"
                height="32"
                alt="Profile"
              />
              <span>Username</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink class="dropdown-item" to="/profile">Profile</RouterLink></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <RouterLink class="nav-link" to="/login">Login</RouterLink>
          <RouterLink class="nav-link" to="/register">Register</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
