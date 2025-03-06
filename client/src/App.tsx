import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import Layout from '@/components/layout'
import Home from '@/pages/home'
import Signin from '@/pages/signin'
import Signup from '@/pages/signup'
import NotFound from '@/pages/not-found'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'

const App: React.FC = () => {
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
      <HashRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<NotFound />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Layout>
      </HashRouter>
      <Toaster />
    </>
  )
}

export default App
