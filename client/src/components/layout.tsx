import Navbar from './navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 flex flex-col items-center justify-center'>
        {children}
      </main>
    </div>
  )
}
