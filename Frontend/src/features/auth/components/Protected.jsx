import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

function Protected() {
  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  // Wait until getme() finishes
  if (loading) {
    return <div>Loading...</div>
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // User is authenticated
  return <Outlet />
}

export default Protected