import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/index'
import SignIn from './pages/signin'
import SignUp from './pages/signup'
import Verify from './pages/verify'
import './globals.css'

import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'
import Navbar from '@/components/navbar'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'

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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
