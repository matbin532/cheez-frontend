import api from './api'

export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users', userData),
  getProfile: () => api.get('/users/profile'),
}
