import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

function Protected({ children, role }) {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "Seller" ? "/seller" : "/buyer"} replace />
  }

  return children || <Outlet />
}

export default Protected
