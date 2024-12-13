import { defineStore } from 'pinia'
import { authService } from '@/services/auth'
import { useCookies } from 'vue3-cookies'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    async initializeAuth() {
      const { cookies } = useCookies()
      const refreshToken = cookies.get('refresh_token')

      if (refreshToken) {
        this.isLoggedIn = true
        this.token = refreshToken
        await this.fetchUserProfile()
      }
    },

    setAuth(refreshToken) {
      const { cookies } = useCookies()
      this.isLoggedIn = true
      cookies.set('refresh_token', refreshToken, '7d', '/', '', true)
      this.token = refreshToken
      this.fetchUserProfile()
    },

    clearAuth() {
      const { cookies } = useCookies()
      this.token = null
      this.isLoggedIn = false
      this.user = null
      cookies.remove('refresh_token')
    },

    async fetchUserProfile() {
      const { cookies } = useCookies()
      const refreshToken = cookies.get('refresh_token')

      if (!refreshToken) {
        this.clearAuth()
        return
      }

      try {
        const response = await authService.getProfile()
        this.user = response.data
      } catch (error) {
        if (error.response.status === 401) {
          this.clearAuth()
        }
        console.error('Error fetching user profile:', error)
      }
    },
  },
})
