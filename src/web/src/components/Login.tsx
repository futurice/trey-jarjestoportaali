import { Navigate, useNavigate } from "react-router-dom"
import { StytchLogin, StytchPasswordReset, useStytch, useStytchSession } from "@stytch/react"
import { type Callbacks } from "@stytch/vanilla-js"
import { SESSION_DURATION_MINUTES, STYTCH_CONFIG } from "../authentication/stytchConfig"
import { LoginContainer } from "../components/LoginContainer/LoginContainer"
import toast from "react-hot-toast"
import { CircularProgress } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

export const Authenticate = () => {
  const stytchClient = useStytch()
  const { session } = useStytchSession()
  const navigate = useNavigate();
  const hasCalledAuthenticate = useRef(false);
  const { t } = useTranslation();

  const token = new URLSearchParams(window.location.search).get("token")

  const authenticate = useCallback(async () => {
    if (hasCalledAuthenticate.current) return;
    hasCalledAuthenticate.current = true;
    if (token) {
      try {
        await stytchClient.magicLinks.authenticate(token, {
          session_duration_minutes: SESSION_DURATION_MINUTES,
        })
        navigate("/dashboard")
      } catch {
        toast.error(t("error.loginLinkExpired"))
        navigate("/")
      }
    } else {
      toast.error(t("error.noToken"))
      navigate("/")
    }
  }, [token, stytchClient.magicLinks, navigate, t])

  useEffect(() => {
    if (token && !session) {
      authenticate()
    } else if (session) {
      navigate("/dashboard")
    } else {
      toast.error(t("error.noToken"))
      navigate("/")
    }
  }, [token, session, navigate, authenticate, t])
  return (
    <LoginContainer>
      <CircularProgress />
    </LoginContainer>
  )
}

export const ResetPassword = () => {
  const navigate = useNavigate()
  const passwordResetToken = new URLSearchParams(window.location.search).get("token")

  const callbacks: Callbacks = {
    onEvent: (event) => {
      if ((event.type === "AUTHENTICATE_FLOW_COMPLETE") || (event.type === "PASSWORD_RESET_BY_EMAIL" && event.data?.user)) {
        navigate("/dashboard")
      }
    },
  }

  if (passwordResetToken) {
    return (
      <LoginContainer>
        <StytchPasswordReset config={STYTCH_CONFIG} passwordResetToken={passwordResetToken} callbacks={callbacks} />
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
