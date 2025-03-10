import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import Navbar from '@/components/navbar'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import './globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setIsAuthenticated } = useAuthStore()
  const checkUser = () => {
    api
      .get('/api/auth/me')
      .then((response) => {
        setUser(response.data.user)
        setIsAuthenticated(true)
      })
      .catch((error: any) => {
        setUser(null)
        setIsAuthenticated(false)
        if (error.status === 400) {
          // toast.error(error.response.data.error)
        } else {
          toast.error('Internal server error')
        }
      })
  }

  useEffect(() => {
    checkUser()
  }, [setUser])

  return (
    <>
      <div className='min-h-screen flex flex-col p-8'>
        <Navbar />
        <main className='flex-1 flex flex-col items-center justify-center'>{children}</main>
      </div>
      <Toaster />
    </>
  )
}

export default Layout
