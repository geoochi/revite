import useAuthStore from '@/lib/store'

const Page: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore()
  return (
    <div className='space-y-6 text-center'>
      {isAuthenticated ? (
        <p>Hello, {user?.name || user?.email} !</p>
      ) : (
        <>
          <h1 className='text-3xl font-bold'>Welcome to Revite</h1>
          <hr />
          <p className='text-gray-500 dark:text-gray-400'>
            Please{' '}
            <a href='/signin' className='underline'>
              sign in
            </a>{' '}
            to continue.
          </p>
        </>
      )}
    </div>
  )
}

export default Page
