import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/layout'
import Home from './pages/home'
import Signin from './pages/signin'
import Signup from './pages/signup'
import { useEffect } from 'react'
import { useAuthStore } from './lib/store'
import { auth } from './lib/api'
import { User } from './types'

function App() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      auth
        .getMe()
        .then((user: User) => {
          setUser(user)
        })
        .catch(() => {
          setUser(null)
        })
    }
  }, [setUser])

  return (
    <>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
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
