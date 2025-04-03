import { Navigate, useNavigate } from "react-router-dom"
import { StytchLogin, StytchPasswordReset, useStytch, useStytchSession } from "@stytch/react"
import { type Callbacks } from "@stytch/vanilla-js"
import { SESSION_DURATION_MINUTES, STYTCH_CONFIG } from "../authentication/stytchConfig"
import { LoginContainer } from "../components/LoginContainer/LoginContainer"

export const Authenticate = () => {
  const stytchClient = useStytch()
  const { session } = useStytchSession()

  const token = new URLSearchParams(window.location.search).get("token")
  if (token && !session) {
    stytchClient.magicLinks.authenticate(token, {
      session_duration_minutes: SESSION_DURATION_MINUTES,
    })
    return <Navigate to="/dashboard" />
  }

  return <Navigate to="/" />
}

export const ResetPassword = () => {
  const passwordResetToken = new URLSearchParams(window.location.search).get("token")

  if (passwordResetToken) {
    return (
      <LoginContainer>
        <StytchPasswordReset config={STYTCH_CONFIG} passwordResetToken={passwordResetToken} />
      </LoginContainer>
    )
  }
  return <Navigate to="/" />
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
