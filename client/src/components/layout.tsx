import Navbar from './navbar'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col p-8'>
      <Navbar />
      <main className='flex-1 flex flex-col items-center justify-center'>
        {children}
      </main>
    </div>
  )
}

export default Layout
