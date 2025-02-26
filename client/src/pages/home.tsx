import { useAuthStore } from '@/lib/store'
import { Link } from 'react-router-dom'

export default function Home() {
  const { user, isAuthenticated } = useAuthStore()
  return (
    <div className='space-y-6 text-center'>
      <h1 className='text-3xl font-bold'>Welcome to Revite</h1>
      <hr />
      {isAuthenticated ? (
        <p>Hello, {user?.name || user?.email} !</p>
      ) : (
        <p className='text-gray-500 dark:text-gray-400'>
          Please{' '}
          <Link to='/signin' className='underline'>
            sign in
          </Link>{' '}
          to continue.
        </p>
      )}
    </div>
  )
}
