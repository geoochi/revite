<script lang="ts" setup>
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import type { DropdownMenuItem } from '@nuxt/ui'

const colorMode = useColorMode()
colorMode.preference = 'system'
const router = useRouter()
const toast = useToast()
const store = useAuthStore()
const user = computed(() => store.user)
const isAuthenticated = computed(() => store.isAuthenticated)

const handleLogout = async () => {
  try {
    await api.post('/api/auth/signout')
    localStorage.removeItem('accessToken')
    store.setUser(null)
    store.setIsAuthenticated(false)
    router.push('/')
  } catch (error: any) {
    if (error.response.status === 400) toast.add({ title: error.response.data.message, color: 'error' })
    else toast.add({ title: 'Internal server error', color: 'error' })
  }
}
const items: DropdownMenuItem[] = [{ label: 'Sign out', icon: 'i-lucide-log-out', onClick: handleLogout }]
</script>

<template>
  <div class="flex justify-center">
    <div class="flex items-center justify-between w-full max-w-[800px]">
      <NuxtLink to="/" class="text-2xl font-bold"> Revite </NuxtLink>

      <div class="flex items-center gap-4">
        <UDropdownMenu v-if="isAuthenticated" :items="items" :content="{ align: 'start' }">
          <UButton :label="user?.name" color="neutral" variant="outline" />
        </UDropdownMenu>
        <UButton v-else>
          <NuxtLink to="/signin"> Sign in </NuxtLink>
        </UButton>
        <UButton
          @click="
            () => {
              colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
              colorMode.preference = colorMode.value
            }
          "
          :icon="
            colorMode.preference === 'system'
              ? 'i-lucide-monitor-smartphone'
              : colorMode.value === 'dark'
              ? 'i-lucide-moon'
              : 'i-lucide-sun'
          "
        />
      </div>
    </div>
  </div>
</template>
