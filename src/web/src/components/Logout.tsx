import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import { useStytch } from "@stytch/react"

export const Logout = () => {
  const stytch = useStytch()
  const navigate = useNavigate()

  const logout = useCallback(() => {
    stytch.session.revoke()
  }, [stytch])

  useEffect(() => {
    logout()
    navigate("/login")
  }, [logout, navigate])

  return <CircularProgress />
}
