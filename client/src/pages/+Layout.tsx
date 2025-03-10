import Navbar from '@/components/navbar'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import './globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser } = useAuthStore()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me')
        setUser(response.data)
      } catch (error) {
        setUser(null)
      }
    }
    fetchUser()
  }, [setUser])

  return (
    <>
      <div className='min-h-screen flex flex-col p-8'>
        <Navbar />
        <main className='flex-1 flex flex-col items-center justify-center'>
          {children}
        </main>
      </div>
      <Toaster />
    </>
  )
}

export default Layout
