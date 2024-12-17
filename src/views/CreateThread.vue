<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { forumService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const error = ref(null)

const thread = ref({
  title: '',
})

const createThread = async () => {
  saving.value = true
  try {
    await forumService.createThread(route.params.topicId, thread.value)
    router.push(`/topics/${route.params.topicId}/threads`)
  } catch (err) {
    error.value = 'Failed to create thread'
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
  loading.value = false
})
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Create Thread</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <form @submit.prevent="createThread">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model="thread.title" type="text" class="form-control" id="title" required />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="saving">
        <span
          v-if="saving"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Create Thread
      </button>
    </form>
  </div>
</template>
