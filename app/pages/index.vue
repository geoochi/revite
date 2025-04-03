<script setup lang="ts">
import useAuthStore from '@/lib/store'

const store = useAuthStore()
const isAuthenticated = computed(() => store.isAuthenticated)
const user = computed(() => store.user)
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Hello, {{ user?.name || user?.email }} !</p>
  </div>
  <div v-else class="space-y-6 text-center">
    <h1 class="text-3xl font-bold">Welcome to Revite</h1>
    <hr class="border-gray-300 dark:border-gray-500" />
    <p class="text-gray-500 dark:text-gray-400">
      Please
      <NuxtLink to="/signin" class="underline"> sign in </NuxtLink> to continue.
    </p>
  </div>
</template>
