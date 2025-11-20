import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import { useAuth } from "./AuthContext.tsx"
import { Roles } from "./Roles.tsx"

interface AuthenticatedProps {
  children: ReactNode
  requiredRoles?: string[]
  redirectUrl?: string
}

// This component is used to protect routes that require authentication and specific roles.
export const Authenticated = ({
  children,
  requiredRoles = [],
  redirectUrl = "/",
}: AuthenticatedProps) => {
  const location = useLocation()
  const { isLoading, session, user } = useAuth()

  if (isLoading) {
    return <CircularProgress />
  } else if (!isLoading && !session?.user) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  // The role is stored in the trusted_metadata field of the user object in Supabase.
  const role = (user?.user_metadata?.trey_role as string) ?? Roles.NONE
  const organizationId = user?.user_metadata?.organization_id ?? null

  if (!organizationId && role !== Roles.ADMIN && role !== Roles.TREY_BOARD) {
    // If the user is logged in but does not have an organization ID, redirect to the no organization page.
    return <Navigate to="/error/no-organization" state={{ from: location }} />
  }
  // If the user is logged in but does not have the required role, redirect to the specified URL.
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to={redirectUrl} state={{ from: location }} />
  }

  // If the user is logged in and has the required role, render the children.
  return <>{children}</>
}
