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

const thread = ref({
  title: '',
})

const fetchThread = async () => {
  try {
    const response = await forumService.getThread(route.params.topicId, route.params.threadId)
    thread.value = response.data
  } catch (err) {
    error.value = 'Failed to load thread'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const updateThread = async () => {
  saving.value = true
  try {
    await forumService.updateThread(route.params.topicId, route.params.threadId, {
      title: thread.value.title,
    })
    router.push(`/topics/${route.params.topicId}`)
  } catch (err) {
    error.value = 'Failed to update thread'
    console.error(err)
  } finally {
    saving.value = false
  }
}

onMounted(fetchThread)
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Edit Thread</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <form v-else @submit.prevent="updateThread">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model="thread.title" type="text" class="form-control" id="title" required />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">Save</button>
    </form>
  </div>
</template>
