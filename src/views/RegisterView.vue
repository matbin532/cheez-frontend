<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthStore()

if (store.isAuthenticated) {
  router.push('/')
}

const credentials = ref({
  username: '',
  email: '',
  password: '',
})

const errorMessage = ref('')

const register = async () => {
  try {
    await authService.register(credentials.value)
    router.push('/login')
  } catch (error) {
    console.error(error)
    if (error.response.status === 409) {
      errorMessage.value = 'Username and/or email already exist.'
      return
    }
    errorMessage.value = 'Failed to register'
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
        placeholder="Type in a fake email here"
        required=""
      />
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        v-model="credentials.password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="At least 8 characters"
        required=""
      />
      <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </form>
  </body>
</template>
