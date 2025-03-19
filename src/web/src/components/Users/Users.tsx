import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import { Chip, Container, IconButton } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { getUsers } from "../../api/users"
import { Roles } from "../../authentication"
import { User } from "../../models/user"

const UserBadge = ({ role }: { role: Roles | undefined }) => {
  switch (role) {
    case Roles.ADMIN:
      return <Chip size="small" sx={{ backgroundColor: "#db6e00", color: "white" }} label="Admin" />
    case Roles.TREY_BOARD:
      return <Chip size="small" sx={{ backgroundColor: "#006069", color: "white" }} label="TREY" />
    case Roles.ORGANISATION:
      return (
        <Chip
          size="small"
          sx={{ backgroundColor: "#009c15", color: "white" }}
          label="Organisation"
        />
      )
    case Roles.PENDING_APPROVAL:
      return (
        <Chip
          size="small"
          sx={{ backgroundColor: "#9c0005", color: "white" }}
          label="Pending approval"
        />
      )
    default:
      return <Chip size="small" color="default" label="Unknown" />
  }
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data)
    })
  }, [])

  const columns: GridColDef<User>[] = [
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/users/${params.row.userId}`}>
          <IconButton size="small">
            <AccountBoxIcon />
          </IconButton>
        </Link>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      valueGetter: (_value, row) => row.trustedMetadata?.role,
      renderCell: (params) => <UserBadge role={params.value} />,
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      valueGetter: (_value, row) => row.emails[0].email,
    },
    {
      field: "fullName",
      headerName: "Full name",
      sortable: false,
      width: 160,
      valueGetter: (_value, row) => `${row.name?.firstName || ""} ${row.name?.lastName || ""}`,
    },
  ]

  return (
    <Container sx={{ p: 1 }}>
      <h1>Users</h1>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.userId}
        disableRowSelectionOnClick
      />
    </Container>
  )
}

export default Users
