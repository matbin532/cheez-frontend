<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { forumService } from '@/services/api'
import { authService } from '@/services/auth'

const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const success = ref(null)

const profile = ref({
  username: '',
  email: '',
  pfP_URL: '',
})

const newPassword = ref({
  current: '',
  new: '',
  confirm: '',
})

const fetchProfile = async () => {
  try {
    const response = await authService.getProfile()
    profile.value = response.data
  } catch (error) {
    error.value = 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  saving.value = true
  error.value = null
  success.value = null

  try {
    await forumService.updateUser(authStore.user.id, profile.value)
    success.value = 'Profile updated successfully'
    authStore.user = { ...authStore.user, ...profile.value }
  } catch (error) {
    error.value = 'Failed to update profile'
  } finally {
    saving.value = false
  }
}

const updatePassword = async () => {
  if (newPassword.value.new !== newPassword.value.confirm) {
    error.value = 'New passwords do not match'
    return
  }

  saving.value = true
  error.value = null
  success.value = null

  try {
    await forumService.updateUser(authStore.user.userID, {
      currentPassword: newPassword.value.current,
      newPassword: newPassword.value.new,
    })
    success.value = 'Password updated successfully'
    newPassword.value = { current: '', new: '', confirm: '' }
  } catch (error) {
    error.value = 'Failed to update password'
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Profile Settings</h2>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-if="success" class="alert alert-success" role="alert">{{ success }}</div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row">
      <div class="col-md-4 text-center mb-4">
        <img
          :src="profile.pfP_URL || 'https://via.placeholder.com/150'"
          class="img-thumbnail mb-3"
          alt="Profile Picture"
          style="width: 150px; height: 150px; object-fit: cover"
        />
        <div class="mb-3">
          <label for="pfP_URL" class="form-label">Profile Picture URL</label>
          <input
            type="url"
            class="form-control"
            id="pfP_URL"
            v-model="profile.pfP_URL"
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div class="col-md-8">
        <form @submit.prevent="updateProfile" class="mb-4">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="profile.username"
              required
            />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="profile.email" required />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            Save Changes
          </button>
        </form>

        <h3 class="h4 mb-3">Change Password</h3>
        <form @submit.prevent="updatePassword">
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Current Password</label>
            <input
              type="password"
              class="form-control"
              id="currentPassword"
              v-model="newPassword.current"
              required
            />
          </div>

          <div class="mb-3">
            <label for="newPassword" class="form-label">New Password</label>
            <input
              type="password"
              class="form-control"
              id="newPassword"
              v-model="newPassword.new"
              required
            />
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm New Password</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="newPassword.confirm"
              required
            />
          </div>

          <button type="submit" class="btn btn-secondary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            Update Password
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
