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

const post = ref({
  content: '',
})

const fetchPost = async () => {
  try {
    const response = await forumService.getPost(route.params.topicId, route.params.threadId, route.params.postId)
    post.value = response.data
  } catch (err) {
    error.value = 'Failed to load post'
    console.error(err)
    router.push('/error')
  } finally {
    loading.value = false
  }
}

const updatePost = async () => {
  saving.value = true
  try {
    await forumService.updatePost(route.params.topicId, route.params.threadId, route.params.postId, {
      content: post.value.content,
    })
    router.push(`/topics/${route.params.topicId}/threads/${route.params.threadId}/posts`)
  } catch (err) {
    error.value = 'Failed to update post'
    console.error(err)
    router.push('/error')
  } finally {
    saving.value = false
  }
}

onMounted(fetchPost)
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Edit Post</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <form v-else @submit.prevent="updatePost">
      <div class="mb-3">
        <label for="content" class="form-label">Content</label>
        <input v-model="post.content" type="text" class="form-control" id="content" required />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">Save</button>
    </form>
  </div>
</template>
