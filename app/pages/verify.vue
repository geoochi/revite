<script lang="ts" setup>
import useAuthStore from '@/lib/store'
import api from '@/lib/api'

const store = useAuthStore()
const user = computed(() => store.user)
const isSentEmail = ref(false)
const countdown = ref(30)
const toast = useToast()
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
      toast.add({ title: error.response.data.message, color: 'error' })
    } else {
      toast.add({ title: 'Internal server error', color: 'error' })
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
          toast.add({ title: error.response.data.message, color: 'error' })
        } else {
          toast.add({ title: 'Internal server error', color: 'error' })
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
    <UButton @click="sendEmailRequest" :disabled="isSentEmail" :ui="{ base: 'p-2' }">
      {{ isSentEmail ? `Email sent ${countdown}s` : 'Resend email' }}
    </UButton>
  </div>
</template>
