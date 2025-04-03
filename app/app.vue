<script setup lang="ts">
import Navbar from '@/components/navbar.vue'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'

const toast = useToast()
const store = useAuthStore()
const checked = ref(false)
const checkUser = async () => {
  api
    .get('/api/auth/me')
    .then(response => {
      store.setUser(response.data.user)
      store.setIsAuthenticated(true)
    })
    .catch((error: any) => {
      store.setUser(null)
      store.setIsAuthenticated(false)
      if (error.status === 400) {
        // toast.add({ title: error.response.data.message, color: 'error' })
      } else toast.add({ title: 'Internal server error', color: 'error' })
    })
}

onMounted(() => {
  checkUser()
  checked.value = true
})
</script>

<template>
  <UApp>
    <title>Revite</title>
    <div v-if="checked" class="min-h-screen flex flex-col p-8">
      <Navbar />
      <main class="flex-1 flex flex-col items-center justify-center">
        <NuxtPage />
      </main>
    </div>
    <div v-else class="flex justify-center items-center h-screen">
      <p>loading...</p>
    </div>
  </UApp>
</template>
