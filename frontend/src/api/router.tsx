import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useStytchUser } from "@stytch/react"

interface IRouteProps {
  component: any
}

/**
 * Returns a protected route if the user is logged in, otherwise shows the login page.
 * @param component Component to render if the user is logged in.
 * @returns The component passed as parameter if the user is logged in, otherwise the login page.
 */
export const ProtectedRoute = ({ component: Component, ...rest }: IRouteProps): ReactNode => {
  const { user } = useStytchUser()

  if (user) {
    return <Component {...rest} />
  } else {
    return <Navigate to="/login" />
  }
}

/**
 * Returns a guest route if the user is not logged in, otherwise redirects to the home page.
 * @param component Component to render if the user is not logged in.
 * @returns The component passed as parameter if the user is not logged in, otherwise the front page.
 */
export const GuestRoute = ({ component: Component, ...rest }: IRouteProps): ReactNode => {
  const { user } = useStytchUser()

  if (!user) {
    return <Component {...rest} />
  } else {
    return <Navigate to="/" />
  }
}
