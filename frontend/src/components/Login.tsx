import { StytchLogin } from "@stytch/react"
import { Callbacks, Products } from "@stytch/vanilla-js"
import { Container } from "@radix-ui/themes"

const Login = () => {
  const REDIRECT_URL = "http://localhost:5173/dashboard"
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
    <Container align="center" width={"auto"}>
      <StytchLogin
        config={config}
        callbacks={callbacks}
        styles={{
          logo: {
            logoImageUrl: "https://trey.fi/media/trey_tunnus_musta-1.png",
          },
        }}
      />
    </Container>
  )
}

export default Login
