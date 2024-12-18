<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'
import { useRouter } from 'vue-router'

if (useAuthStore().isAuthenticated) {
  useRouter().push('/')
}

const credentials = ref({
  username: '',
  email: '',
  password: '',
})

const register = async () => {
  try {
    await authService.register(credentials.value)
    useRouter().push('/login')
  } catch (error) {
    console.error(error)
    useRouter().push('/error')
  }
}
</script>

<template>
  <body class="text-center">
    <form class="form-signin" @submit.prevent="register">
      <h1 class="h3 mb-3 font-weight-normal">Register</h1>
      <label for="inputUsername" class="sr-only">Username</label>
      <input
        v-model="credentials.username"
        type="text"
        id="inputUsername"
        class="form-control"
        placeholder="Username"
        required=""
        autofocus=""
      />
      <label for="inputEmail" class="sr-only">Email address</label>
      <input
        v-model="credentials.email"
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required=""
      />
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        v-model="credentials.password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required=""
      />
      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
    </form>
  </body>
</template>
