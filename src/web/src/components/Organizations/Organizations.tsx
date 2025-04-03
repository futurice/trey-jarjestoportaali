import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Container } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useStytch } from "@stytch/react"
import { useAuth } from "../../hooks/useAuth"
import { useOrganizationService } from "../../hooks/useOrganizationService"
import { useOrganizations } from "../../hooks/useOrganizations"

export const Organizations: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { session } = useStytch()
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])

  const organizationService = useOrganizationService(user?.role, sessionJwt)
  const { organizations, loading } = useOrganizations(organizationService)

  const columns: GridColDef[] = [
    { field: "name", headerName: t("organization.name"), width: 300 },
    { field: "email", headerName: t("organization.email"), width: 200 },
  ]

  return (
    <Container>
      <h1>{t("organizations")}</h1>
      <DataGrid
        rows={organizations}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[20, 50, 75, 100, { value: -1, label: t("common.all") }]}
        autosizeOnMount
        loading={loading}
      />
    </Container>
  )
}
