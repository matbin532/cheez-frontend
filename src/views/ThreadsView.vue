<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { forumService } from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)
const threads = ref([])
const topic = ref(null)
const creatorNames = ref({})

const fetchThreads = async () => {
  try {
    const topicResponse = await forumService.getTopic(route.params.topicId)
    topic.value = topicResponse.data

    const threadsResponse = await forumService.getThreads(route.params.topicId)
    threads.value = threadsResponse.data
    threads.value.forEach((thread) => getCreatorName(thread))
  } catch (error) {
    console.error('Error fetching threads:', error)
    error.value = 'Failed to load threads'
  } finally {
    loading.value = false
  }
}

const getCreatorName = async (thread) => {
  try {
    const response = await forumService.getUser(thread.creatorId)
    creatorNames.value[thread.creatorId] = response.data.username
  } catch (error) {
    console.error('Error fetching creator name:', error)
    creatorNames.value[thread.creatorId] = 'Unknown'
  }
}

const deleteThread = async (threadId) => {
  if (confirm('Are you sure you want to delete this thread?')) {
    try {
      await forumService.deleteThread(route.params.topicId, threadId)
      threads.value = threads.value.filter((thread) => thread.threadID !== threadId)
    } catch (error) {
      console.error('Error deleting thread:', error)
    }
  }
}

onMounted(fetchThreads)
</script>

<template>
  <div class="container mt-4 pt-4">
    <div v-if="topic" class="mb-4">
      <h2>{{ topic.title }}</h2>
      <p class="text-muted">{{ topic.description }}</p>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Threads</h3>
      <button
        v-if="authStore.isAuthenticated"
        @click="router.push(`/topics/${route.params.topicId}/threads/create`)"
        class="btn btn-primary"
      >
        Create Thread
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="row g-4">
      <div v-for="(thread, index) in threads" :key="thread.threadID" class="col-12">
        <div class="card thread-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="card-title">{{ thread.title }}</h5>
                <small class="text-muted">Created by {{ creatorNames[thread.creatorId] }}</small>
              </div>
              <div class="btn-group">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="
                    router.push(`/topics/${route.params.topicId}/threads/${thread.threadID}/posts`)
                  "
                >
                  View Thread
                </button>
                <template
                  v-if="
                    authStore.user?.userID === thread.creatorId || authStore.user?.isAdmin === true
                  "
                >
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="
                      router.push(`/topics/${route.params.topicId}/threads/${thread.threadID}/edit`)
                    "
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteThread(thread.threadID)"
                  >
                    Delete
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thread-card {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
