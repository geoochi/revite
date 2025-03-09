import { Toaster } from 'sonner'
import { useEffect } from 'react'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import Navbar from '@/components/navbar'
import { toast } from 'sonner'
import './globals.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser } = useAuthStore()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me')
        setUser(response.data)
      } catch (error: any) {
        if (error.response.status === 400) {
          setUser(null)
        } else {
          toast.error('Internal server error')
        }
      }
    }
    fetchUser()
  }, [setUser])
  return (
    <div className='min-h-screen flex flex-col p-8'>
      <Navbar />
      <main className='flex-1 flex flex-col items-center justify-center'>{children}</main>
      <Toaster />
    </div>
  )
}

export default Layout
