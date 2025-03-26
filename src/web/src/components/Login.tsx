import { Navigate, useNavigate } from "react-router-dom"
import { StytchLogin, useStytchSession } from "@stytch/react"
import { type Callbacks, Products } from "@stytch/vanilla-js"
import { LoginContainer } from "../components/LoginContainer/LoginContainer"

export const STYTCH_CONFIG = {
  products: [Products.passwords],
  passwordOptions: {
    loginExpirationMinutes: 30,
    loginRedirectURL: `${window.location.origin}/authenticate`,
    resetPasswordExpirationMinutes: 30,
    resetPasswordRedirectURL: `${window.location.origin}/reset-password`,
  },
}

const Login = () => {
  const navigate = useNavigate()
  const { session } = useStytchSession()

  const callbacks: Callbacks = {
    onEvent: (event) => {
      if (
        (event.type === "AUTHENTICATE_FLOW_COMPLETE" || event.type === "PASSWORD_AUTHENTICATE") &&
        event.data?.user
      ) {
        navigate("/dashboard")
      }
    },
  }

  if (session) {
    return <Navigate to="/dashboard" />
  }
  return (
    <LoginContainer>
      <StytchLogin
        config={STYTCH_CONFIG}
        callbacks={callbacks}
        styles={{
          logo: {
            logoImageUrl: "https://trey.fi/media/trey_tunnus_musta-1.png",
          },
        }}
      />
    </LoginContainer>
  )
}

export default Login
