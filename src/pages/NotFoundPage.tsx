import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl mb-4">404</h1>
        <p className="mb-6">Page not found</p>
        <Button onClick={() => navigate('/')} variant="link">
          Return home
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage 