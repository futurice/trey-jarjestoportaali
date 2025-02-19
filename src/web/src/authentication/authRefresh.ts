import { useEffect } from "react"
import { useStytch } from "@stytch/react"

export const useRefreshSession = () => {
  const stytch = useStytch()
  useEffect(() => {
    const authenticate = () => {
      if (stytch.session.getSync()) {
        stytch.session.authenticate({
          session_duration_minutes: 30,
        })
      }
    }
    // Refresh session every 25 minutes
    const interval = setInterval(authenticate, 25 * 60000)
    return () => clearInterval(interval)
  }, [stytch])
}
