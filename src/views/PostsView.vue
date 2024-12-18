<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { forumService } from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref(null)
const thread = ref(null)
const posts = ref([])
const creatorInfo = ref({})

const currentPage = ref(1)
const postsPerPage = 25
const totalPosts = ref(0)

const newPost = ref('')
const saving = ref(false)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(posts.value.length / postsPerPage))

const fetchPosts = async () => {
  loading.value = true
  try {
    const [threadResponse, postsResponse] = await Promise.all([
      forumService.getThread(route.params.topicId, route.params.threadId),
      forumService.getPosts(route.params.topicId, route.params.threadId),
    ])

    thread.value = threadResponse.data
    posts.value = postsResponse.data
    totalPosts.value = posts.value.length
    posts.value.forEach((post) => getCreatorInfo(post))
  } catch (error) {
    console.error('Error:', error)
    error.value = 'Failed to load thread and posts'
    router.push('/error')
  } finally {
    loading.value = false
  }
}

const createPost = async () => {
  if (!newPost.value.trim()) return

  saving.value = true
  try {
    const response = await forumService.createPost(route.params.topicId, route.params.threadId, {
      content: newPost.value,
    })

    const newPostData = {
      ...response.data,
      creatorID: authStore.user.userID,
    }
    posts.value.push(newPostData)
    await getCreatorInfo(newPostData)

    newPost.value = ''
    currentPage.value = Math.ceil(posts.value.length / postsPerPage)
  } catch (error) {
    console.error('Error creating post:', error)
    router.push('/error')
  } finally {
    saving.value = false
  }
}
const getCreatorInfo = async (post) => {
  try {
    const response = await forumService.getUser(post.creatorID)
    creatorInfo.value[post.creatorID] = response.data
  } catch (error) {
    console.error('Error fetching creator info:', error)
    creatorInfo.value[post.creatorID] = {
      username: 'Unknown User',
      pfP_URL: 'https://via.placeholder.com/48',
    }
  }
}

const deletePost = async (postId) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await forumService.deletePost(route.params.topicId, route.params.threadId, postId)
      posts.value = posts.value.filter((post) => post.postID !== postId)
    } catch (error) {
      console.error('Error deleting post:', error)
      router.push('/error')
    }
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div class="container mt-4 pt-4">
    <div v-if="thread" class="mb-4">
      <h2>{{ thread.title }}</h2>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Posts</h3>
    </div>

    <nav v-if="totalPages > 1" class="my-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
        </li>
      </ul>
    </nav>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="posts-container">
      <div
        v-for="(post, index) in paginatedPosts"
        :key="post.postID"
        class="card mb-3 post-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-body">
          <div class="d-flex">
            <div class="user-info text-center me-4" style="min-width: 120px">
              <img
                :src="creatorInfo[post.creatorID]?.pfP_URL || 'https://via.placeholder.com/48'"
                class="img-thumbnail mb-2"
                width="48"
                height="48"
                :alt="creatorInfo[post.creatorID]?.username"
              />
              <div class="fw-bold text-wrap">{{ creatorInfo[post.creatorID]?.username }}</div>
            </div>

            <div class="flex-grow-1">
              <p class="card-text">{{ post.content }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  Posted on {{ new Date(post.createdAt).toLocaleDateString() }}
                </small>
                <div
                  class="btn-group"
                  v-if="
                    authStore.user?.userID === post.creatorId || authStore.user?.isAdmin === true
                  "
                >
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="
                      router.push(
                        `/topics/${route.params.topicId}/threads/${route.params.threadId}/posts/${post.postID}/edit`,
                      )
                    "
                  >
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deletePost(post.postID)">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav v-if="totalPages > 1" class="my-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
        </li>
      </ul>
    </nav>

    <div v-if="authStore.isAuthenticated" class="card mt-4">
      <div class="card-body">
        <h5 class="card-title">Add a Reply</h5>
        <form @submit.prevent="createPost">
          <div class="mb-3">
            <textarea
              v-model="newPost"
              class="form-control"
              rows="3"
              placeholder="What's on your mind?"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="saving || !newPost.trim()">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
            Post Reply
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  width: 100%;
  min-width: 900px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .post-card {
    max-width: 100%;
    min-width: 900px;
  }
}

@media (max-width: 900px) {
  .post-card {
    max-width: 100%;
    min-width: 600px;
  }
}

@media (max-width: 600px) {
  .post-card {
    max-width: 100%;
    min-width: 100%;
  }
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

.user-info {
  border-right: 1px solid #dee2e6;
  padding-right: 1rem;
}
</style>
