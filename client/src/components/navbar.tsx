import { toast } from 'sonner'
import { navigate } from 'vike/client/router'
import { SunIcon, MoonIcon, LogOut } from 'lucide-react'
import useAuthStore from '@/lib/store'
import api from '@/lib/api'
import useTheme from '@/hooks/use-theme'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const Navbar: React.FC = () => {
  const { user, isAuthenticated, setUser } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/signout')
      localStorage.removeItem('accessToken')
      setUser(null)
      navigate('/')
    } catch (error: any) {
      toast.error(error.response.data.error)
    }
  }

  return (
    <div className='flex justify-center'>
      <div className='flex items-center justify-between w-full max-w-[800px]'>
        <a href='/' className='text-2xl font-bold'>
          Revite
        </a>

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
                <a href='/signup'>Sign up</a>
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

export default Navbar
