import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import EditIcon from "@mui/icons-material/Edit"
import { Container, IconButton } from "@mui/material"
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid"
import { fiFI, enUS } from "@mui/x-data-grid/locales"
import { useStytch } from "@stytch/react"
import { useAuth } from "../../hooks/useAuth"
import { useOrganizationService } from "../../hooks/useOrganizationService"
import { useOrganizations } from "../../hooks/useOrganizations"

export const Organizations: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { session } = useStytch()
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session])
  const navigate = useNavigate()

  const organizationService = useOrganizationService(user?.role, sessionJwt)
  const { organizations, loading } = useOrganizations(organizationService)

  const columns: GridColDef[] = [
    {
      field: "profile",
      type: "actions",
      width: 50,
      hideable: false,
      resizable: false,
      renderHeader: () => <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />,
      getActions: (params) => {
        return [
          <IconButton onClick={() => navigate(`/organizations/${params.row.id}`)}>
            <AccountCircleIcon />
          </IconButton>,
        ]
      },
    },
    { field: "name", headerName: t("name"), width: 400 },
    { field: "email", headerName: t("email"), width: 300 },
  ]

  return (
    <Container>
      <h1>{t("navigation.organizations")}</h1>
      <DataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        localeText={
          (i18n.language === "fi" ? fiFI : enUS).components.MuiDataGrid.defaultProps.localeText
        }
        rows={organizations}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[20, 50, 75, 100, { value: -1, label: t("common.all") }]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        autosizeOnMount
        loading={loading}
      />
    </Container>
  )
}
