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
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfile.vue'),
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
      path: '/topics/:topicId/threads/:threadId/posts',
      name: 'posts',
      component: () => import('../views/PostsView.vue'),
    },
    {
      path: '/topics/:topicId/threads/:threadId/posts/:postId/edit',
      name: 'edit-post',
      component: () => import('../views/EditPost.vue'),
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../views/NotFound.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }

  if (!to.matched.length) {
    router.push({ name: '404' })
  } else {
    next()
  }
})

export default router
