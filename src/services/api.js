import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useCookies } from 'vue3-cookies'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const forumService = {
  getUsers: () => api.get('/users'),
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, data) => api.put(`/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  logout: () => api.post('/users/logout'),

  getTopics: () => api.get('/topics'),
  getLatestTopics: () => api.get('/topics/latest'),
  getTopic: (topicId) => api.get(`/topics/${topicId}`),
  createTopic: (data) => api.post('/topics', data),
  updateTopic: (topicId, data) => api.put(`/topics/${topicId}`, data),
  deleteTopic: (topicId) => api.delete(`/topics/${topicId}`),

  getThreads: (topicId) => api.get(`/topics/${topicId}/threads`),
  getThread: (topicId, threadId) => api.get(`/topics/${topicId}/threads/${threadId}`),
  createThread: (topicId, data) => api.post(`/topics/${topicId}/threads`, data),
  updateThread: (topicId, threadId, data) =>
    api.put(`/topics/${topicId}/threads/${threadId}`, data),
  deleteThread: (topicId, threadId) => api.delete(`/topics/${topicId}/threads/${threadId}`),

  getPosts: (topicId, threadId) => api.get(`/topics/${topicId}/threads/${threadId}/posts`),
  getPost: (topicId, threadId, postId) =>
    api.get(`/topics/${topicId}/threads/${threadId}/posts/${postId}`),
  createPost: (topicId, threadId, data) =>
    api.post(`/topics/${topicId}/threads/${threadId}/posts`, data),
  updatePost: (topicId, threadId, postId, data) =>
    api.put(`/topics/${topicId}/threads/${threadId}/posts/${postId}`, data),
  deletePost: (topicId, threadId, postId) =>
    api.delete(`/topics/${topicId}/threads/${threadId}/posts/${postId}`),
}

api.interceptors.request.use((config) => {
  const { cookies } = useCookies()
  const refreshToken = cookies.get('refresh_token')

  if (refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
