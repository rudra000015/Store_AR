import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

function Protected({ children, role }) {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0c10] text-stone-100">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8b15f]">
          Loading THE A&R STORE...
        </p>
      </main>
    )
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

