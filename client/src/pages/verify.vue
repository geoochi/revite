<script lang="ts" setup>
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import { computed, ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const store = useAuthStore()
const user = computed(() => store.user)
const isSentEmail = ref(false)
const countdown = ref(30)
const router = useRouter()

const sendEmailRequest = async () => {
  isSentEmail.value = true
  countdown.value = 30
  const interval = setInterval(() => {
    countdown.value--
  }, 1000)
  setTimeout(() => {
    isSentEmail.value = false
    clearInterval(interval)
  }, 30000)
  try {
    await api.post('/api/auth/send-email', { email: user.value?.email })
  } catch (error: any) {
    if (error.response.status === 400) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Internal server error')
    }
  }
}
onMounted(() => {
  const check = async () => {
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')
    if (token) {
      try {
        const response = await api.post('/api/auth/verify-email', { token })
        store.setUser(response.data.user)
        store.setIsAuthenticated(true)
        localStorage.setItem('accessToken', response.data.accessToken)
        router.push('/')
      } catch (error: any) {
        if (error.response.status === 400) {
          toast.error(error.response.data.error)
        } else {
          toast.error('Internal server error')
        }
      }
    } else if (!user.value) {
      router.push('/signin')
    } else if (!user.value?.emailVerified) {
      sendEmailRequest()
    } else router.push('/')
  }
  check()
})
</script>

<template>
  <div class="flex flex-col space-y-4 items-center">
    <h1 class="text-3xl font-bold">Verification email sent</h1>
    <p class="text-sm text-muted-foreground">Please check your email for verification</p>
    <Button @click="sendEmailRequest" :disabled="isSentEmail" :ui="{ base: 'p-2' }">
      {{ isSentEmail ? `Email sent ${countdown}s` : 'Resend email' }}
    </Button>
  </div>
</template>
