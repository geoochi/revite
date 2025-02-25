import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../lib/store'
import { auth } from '../lib/api'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useTheme } from '@/hooks/useTheme'
import { SunIcon, MoonIcon, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setUser } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await auth.signout()
      setUser(null)
      navigate('/')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className='flex justify-center'>
      <div className='flex items-center justify-between w-full max-w-[800px]'>
        <Link to='/' className='text-2xl font-bold'>
          Revite
        </Link>

        <div className='flex items-center gap-4'>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>{user?.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <LogOut />
                  <span onClick={handleLogout}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    </div>
  )
}
