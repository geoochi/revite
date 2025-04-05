<script lang="ts" setup>
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const store = useAuthStore()
const isAuthenticated = computed(() => store.isAuthenticated)
const router = useRouter()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

const onSubmit = form.handleSubmit(async values => {
  store.setUser({ name: values.name, email: values.email, emailVerified: false })
  store.setIsAuthenticated(false)
  try {
    await api.post('/api/auth/signup', {
      name: values.name,
      email: values.email,
      password: values.password,
    })
    router.push('/verify')
  } catch (error: any) {
    if (error.response.status === 400) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Internal server error')
    }
  }
})
</script>

<template>
  <div class="flex flex-col space-y-4 w-full max-w-sm">
    <h1 class="text-3xl font-bold">Sign up</h1>
    <form @submit="onSubmit" class="space-y-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="John Doe" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="text" placeholder="John@doe.com" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <p class="text-sm text-gray-500">
        Already have an account?
        <RouterLink to="/signin" class="underline"> Sign in </RouterLink>
      </p>
      <Button type="submit" class="w-full"> Sign up </Button>
    </form>
  </div>
</template>
