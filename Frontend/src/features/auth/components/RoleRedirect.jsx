import { Navigate } from "react-router"
import { useSelector } from "react-redux"

function RoleRedirect() {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 text-stone-100">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d8b15f]">
          Loading dashboard...
        </p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={user.role === "Seller" ? "/seller" : "/buyer"} replace />
}

export default RoleRedirect
