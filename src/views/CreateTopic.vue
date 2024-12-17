<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { forumService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const store = useAuthStore()
const error = ref(null)
const saving = ref(false)
const topic = ref({
  title: '',
  description: '',
})

if (!store.isAuthenticated) {
  router.push('/login')
}

const createTopic = async () => {
  saving.value = true
  try {
    await forumService.createTopic({
      title: topic.value.title,
      description: topic.value.description,
    })
    router.push('/topics')
  } catch (err) {
    error.value = 'Failed to create topic'
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Create Topic</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <form @submit.prevent="createTopic">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model="topic.title" type="text" class="form-control" id="title" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          v-model="topic.description"
          class="form-control"
          id="description"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="saving">
        <span
          v-if="saving"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Create Topic
      </button>
    </form>
  </div>
</template>
