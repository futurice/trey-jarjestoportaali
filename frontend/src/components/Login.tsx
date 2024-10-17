import { StytchLogin } from "@stytch/react"
import { Callbacks, Products } from "@stytch/vanilla-js"
import { LoginContainer } from "../components/LoginContainer/LoginContainer"

const Login = () => {
  const REDIRECT_URL = "/dashboard"
  const config = {
    products: [Products.passwords],
    passwordOptions: {
      loginExpirationMinutes: 30,
      loginRedirectURL: REDIRECT_URL,
      resetPasswordExpirationMinutes: 30,
      resetPasswordRedirectURL: REDIRECT_URL,
    },
  }

  const callbacks: Callbacks = {
    onEvent: (event) => {
      // TODO: add more event types as needed
      console.log(event)
      if (
        (event.type === "AUTHENTICATE_FLOW_COMPLETE" || event.type === "PASSWORD_AUTHENTICATE") &&
        event.data?.user
      ) {
        window.location.href = REDIRECT_URL
      }
    },
  }

  return (
    <LoginContainer>
      <StytchLogin
        config={config}
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
