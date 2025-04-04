<script lang="ts" setup>
import { z } from 'zod'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import type { FormSubmitEvent } from '@nuxt/ui'

const store = useAuthStore()
const isAuthenticated = computed(() => store.isAuthenticated)
const toast = useToast()

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  store.setUser({ email: event.data.email, emailVerified: false })
  store.setIsAuthenticated(false)
  try {
    const response = await api.post('/api/auth/signin', event.data)
    localStorage.setItem('accessToken', response.data.accessToken)
    store.setUser(response.data.user)
    store.setIsAuthenticated(true)
    navigateTo('/')
  } catch (error: any) {
    if (error.response.status === 400) {
      if (error.response.data.message === 'Email not verified') {
        navigateTo('/verify')
      } else {
        toast.add({ title: error.response.data.message, color: 'error' })
      }
    } else {
      toast.add({ title: 'Internal server error', color: 'error' })
    }
  }
}
</script>

<template>
  <div class="flex flex-col space-y-4 w-full max-w-sm">
    <h1 class="text-3xl font-bold">Sign in</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email" class="text-md">
        <UInput v-model="state.email" class="w-full" :ui="{ base: 'p-3' }" />
      </UFormField>
      <UFormField label="Password" name="password" class="text-md">
        <UInput v-model="state.password" type="password" class="w-full" :ui="{ base: 'p-3' }" />
      </UFormField>
      <p class="text-sm text-gray-500">
        Don't have an account yet?
        <NuxtLink to="/signup" class="underline"> Sign up </NuxtLink>
      </p>
      <UButton type="submit" class="w-full flex justify-center text-md p-2"> Sign in </UButton>
    </UForm>
  </div>
</template>
