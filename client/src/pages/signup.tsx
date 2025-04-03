import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '@/lib/store'
import { useEffect } from 'react'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

type RegisterForm = z.infer<typeof registerSchema>

const Page: React.FC = () => {
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  const onSubmit = async (data: RegisterForm) => {
    setUser({ email: data.email, name: data.name, emailVerified: false })
    setIsAuthenticated(false)
    try {
      await api.post('/api/auth/signup', data)
      navigate('/verify')
    } catch (error: any) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Internal server error')
      }
    }
  }

  return (
    <div className='flex flex-col space-y-4 w-full max-w-sm'>
      <h1 className='text-3xl font-bold'>Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='name'>Name</label>
          <input {...register('name')} id='name' className='w-full rounded-md border p-2' placeholder='John Doe' />
          {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
        </div>
        <div className='space-y-2'>
          <label htmlFor='email'>Email</label>
          <input
            {...register('email')}
            id='email'
            type='email'
            className='w-full rounded-md border p-2'
            placeholder='me@example.com'
          />
          {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
        </div>
        <div className='space-y-2'>
          <label htmlFor='password'>Password</label>
          <input {...register('password')} id='password' type='password' className='w-full rounded-md border p-2' />
          {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
        </div>
        <p className='text-sm text-gray-500'>
          Already have an account?{' '}
          <Link to='/signin' className='underline'>
            Sign in
          </Link>
        </p>
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Sign up'}
        </Button>
      </form>
    </div>
  )
}

export default Page
