<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'

const router = useRouter()
const authStore = useAuthStore()

if (authStore.isAuthenticated) {
  router.push('/')
}

const credentials = ref({
  username: '',
  password: '',
})

const errorMessage = ref('')

const login = async () => {
  try {
    const response = await authService.login(credentials.value)
    const refreshToken = response.data.refresh_token
    authStore.setAuth(refreshToken)
    router.push('/')
  } catch (error) {
    error.value = 'Invalid credentials'
    errorMessage.value = "Invalid username or password."
  }
}
</script>

<template>
  <body class="text-center">
    <form class="form-signin" @submit.prevent="login">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
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
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        v-model="credentials.password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required=""
      />
      <div class="checkbox mb-3">
        <label> <input type="checkbox" value="remember-me" /> Remember me </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </form>
  </body>
</template>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type='text'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
