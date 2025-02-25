import { useAuthStore } from '../lib/store'
// import { useNavigate } from 'react-router-dom'
// import { useEffect } from 'react'

export default function Home() {
  const { user, isAuthenticated } = useAuthStore()
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!isAuthenticated) navigate('/signin')
  // }, [])

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold'>Welcome to Revite</h1>
        {isAuthenticated ? (
          <p className='text-gray-500 dark:text-gray-400'>
            Hello, {user?.name || user?.email}! This is your dashboard.
          </p>
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>
            Please sign in to continue.
          </p>
        )}
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Add your dashboard content here */}
      </div>
    </div>
  )
}
