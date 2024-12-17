<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { forumService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const store = useAuthStore()

if (!store.isAuthenticated) {
  router.push('/login')
}

const topic = ref({
  title: '',
  description: '',
})

const fetchTopic = async () => {
  try {
    const response = await forumService.getTopic(route.params.topicId)
    topic.value = response.data
  } catch (err) {
    error.value = 'Failed to load topic'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const updateTopic = async () => {
  saving.value = true
  try {
    await forumService.updateTopic(route.params.topicId, {
      title: topic.value.title,
      description: topic.value.description,
    })
    router.push('/topics')
  } catch (err) {
    error.value = 'Failed to update topic'
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchTopic)
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Edit Topic</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <form v-else @submit.prevent="updateTopic" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="topic.title"
          required
          minlength="3"
        />
        <div class="invalid-feedback">Title is required</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          class="form-control"
          id="description"
          v-model="topic.description"
          rows="3"
          required
          minlength="10"
        ></textarea>
        <div class="invalid-feedback">Description is required</div>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
          Save Changes
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="router.push('/topics')"
          :disabled="saving"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
