import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    setAuth(refreshToken) {
      const { cookies } = useCookies()
      this.isLoggedIn = true
      // Store refresh token in HTTP-only cookie
      cookies.set('refresh_token', refreshToken, '7d', '/', '', true)
    },

    clearAuth() {
      const { cookies } = useCookies()
      this.isLoggedIn = false
      cookies.remove('refresh_token')
    },
  },
})
