import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import useAuthStore from '@/lib/store'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const Page: React.FC = () => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useAuthStore()
  const [isSentEmail, setIsSentEmail] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const navigate = useNavigate()

  const sendEmailRequest = async () => {
    setIsSentEmail(true)
    setCountdown(30)
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    setTimeout(() => {
      setIsSentEmail(false)
      clearInterval(interval)
    }, 30000)
    try {
      await api.post('/api/auth/send-email', { email: user?.email })
    } catch (error: any) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Internal server error')
      }
    }
  }

  useEffect(() => {
    const check = async () => {
      const hash = window.location.hash
      const hashParts = hash.split('?')
      const searchParams = new URLSearchParams(hashParts[1])
      const token = searchParams.get('token')
      if (token) {
        try {
          const response = await api.post('/api/auth/verify-email', { token })
          setUser(response.data.user)
          setIsAuthenticated(true)
          localStorage.setItem('accessToken', response.data.accessToken)
          navigate('/')
        } catch (error: any) {
          if (error.response.status === 400) {
            toast.error(error.response.data.error)
          } else {
            toast.error('Internal server error')
          }
        }
      } else if (!user) {
        navigate('/signin')
      } else if (!user?.emailVerified) {
        sendEmailRequest()
      } else navigate('/')
    }
    check()
  }, [])

  return (
    <div className='flex-col space-y-4 text-center'>
      <h1 className='text-3xl font-bold'>Verification email sent</h1>
      <p className='text-sm text-muted-foreground'>Please check your email for verification</p>
      <Button
        onClick={() => {
          sendEmailRequest()
        }}
        disabled={isSentEmail}
      >
        {isSentEmail ? `Email sent ${countdown}s` : 'Resend email'}
      </Button>
    </div>
  )
}

export default Page
