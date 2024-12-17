import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/topics',
      name: 'topics',
      component: () => import('../views/TopicsView.vue'),
    },
    {
      path: '/topics/create',
      name: 'create-topic',
      component: () => import('../views/CreateTopic.vue'),
    },
    {
      path: '/topics/:topicId/edit',
      name: 'edit-topic',
      component: () => import('../views/EditTopic.vue'),
    },
    {
      path: '/topics/:topicId/threads',
      name: 'threads',
      component: () => import('../views/ThreadsView.vue'),
    },
    {
      path: '/topics/:topicId/threads/create',
      name: 'create-thread',
      component: () => import('../views/CreateThread.vue'),
    },
    {
      path: '/topics/:topicId/threads/:threadId/edit',
      name: 'edit-thread',
      component: () => import('../views/EditThread.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
