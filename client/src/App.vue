<script setup lang="ts">
import Navbar from '@/components/navbar.vue'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import { ref, onMounted } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'
import '@/global.css'

const store = useAuthStore()
const checked = ref(false)
const checkUser = async () => {
  api
    .get('/api/auth/me')
    .then((response: any) => {
      store.setUser(response.data.user)
      store.setIsAuthenticated(true)
    })
    .catch((error: any) => {
      store.setUser(null)
      store.setIsAuthenticated(false)
      if (error.status === 400) {
        // toast.error(error.response.data.error)
      } else toast.error('Internal server error')
    })
}

onMounted(() => {
  checkUser()
  checked.value = true
})
</script>

<template>
  <Toaster />
  <div class="min-h-screen flex flex-col p-8">
    <Navbar />
    <main class="flex-1 flex flex-col items-center justify-center">
      <RouterView v-if="checked" />
      <p v-else>loading...</p>
    </main>
  </div>
</template>
