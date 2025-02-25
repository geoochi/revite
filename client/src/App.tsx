import { HashRouter, Routes, Route } from 'react-router-dom'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import Layout from './components/layout'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

// const queryClient = new QueryClient()

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </Layout>
      </HashRouter>
      <Toaster />
    </ThemeProvider>
    // </QueryClientProvider>
  )
}

export default App
