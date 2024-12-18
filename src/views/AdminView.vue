<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { forumService } from '@/services/api'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const users = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const success = ref(null)

if (!authStore.isAuthenticated) {
  router.push('/login')
}

const selectedUser = ref(null)
const editForm = ref({
  username: '',
  email: '',
  pfP_URL: '',
  password: '',
})

const currentPage = ref(1)
const usersPerPage = 10
const searchQuery = ref('')

const fetchUsers = async () => {
  try {
    const response = await forumService.getUsers()
    users.value = response.data
  } catch (error) {
    error.value = 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  selectedUser.value = user
  editForm.value = {
    username: user.username,
    email: user.email,
    pfP_URL: user.pfP_URL,
    newPassword: '',
  }
}

const updateUser = async () => {
  saving.value = true
  error.value = null
  success.value = null

  try {
    await forumService.updateUser(selectedUser.value.userID, editForm.value)
    const index = users.value.findIndex((user) => user.userID === selectedUser.value.userID)
    users.value[index] = { ...users.value[index], ...editForm.value }
    success.value = 'User updated successfully'
  } catch (error) {
    error.value = 'Failed to update user'
  } finally {
    saving.value = false
  }

  selectedUser.value = null
}

onMounted(fetchUsers)
</script>

<template>
  <div class="container mt-4 pt-4">
    <h2>Admin Panel</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success" role="alert">
      {{ success }}
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-md-6">
          <h3>Users</h3>

          <div class="mb-3">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Search users..."
            />
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Profile picture URL</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.userID">
                <td>
                  <img
                    :src="user.pfP_URL || 'https://placehold.co/150x150.png'"
                    class="img-thumbnail mb-3"
                    alt="Profile Picture"
                    style="width: 25px; height: 25px; object-fit: cover"
                  />
                </td>
                <td>{{ user.username }}</td>
                <td>{{ user.password }}</td>
                <td>
                  <button @click="editUser(user)" class="btn btn-sm btn-primary">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="selectedUser" class="card">
            <div class="card-body">
              <h5 class="card-title">Edit User</h5>

              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input v-model="editForm.username" type="text" class="form-control" id="username" />
              </div>

              <div class="mb-3">
                <label for="pfP_URL" class="form-label">Profile Picture URL</label>
                <input v-model="editForm.pfP_URL" type="text" class="form-control" id="pfP_URL" />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">New Password</label>
                <input v-model="editForm.password" type="password" class="form-control" id="password" />
              </div>

              <button @click="updateUser" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Save
              </button>
            </div>

          <pagination
            :total="users.length"
            :per-page="usersPerPage"
            v-model:currentPage="currentPage"
          />
        </div>
      </div>
    </div>
  </div>
</div>
</template>
