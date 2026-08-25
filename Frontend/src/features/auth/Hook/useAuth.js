import { useCallback } from "react"
import { setLoading, setUser } from "../state/auth.slice"
import { register, login, getme } from "../services/auth.api"
import { useDispatch } from "react-redux"

export const useAuth = () => {
  const dispatch = useDispatch()

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false
  }) {
    const data = await register({
      email,
      contact,
      password,
      fullname,
      isSeller
    })

    dispatch(setUser(data.user))
  }

  async function handleLogin({ email, password }) {
    const data = await login({
      email,
      password
    })

    dispatch(setUser(data.user))
  }

  const handlegetme = useCallback(async function handlegetme() {
    try {
      dispatch(setLoading(true))

      const data = await getme()

      dispatch(setUser(data.user))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  return {
    handleRegister,
    handleLogin,
    handlegetme
  }
}
