<script lang="ts" setup>
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useDark } from '@vueuse/core'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon, LogOut } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'vue-sonner'

const store = useAuthStore()
const user = computed(() => store.user)
const isAuthenticated = computed(() => store.isAuthenticated)
const router = useRouter()
const isDark = useDark()

const handleLogout = async () => {
  try {
    await api.post('/api/auth/signout')
    localStorage.removeItem('accessToken')
    store.setUser(null)
    store.setIsAuthenticated(false)
    router.push('/')
  } catch (error: any) {
    if (error.response.status === 400) toast.error(error.response.data.error)
    else toast.error('Internal server error')
  }
}
</script>

<template>
  <div class="flex justify-center">
    <div class="flex items-center justify-between w-full max-w-[800px]">
      <RouterLink to="/" class="text-2xl font-bold"> Revite </RouterLink>
      <div class="flex items-center gap-4">
        <DropdownMenu v-if="isAuthenticated">
          <DropdownMenuTrigger as-child>
            <Button>{{ user?.name }}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="handleLogout">
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button v-else @click="router.push('/signin')"> Sign in </Button>
        <MoonIcon v-if="isDark" @click="isDark = false" />
        <SunIcon v-else @click="isDark = true" />
      </div>
    </div>
  </div>
</template>
