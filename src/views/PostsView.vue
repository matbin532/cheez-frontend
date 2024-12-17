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
const thread = ref(null)
const posts = ref([])
const creatorInfo = ref({})

const fetchPosts = async () => {
  try {
    const threadResponse = await forumService.getThread(route.params.topicId, route.params.threadId)
    thread.value = threadResponse.data

    const postsResponse = await forumService.getPosts(route.params.topicId, route.params.threadId)
    posts.value = postsResponse.data
    posts.value.forEach((post) => getCreatorInfo(post))
  } catch (error) {
    console.error('Error fetching posts:', error)
    error.value = 'Failed to load posts'
  } finally {
    loading.value = false
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
    }
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div class="container mt-4 pt-4">
    <!-- Thread Header -->
    <div v-if="thread" class="mb-4">
      <h2>{{ thread.title }}</h2>
      <p class="text-muted">{{ thread.content }}</p>
    </div>

    <!-- Create Post Button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Posts</h3>
      <button
        v-if="authStore.isAuthenticated"
        @click="
          router.push(
            `/topics/${route.params.topicId}/threads/${route.params.threadId}/posts/create`,
          )
        "
        class="btn btn-primary"
      >
        Add Post
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Posts List -->
    <div v-else class="posts-container">
      <div
        v-for="(post, index) in posts"
        :key="post.postID"
        class="card mb-3 post-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-body">
          <div class="d-flex">
            <!-- User Info Section -->
            <div class="user-info text-center me-4" style="min-width: 120px">
              <img
                :src="creatorInfo[post.creatorID]?.pfP_URL || 'https://via.placeholder.com/48'"
                class="rounded-circle mb-2"
                width="48"
                height="48"
                :alt="creatorInfo[post.creatorID]?.username"
              />
              <div class="fw-bold text-break">{{ creatorInfo[post.creatorID]?.username }}</div>
            </div>

            <!-- Post Content Section -->
            <div class="flex-grow-1">
              <p class="card-text">{{ post.content }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  Posted on {{ new Date(post.createdAt).toLocaleDateString() }}
                </small>
                <div
                  class="btn-group"
                  v-if="
                    authStore.user?.userID === post.creatorID || authStore.user?.isAdmin === true
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
  </div>
</template>

<style scoped>
.post-card {
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

.user-info {
  border-right: 1px solid #dee2e6;
  padding-right: 1rem;
}
</style>
