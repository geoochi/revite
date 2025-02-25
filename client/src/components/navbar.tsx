import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { auth } from '../lib/api'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { useTheme } from '@/hooks/useTheme'
import { SunIcon, MoonIcon } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated, setUser } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await auth.signout()
      setUser(null)
      navigate('/signin')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out',
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
            <span>{user?.name || user?.email}</span>
            <Button variant='outline' onClick={handleLogout}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button variant='outline'>
              <Link to='/signin'>Sign in</Link>
            </Button>
          </>
        )}
        <Button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          variant='outline'
          size='icon'
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </div>
  )
}
