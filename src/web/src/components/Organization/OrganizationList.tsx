import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link as RouterLink } from "react-router-dom"
import { Business, ErrorOutlined } from "@mui/icons-material"
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Paper,
  Container,
  TableSortLabel,
  CircularProgress,
} from "@mui/material"
import { useAuth } from "../../authentication/AuthContext"
import { useGetOrganizationsList } from "../../hooks/useOrganizations"
import { useOrganizationsService } from "../../hooks/useOrganizationsService"
import { Organization } from "../../models/organization"
import { getCategoryColor, getCategoryLabel } from "../../utils/organizationUtils"

type Order = "asc" | "desc"

function getComparator<Key extends keyof Organization>(
  order: Order,
  orderBy: Key,
): (a: Organization, b: Organization) => number {
  return order === "asc"
    ? (a, b) => {
        if (a[orderBy] === undefined) return 1
        if (b[orderBy] === undefined) return -1
        const aValue = a[orderBy]
        const bValue = b[orderBy]
        if (aValue === bValue) return 0
        return aValue > bValue ? 1 : -1
      }
    : (a, b) => {
        if (a[orderBy] === undefined) return 1
        if (b[orderBy] === undefined) return -1

        const aValue = a[orderBy]
        const bValue = b[orderBy]
        if (aValue === bValue) return 0
        return aValue < bValue ? 1 : -1
      }
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Organization
  label: string
  numeric: boolean
  translationKey: string
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    translationKey: "organization.name",
  },
  {
    id: "shortName",
    numeric: false,
    disablePadding: false,
    label: "Short Name",
    translationKey: "organization.short_name",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Category",
    translationKey: "organization.category.label",
  },
  {
    id: "memberCount",
    numeric: true,
    disablePadding: false,
    label: "Members",
    translationKey: "organization.member_count",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    translationKey: "organization.email",
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Organization) => void
  order: Order
  orderBy: string
}

function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
  const { order, orderBy, onRequestSort } = props
  const { t } = useTranslation()
  const createSortHandler =
    (property: keyof Organization) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {t(headCell.translationKey)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export const OrganizationsList = () => {
  const { t } = useTranslation()
  const { session, treyUser } = useAuth()

  const sessionJwt = useMemo(() => session?.access_token, [session])
  const organizationsService = useOrganizationsService(treyUser?.role, sessionJwt)
  const { data: organizations, isFetching, isError } = useGetOrganizationsList(organizationsService)

  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<keyof Organization>("name")

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Organization) => {
    const isAsc = orderBy === property && order === "asc"
    const isDesc = orderBy === property && order === "desc"
    if (isAsc) {
      setOrder("desc")
      setOrderBy(property)
    } else if (isDesc) {
      setOrder("asc")
      setOrderBy("name")
    } else {
      setOrder("asc")
      setOrderBy(property)
    }
  }

  const sortedOrganizations = useMemo(() => {
    return organizations ? [...organizations].sort(getComparator(order, orderBy)) : []
  }, [organizations, order, orderBy])

  if (isFetching) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          gap: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography color="text.secondary">{t("pages.organizations.loading")}</Typography>
        <CircularProgress />
      </Box>
    )
  } else if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <ErrorOutlined fontSize="large" color="error" />
        <Typography color="error.main">{t("pages.organizations.error")}</Typography>
      </Box>
    )
  }

  return (
    <Container>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Business sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4">{t("pages.organizations.title")}</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {sortedOrganizations?.map((org) => (
                  <TableRow
                    key={org.id}
                    component={RouterLink}
                    to={`/organizations/${org.id}`}
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography>{org.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary">{org.shortName || "-"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(org.category, t)}
                        color={getCategoryColor(org.category)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>{org.memberCount}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary">{org.email}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {organizations?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">
            {t("pages.organizations.no_organizations")}
          </Typography>
        </Box>
      )}
    </Container>
  )
}
