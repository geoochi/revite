import { usePageContext } from 'vike-react/usePageContext'

const Page: React.FC = () => {
  const { is404 } = usePageContext()
  if (is404) {
    return <h1 className='text-4xl'>404 Page Not Found</h1>
  }
  return <h1 className='text-4xl'>500 Internal Server Error</h1>
}

export default Page
