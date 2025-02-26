import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import useAuthStore from '@/lib/store'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginForm = z.infer<typeof loginSchema>

const Signin: React.FC = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post('/api/auth/signin', data)
      localStorage.setItem('accessToken', response.data.accessToken)
      setUser(response.data.user)
      navigate('/')
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
  }

  return (
    <div className='flex flex-col space-y-4 w-full max-w-sm'>
      <h1 className='text-3xl font-bold'>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='email'>Email</label>
          <input
            {...register('email')}
            id='email'
            type='email'
            className='w-full rounded-md border p-2'
            placeholder='me@example.com'
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>
        <div className='space-y-2'>
          <label htmlFor='password'>Password</label>
          <input
            {...register('password')}
            id='password'
            type='password'
            className='w-full rounded-md border p-2'
          />
          {errors.password && (
            <p className='text-sm text-red-500'>{errors.password.message}</p>
          )}
        </div>
        <p className='text-sm text-gray-500'>
          Don't have an account yet?{' '}
          <Link to='/signup' className='underline'>
            Sign up
          </Link>
        </p>
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}

export default Signin
