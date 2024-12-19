<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { forumService } from '@/services/api'
import { useRouter } from 'vue-router'

const topics = ref([])
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const creatorNames = ref({})
const fetchTopics = async () => {
  try {
    const response = await forumService.getTopics()
    topics.value = response.data
    topics.value.forEach((topic) => getCreatorName(topic))
  } catch (error) {
    console.error('Error fetching topics:', error)
    router.push('/error')
  } finally {
    loading.value = false
  }
}

const deleteTopic = async (topicId) => {
  if (confirm('Are you sure you want to delete this topic?')) {
    try {
      await forumService.deleteTopic(topicId)
      topics.value = topics.value.filter((topic) => topic.topicID !== topicId)
    } catch (error) {
      console.error('Error deleting topic:', error)
    }
  }
}

const canModifyTopic = (topic) => {
  return (
    authStore.isAuthenticated && (authStore.user?.isAdmin || authStore.user?.userID === topic.creatorId)
  )
}
const getCreatorName = async (topic) => {
  try {
    const response = await forumService.getUser(topic.creatorId)
    creatorNames.value[topic.topicID] = response.data.username
  } catch (error) {
    console.error('Error fetching creator name:', error)
    creatorNames.value[topic.topicID] = 'Unknown'
  }
}

onMounted(() => {
  fetchTopics()
})
</script>

<template>
  <div class="container mt-4 pt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Topics</h2>
      <button
        v-if="authStore.isAuthenticated"
        @click="router.push('/topics/create')"
        class="btn btn-primary"
      >
        Create Topic
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="row g-4 text-start">
      <div v-for="(topic, index) in topics" :key="topic.topicID" class="col-md-6 col-lg-4">
        <div class="card h-100 topic-card" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="card-body">
            <small class="text-muted"
              >Created by: {{ creatorNames[topic.topicID] || 'Loading...' }}</small
            >
            <p class="card-text">{{ topic.title }}</p>
            <p class="card-text small">{{ topic.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <template v-if="canModifyTopic(topic)">
                  <button
                    @click="router.push(`/topics/${topic.topicID}/edit`)"
                    class="btn btn-sm btn-outline-secondary"
                  >
                    Edit
                  </button>
                  <button @click="deleteTopic(topic.topicID)" class="btn btn-sm btn-outline-danger">
                    Delete
                  </button>
                </template>
                <button
                  @click="router.push(`/topics/${topic.topicID}/threads`)"
                  class="btn btn-sm btn-outline-primary"
                >
                  View Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topic-card {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  transition: transform 0.2s;
}

.topic-card:hover {
  transform: translateY(-5px);
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

:root {
  --navbar-height: 56px;
}

.container {
  min-height: calc(100vh - var(--navbar-height));
}
</style>
