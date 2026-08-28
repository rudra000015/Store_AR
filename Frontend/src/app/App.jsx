import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'
import './App.css'
import { useAuth } from '../features/auth/Hook/useAuth'
import { useEffect } from 'react'

function App() {
  const { handlegetme } = useAuth()

  useEffect(() => {
    handlegetme()
  }, [handlegetme])

  return <RouterProvider router={routes} />
}

export default App
