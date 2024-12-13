<template>
  <div class="container mt-5">
    <div v-if="authStore.isAuthenticated" class="mb-3">
      <button class="btn btn-primary" @click="createTopic">Create Topic</button>
    </div>
    <div class="row">
      <div
        v-for="topic in topics"
        :key="topic.id"
        class="col-md-4 mb-4"
        v-bind:class="{ 'animate__animated animate__fadeIn': true }"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ topic.title }}</h5>
            <p class="card-text">{{ topic.description }}</p>
            <div v-if="authStore.isAuthenticated">
              <button
                v-if="authStore.user.id === topic.creatorId || authStore.user.role === 'admin'"
                class="btn btn-warning"
                @click="editTopic(topic.id)"
              >
                Edit
              </button>
              <button
                v-if="authStore.user.id === topic.creatorId || authStore.user.role === 'admin'"
                class="btn btn-danger"
                @click="deleteTopic(topic.id)"
              >
                Delete
              </button>
            </div>
            <button v-else class="btn btn-primary" @click="viewTopic(topic.id)">View Topic</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { forumService } from '@/services/api'

const authStore = useAuthStore()
const topics = ref([])

const fetchLatestTopics = async () => {
  try {
    const response = await forumService.getLatestTopics()
    topics.value = response.data
  } catch (error) {
    console.error('Error fetching latest topics:', error)
  }
}

const createTopic = () => {
  // Logic to create a new topic
}

const editTopic = (/* topicId */) => {
  // Logic to edit a topic
}

const deleteTopic = (/* topicId */) => {
  // Logic to delete a topic
}

const viewTopic = (/* topicId */) => {
  // Logic to view a topic
}

onMounted(() => {
  fetchLatestTopics()
})
</script>

<style>
/* @import 'animate.css'; */

.card {
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}
</style>
