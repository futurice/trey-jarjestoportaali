import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react"
import toast from "react-hot-toast"
import { AuthError, Session, User } from "@supabase/supabase-js"
import { authorizeUser } from "../services/authService"
import { Roles } from "./Roles"
import { supabase } from "./authClient"

export interface AuthContextType {
  session: Session | null
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  logout: () => void
  user: User | null
  treyUser: TreyUser | null
  signIn: ({
    username,
    password,
    callbackFunction,
  }: {
    username: string
    password: string
    callbackFunction: () => void
  }) => Promise<void>
  forgotPasswordRequest: (email: string) => Promise<RequestResponse>
  resetPassword: (newPassword: string) => Promise<RequestResponse>
}

export interface RequestResponse {
  success: boolean
  message?: string
}

interface AuthProviderProps {
  children: ReactNode
}

export interface TreyUser {
  id: string
  role: Roles
  organizationId: string | null
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error checking auth status:", error)
        // Clear invalid data
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const signIn = useCallback(
    async ({
      username,
      password,
      callbackFunction,
    }: {
      username: string
      password: string
      callbackFunction: () => void
    }) => {
      setIsLoading(true)
      authorizeUser(username, password)
        .then(async (res) => {
          supabase.auth
            .setSession({
              access_token: res.accessToken,
              refresh_token: res.refreshToken,
            })
            .then(({ data, error }) => {
              if (error) {
                toast.error("Error setting session: " + error.message)
              } else if (data.session) {
                toast.success("Successfully signed in!")
                setSession(data.session)
                setUser(data.user)
                // Execute the callback function after successful sign-in
                callbackFunction()
              }
            })
            .catch((err) => {
              toast.error("Error during sign-in: " + err.message)
            })
        })
        .catch((err) => {
          toast.error("Error authorizing user: " + err.message)
        })
        .finally(() => setIsLoading(false))
    },
    [],
  )

  const forgotPasswordRequest = useCallback(async (email: string): Promise<RequestResponse> => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        toast.error("Error sending reset password email: " + error.message)
        return { success: false, message: error.message }
      } else {
        toast.success("Password reset email sent!")
        return { success: true }
      }
    } catch (err: AuthError | unknown) {
      toast.error("Error during password reset request: " + (err as AuthError).message)
      return { success: false, message: (err as AuthError).message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (newPassword: string): Promise<RequestResponse> => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) {
        toast.error("Error resetting password: " + error.message)
        return { success: false, message: error.message }
      } else {
        toast.success("Password has been reset successfully!")
        return { success: true }
      }
    } catch (err: AuthError | unknown) {
      toast.error("Error during password reset: " + (err as AuthError).message)
      return { success: false, message: (err as AuthError).message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const treyUser = useMemo((): TreyUser | null => {
    if (!user) {
      return null
    }

    return {
      id: user.id,
      role: (user.user_metadata?.trey_role as Roles) || Roles.NONE,
      organizationId: user.user_metadata?.organization_id || null,
    }
  }, [user])

  const logout = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error("Error during logout: " + error.message)
        return
      }
    } catch (err: AuthError | unknown) {
      toast.error("Unexpected error during logout: " + (err as AuthError).message)
    } finally {
      setSession(null)
      setUser(null)
    }
  }, [])

  const value: AuthContextType = useMemo(
    () => ({
      session,
      isLoading,
      setIsLoading,
      logout,
      user,
      treyUser,
      signIn,
      forgotPasswordRequest,
      resetPassword,
    }),
    [session, isLoading, logout, user, treyUser, signIn, forgotPasswordRequest, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
