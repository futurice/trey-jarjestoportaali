import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { CircularProgress, Container } from "@mui/material"
import { useStytch } from "@stytch/react"
import { useAuth } from "../../hooks/useAuth"
import { useOrganizationService } from "../../hooks/useOrganizationService"
import { useGetOrganizationById } from "../../hooks/useOrganizations"
import SubPage from "../SubPage/SubPage"

export const OrganizationPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { session } = useStytch()
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])

  const organizationService = useOrganizationService(user?.role, sessionJwt)
  const { organization, loading } = useGetOrganizationById(organizationService, id || "")

  if (loading) {
    return (
      <Container sx={{ padding: 2 }}>
        <CircularProgress />
      </Container>
    )
  } else if (!organization) {
    return (
      <Container sx={{ padding: 2 }}>
        <h1>Organization not found</h1>
        <Link to="/organizations">Palaa takaisin</Link>
      </Container>
    )
  }
  return (
    <SubPage rootUrl="/organizations">
      <h1>{organization.name}</h1>
      <p>This is the organization page.</p>
      {id}
    </SubPage>
  )
}
