import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { auth } from '../lib/api'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated, setUser } = useAuthStore()

  const handleLogout = async () => {
    try {
      await auth.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to logout',
      })
    }
  }

  return (
    <div className='flex items-center justify-between p-8'>
      <Link to='/' className='text-2xl font-bold'>
        Revite
      </Link>

      <div className='flex items-center gap-4'>
        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.name || user?.email}</span>
            <Button variant='outline' onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant='ghost' asChild>
              <Link to='/login'>Login</Link>
            </Button>
            <Button asChild>
              <Link to='/register'>Register</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
