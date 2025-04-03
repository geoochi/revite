<script lang="ts" setup>
import { z } from 'zod'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import type { FormSubmitEvent } from '@nuxt/ui'

const store = useAuthStore()
const isAuthenticated = computed(() => store.isAuthenticated)
const router = useRouter()
const toast = useToast()

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  name: undefined,
})

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  store.setUser({ email: event.data.email, emailVerified: false, name: event.data.name })
  store.setIsAuthenticated(false)
  try {
    await api.post('/api/auth/signup', event.data)
    router.push('/verify')
  } catch (error: any) {
    if (error.response.status === 400) {
      toast.add({ title: error.response.data.message, color: 'error' })
    } else {
      toast.add({ title: 'Internal server error', color: 'error' })
    }
  }
}
</script>

<template>
  <div class="flex flex-col space-y-4 w-full max-w-sm">
    <h1 class="text-3xl font-bold">Sign Up</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Name" name="name" class="text-md">
        <UInput v-model="state.name" class="w-full" :ui="{ base: 'p-3' }" placeholder="John Doe" />
      </UFormField>
      <UFormField label="Email" name="email" class="text-md">
        <UInput v-model="state.email" class="w-full" :ui="{ base: 'p-3' }" />
      </UFormField>
      <UFormField label="Password" name="password" class="text-md">
        <UInput v-model="state.password" type="password" class="w-full" :ui="{ base: 'p-3' }" />
      </UFormField>
      <p class="text-sm text-gray-500">
        Already have an account?
        <NuxtLink to="/signin" class="underline"> Sign in </NuxtLink>
      </p>
      <UButton type="submit" class="w-full flex justify-center text-md p-2"> Sign up </UButton>
    </UForm>
  </div>
</template>
